/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 06-19-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class StatusDataTableController {
    @AuraEnabled( cacheable = true )
    public static List<Plz_Metadata_Status__c> fetchMedataDataStatus(String period) {
        System.debug('fetchMedataDataStatus '+period);
        Integer days = Integer.valueof(period);
        System.debug('days '+days);

        date d = system.today().addDays(-days);
        System.debug('-----d '+d);

        return [ SELECT Id, Plz_Name__c, toLabel(Plz_type__c) type, Plz_type__c, Plz_Status__c, Plz_Path__c, Plz_Last_Time_Analyzed__c, Plz_flag__c, Plz_Icon__c
                   FROM Plz_Metadata_Status__c
                   WHERE Plz_Last_Time_Analyzed__c >=: d
                   WITH SECURITY_ENFORCED ];
         
    }
    @AuraEnabled( cacheable = true )
    public static List<Queries__mdt> fetchQueriesMdt() {
     
        return [ SELECT Id, ObjectLabel__c, ObjectName__c, QueryText__c
                   FROM Queries__mdt
                   WITH SECURITY_ENFORCED];
         
    }
    
}