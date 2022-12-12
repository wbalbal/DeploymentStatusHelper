import { Org, SfProject } from "@salesforce/core";
import { AnyJson } from '@salesforce/ts-types';
import { SourceTracking } from '@salesforce/source-tracking';
import { ComponentSet, MetadataResolver } from '@salesforce/source-deploy-retrieve';
import { FlagsPayload, NewOldRecords, SingleTypeLog, StatusOutputRow, StatusRowRequest } from "../types";
const fs = require("fs")
const path = require("path")
import { promisify } from 'util';
const prompt = require("prompt-sync")({ sigint: true });
const writeFile = promisify(fs.writeFile);

export default class SyncLib {
	private org: Org;
	private project: SfProject;
	private flagsPayload: FlagsPayload;
    private defaultRootMetadataPath: string = './force-app/main/default';

	constructor(org: Org, project: SfProject, flagsPayload: FlagsPayload) {
		this.org = org;
		this.project = project;
		this.flagsPayload = flagsPayload;
	}

    public async run(): Promise<AnyJson> {
        const tracking = await SourceTracking.create({
            org: this.org,
            project: this.project,
          });
        const statusList: StatusOutputRow[] = await tracking.getStatus({
            local: true,
            remote: true,
        });
        await this.hundleSync(statusList, this.flagsPayload.saveRecords);
        if(this.flagsPayload.interactive && false){ //keep it to next release
            await this.syncMetadata(statusList);
        }
        return { success: true };
    }

    private async syncMetadata(statusRowList: StatusOutputRow[]): Promise<AnyJson> {
        for(const status of statusRowList){
            // if(status.origin === "local" && (status.state === "add" || status.state === "modify")){
            //     const deployJob = await ComponentSet
            //         .fromSource(status.filePath)
            //         .deploy({ usernameOrConnection: this.org.getUsername() });

            //     const result = await deployJob.pollStatus();
            //     console.log(result.getFileResponses());
            // }
            // if(status.origin === "local" && status.state === "delete"){
            //     const retrieveJob = await ComponentSet
            //         .fromSource(status.filePath)
            //         .retrieve({
            //             usernameOrConnection: this.org.getUsername(),
            //             output: './force-app',
            //             merge: true
            //         });
            //     const result = await retrieveJob.pollStatus();
            //     console.log(result.getFileResponses());
            // }
            if(status.origin === "remote" && (status.state === "add" || status.state === "modify")){
                let userConfirmation = prompt(`Metadata ${status.fullName} has been changes or added in you remote org ${this.org.getUsername()}, Would you like to retrieve it to you local? Y(yes), N(no)`);
                if (userConfirmation.toLowerCase() === 'y'){
                    const componentSet = new ComponentSet();
                    componentSet.add({fullName: status.fullName, type: status.type});
                    const retrieveJob = await componentSet
                        .retrieve({
                            usernameOrConnection: this.org.getUsername(),
                            output: './force-app',
                            merge: true
                        });
                    const result = await retrieveJob.pollStatus();
                    //console.log(result.getFileResponses());
                }
            }
        }
        return { success: true };
    }

    private async hundleSync(statusRowList: StatusOutputRow[], saveRecords: boolean): Promise<AnyJson> {
        try {
            const statusRowRequestList = await this.processSyncStatus(statusRowList);
            const statusListByOrigin = await this.groupByKey(statusRowRequestList, 'origin');
            
            const localAddChanges: SingleTypeLog[] = await this.getStatusListByOrigin(statusListByOrigin, 'local add');
            const localModifyChanges = await this.getStatusListByOrigin(statusListByOrigin, 'local modify');
            const localDeleteChanges = await this.getStatusListByOrigin(statusListByOrigin, 'local delete');
            const remoteAddChanges = await this.getStatusListByOrigin(statusListByOrigin, 'remote add');
            const remoteDeleteChanges = await this.getStatusListByOrigin(statusListByOrigin, 'remote delete');
            const remoteModifyChanges = await this.getStatusListByOrigin(statusListByOrigin, 'remote modify');
            
            if (!fs.existsSync('./deployChanges')){
                fs.mkdirSync('./deployChanges', { recursive: true });
            }
            if (!fs.existsSync('./retrieveChanges')){
                fs.mkdirSync('./retrieveChanges', { recursive: true });
            }
            
            const localAddComponentSet = new ComponentSet();
            for(const component of [...localModifyChanges, ...localAddChanges]){
                localAddComponentSet.add({fullName: component.name, type: component.type});
            }
            const localAddPackageXML = await localAddComponentSet.getPackageXml(4);
            await writeFile(`./deployChanges/package.xml`, localAddPackageXML, { encoding: 'utf8' });

            const localDeleteComponentSet = new ComponentSet();
            for(let component of localDeleteChanges){
                localDeleteComponentSet.add({fullName: component.name, type: component.type});
            }
            const localModifyPackageXML = await localDeleteComponentSet.getPackageXml(4);
            await writeFile(`./deployChanges/destructiveChanges.xml`, localModifyPackageXML, { encoding: 'utf8' });

            const remoteAddComponentSet = new ComponentSet();
            for(let component of [...remoteModifyChanges, ...remoteAddChanges]){
                remoteAddComponentSet.add({fullName: component.name, type: component.type});
            }
            const remoteAddPackageXML = await remoteAddComponentSet.getPackageXml(4);
            await writeFile(`./retrieveChanges/package.xml`, remoteAddPackageXML, { encoding: 'utf8' });

            const remoteDeleteComponentSet = new ComponentSet();
            for(let component of remoteDeleteChanges){
                remoteDeleteComponentSet.add({fullName: component.name, type: component.type});
            }
            const remoteModifyPackageXML = await remoteDeleteComponentSet.getPackageXml(4);
            await writeFile(`./retrieveChanges/destructiveChanges.xml`, remoteModifyPackageXML, { encoding: 'utf8' });


            
            if(saveRecords && false){ // keep it for the next release
                // const ids: string[] = (await this.org.getConnection().query<StatusRowRequest>(
                //     `select Id, Plz_type__c, Plz_Status__c, Plz_Path__c, Plz_Name__c 
                //         from Plz_Metadata_Status__c`
                // )).records.map(s => s.Id);
                // this.org.getConnection().destroy('Plz_Metadata_Status__c', ids);
                const newOldRecords = await this.prepareRecordsForDatabase(statusRowRequestList);
                //console.log(newOldRecords.existingRecord.filter(status => status.Plz_Status__c === 'Not Synchronized'));
                const insertResult = await this.org.getConnection()
                    .insert( "Plz_Metadata_Status__c", newOldRecords.newRecords);
                const updateResult = await this.org.getConnection()
                    .update( "Plz_Metadata_Status__c", newOldRecords.existingRecord);
                console.log([...insertResult, ...updateResult].map(r => r.errors));
            }
            return { success: true };
        } catch (error) {
            //console.log(`Could not insert your SyncStatus list due to reason: ${error}`);
            return { success: false };
        }
    }

    private async getStatusListByOrigin(statusList, origin){
        if(statusList[origin]){
            const formattedList = statusList[origin].map(status => ({
                    type: status.Plz_type__c,
                    name: status.Plz_Name__c,
                    filepath: status.Plz_Path__c,
                }
            ));
            console.log(`${origin} diff:`);
            console.log(formattedList);
        }
        return [];
    }

    private async groupByKey(array, key) {
        return array
          .reduce((hash, obj) => {
            if(obj[key] === undefined) return hash; 
            return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
          }, {})
     }

    private async prepareRecordsForDatabase(statusRowList: StatusRowRequest[]): Promise<NewOldRecords>{
        let newOldRecord: NewOldRecords = {existingRecord: [], newRecords: []};
        const statusExistingRecords: StatusRowRequest[] = (await this.org.getConnection().query<StatusRowRequest>(
            `select Id, Plz_type__c, Plz_Status__c, Plz_Path__c, Plz_Name__c 
                from Plz_Metadata_Status__c`
        )).records;
        if(!statusExistingRecords){
            throw new Error("Could not fetch existing records from Plz_Metadata_Status__c");         
        }
        //@ts-ignore: The mismatching between Id optional/required between objects is insured with the filter
        newOldRecord.existingRecord = statusRowList.filter(status => !!statusExistingRecords.find(
                existingRecord => existingRecord.Plz_Path__c === status.Plz_Path__c
            )
        ).map(record =>({
            ...record,
            Id: statusExistingRecords.find(
                existingRecord => existingRecord.Plz_Path__c === record.Plz_Path__c
            ).Id,
            origin: undefined,
        }));
        newOldRecord.newRecords = statusRowList.filter(status => statusExistingRecords.find(
            existingRecord => existingRecord.Plz_Path__c === status.Plz_Path__c
        ) === undefined).map(record =>({
            ...record,
            origin: undefined,
        }));

        return newOldRecord;
    }

    private async processSyncStatus(statusList: StatusOutputRow[]): Promise<StatusRowRequest[]>{
        let updatedStatusList: StatusRowRequest[] = [];
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; 
        let dd = today.getDate();
        let ddStr = dd.toString();
        let mmStr = mm.toString();
        if (dd < 10) ddStr = '0' + dd;
        if (mm < 10) mmStr = '0' + mm;

        const formattedToday = yyyy+'-'+mm+'-'+dd;
        const metaDataFiles = await this.getAllMetadataFiles(this.defaultRootMetadataPath);
        const statusListMetaDataFiles = statusList.filter(status => status.filePath)
            .map(status => status.filePath);
        const metaDataFilesSet = [...new Set([...metaDataFiles, ...statusListMetaDataFiles])]
        for(let metadataFile of metaDataFilesSet){
            if(!metadataFile.includes('-meta.xml')){
                metadataFile = metadataFile + '-meta.xml';
            }
            const matchingStatus = statusList.find(status => status.filePath === metadataFile);
            if(!!matchingStatus){
                updatedStatusList.push({
                    Plz_Status__c: 'Not Synchronized',
                    Plz_Name__c: matchingStatus.fullName,
                    Plz_Path__c: matchingStatus.filePath,
                    Plz_type__c: matchingStatus.type,
                    Plz_Last_Time_Analyzed__c: formattedToday,
                    origin: `${matchingStatus?.origin} ${matchingStatus?.state}`,
                })
            }else{
                const resolver = new MetadataResolver();
                try {
                    const metadata = resolver.getComponentsFromPath(metadataFile);
                    const sourceComponent =  metadata.pop();
                    updatedStatusList.push({
                        Plz_Status__c: 'Synchronized',
                        Plz_Name__c: sourceComponent.fullName,
                        Plz_Path__c: metadataFile,
                        Plz_type__c: sourceComponent.type.name,
                        Plz_Last_Time_Analyzed__c: formattedToday,
                        origin: `${matchingStatus?.origin} ${matchingStatus?.state}`,
                    })
                } catch (error) {}
            }
        }
        return updatedStatusList;
    }

    private async getAllMetadataFiles(dirPath, arrayOfFiles?): Promise<string[]> {
        let files: string[] = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];
      
        for(const file of files){
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = await this.getAllMetadataFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                if(path.extname(file) === '.xml'){
                    arrayOfFiles.push(path.join(dirPath, "/", file)?.replace('-meta.xml', ''));
                }
            }
        }
      
        return arrayOfFiles
    }

}

