public with sharing class LeaveRequestSampleData {
    public static void createData(){
        Id currentUserId=UserInfo.getUserId();
        List<Leave_Request__c> leaves=new List<Leave_Request__c>();
        leaves.Add(new Leave_Request__c(User__c=currentUserId,From_Date__c=Date.newInstance(2023, 03, 10),To_Date__c=Date.newInstance(2023, 03, 11),
        Reason__c='Sick Leave',Status__c='Approved'));

        leaves.Add(new Leave_Request__c(User__c=currentUserId,From_Date__c=Date.newInstance(2023, 03, 15),To_Date__c=Date.newInstance(2023, 03, 15),
        Reason__c='Emergency Leave',Status__c='Pending'));

        leaves.Add(new Leave_Request__c(User__c=currentUserId,From_Date__c=Date.newInstance(2023, 03, 19),To_Date__c=Date.newInstance(2023, 03, 19),
        Reason__c='For personal reason',Status__c='Rejected'));

        insert leaves;
    }
}