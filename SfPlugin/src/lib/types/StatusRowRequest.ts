export interface StatusRowRequest {
    Id?: string,
    Plz_type__c : string,
    Plz_Status__c : string,
    Plz_Path__c : string,
    Plz_Name__c : string,
    Plz_Last_Time_Analyzed__c : string,
    origin?: string;
}