import { LightningElement, wire } from 'lwc';
import fetchMetaDataStatusRecord from '@salesforce/apex/StatusDataTableController.fetchMedataDataStatus';
import fetchQueries from '@salesforce/apex/StatusDataTableController.fetchQueriesMdt';
export default class StatusDataTable extends LightningElement {

        records;
        sortedColumn;
        sortedDirection;
        selectedValue = 'All';
        options = [];
        queriesData;
        error;
    
        connectedCallback(){
            console.log(' connected call back ');

            fetchQueries()
            .then(result => {
                console.log(' result '+JSON.stringify(result));
                this.queriesData = result;
                this.error = undefined;
                let opts = [{label:'All', value:'All'}];
                for(let key in result) {
                    opts.push({label:result[key].ObjectLabel__c, value:result[key].ObjectName__c});
                }

                this.options = opts;
               
                console.log(' options '+JSON.stringify(this.options));
                

            })
            .catch(error => {
                this.error = error;
                this.queriesData = undefined;
            })
        }
        // get options() {
        
        // }
    
        handleChange( event ) {
    
            this.selectedValue = event.detail.value;
            if ( this.selectedValue === 'All' )
                this.records = this.initialRecords;
            else
                this.filter();
    
        }
    
        @wire( fetchMetaDataStatusRecord )  
        wiredRecords( { error, data } ) {
    
            if (data) {
                console.log(' dataa '+JSON.stringify(data));
                this.records = data;
                this.initialRecords = data;
                this.error = undefined;
                this.sortedColumn = "Plz_type__c";
                this.sortRecs();
    
            } else if ( error ) {
    
                this.error = error;
                this.initialRecords = undefined;
                this.records = undefined;
    
            }
    
        }  
    
        sortRecs( event ) {
    
            let colName = event ? event.target.Plz_type__c : undefined;
            console.log( 'Column Name is ' + colName );
    
            if ( this.sortedColumn === colName )
                this.sortedDirection = ( this.sortedDirection === 'asc' ? 'desc' : 'asc' );
            else
                this.sortedDirection = 'asc';
    
            let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
    
            if ( colName )
                this.sortedColumn = colName;
            else
                colName = this.sortedColumn;
    
            this.records = JSON.parse( JSON.stringify( this.records ) ).sort( ( a, b ) => {
                a = a[ colName ] ? a[ colName ].toLowerCase() : 'z';
                b = b[ colName ] ? b[ colName ].toLowerCase() : 'z';
                return a > b ? 1 * isReverse : -1 * isReverse;
            });
    
        }
    
        filter() {  
               console.log('this.selectedValue '+this.selectedValue);
               console.log('this.records '+JSON.stringify(this.records));
            if ( this.selectedValue ) {  
    
                this.records = this.initialRecords;
     
                if ( this.records ) {
    
                    let recs = [];
                    for ( let rec of this.records ) {
    
                        console.log( 'Rec is ' + JSON.stringify( rec ) );
    
                        if ( rec.Plz_type__c === this.selectedValue ) {
    
                            recs.push( rec );
                    
                        }
                        
                    }
    
                    console.log( 'Recs are ' + JSON.stringify( recs ) );
                    this.records = recs;
    
                }
     
            }  else {
    
                this.records = this.initialRecords;
    
            }
     
        }  
    
    }