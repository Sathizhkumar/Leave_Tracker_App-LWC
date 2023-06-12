public with sharing class LeaveRequestController {

    // Get all the records which created by native user.
    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getLeave(){
        try{
            List<Leave_Request__c> myLeaves = new List<Leave_Request__c>();
                myLeaves = [select Id, From_Date__c, Name, Manager_Comment__c, Reason__c, Status__c, To_Date__c, User__c, CreatedDate FROM Leave_Request__c WHERE 
                User__c =:UserInfo.getUserId() ORDER BY CreatedDate Desc];
                return myLeaves;
        }
        catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

// Get leaves respective to related manager records only.
    @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getMyLeave(){
        try{
            List<Leave_Request__c> myLeaves = new List<Leave_Request__c>();
                myLeaves = [select Id, From_Date__c, Name, Manager_Comment__c, Reason__c, Status__c, To_Date__c, CreatedDate, User__r.ManagerId, User__r.Name
                FROM Leave_Request__c WHERE 
                User__r.ManagerId =:UserInfo.getUserId() ORDER BY CreatedDate Desc];
                return myLeaves;
        }
        catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
}