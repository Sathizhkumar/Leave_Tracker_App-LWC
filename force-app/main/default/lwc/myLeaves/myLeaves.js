import { LightningElement, track, wire } from 'lwc';
import getLeavefromapex from "@salesforce/apex/LeaveRequestController.getLeave";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Req ID', fieldName: 'Name', type: 'text', cellAttributes: { class: {fieldName: 'cellclass' }} },
    { label: 'FROM DATE', fieldName: 'From_Date__c', type: 'date' , cellAttributes: { class: {fieldName: 'cellclass' }} },
    { label: 'TO DATE', fieldName: 'To_Date__c', type: 'date', cellAttributes: { class: {fieldName: 'cellclass' }}  },
    { label: 'REASON', fieldName: 'Reason__c', type: 'text' , cellAttributes: { class: {fieldName: 'cellclass' }} },
    { label: 'STATUS', fieldName: 'Status__c', type: 'text' , cellAttributes: { class: {fieldName: 'cellclass' }} },
    {
        type: "button", typeAttributes: {
            label: 'Edit',
            title: 'Edit',
            type: 'edit',
            name: 'Edit',
            disabled: {fieldName : 'isEditDisabled'},
        }, cellAttributes: { class: {fieldName: 'cellclass' }}
    }
];

export default class MyLeaves extends LightningElement {
    columns = columns; 
    getLeaves = [];
    objectApiName= 'Leave_Request__c';
    recordId = '';
    showpopupmodal = false;
    leaveRequestwireResult;
    curerntuserName = Id;

    // To track the counts
    pendingCount = 0;
    approvedCount = 0;
    rejectedCount = 0;
    
    searchTerm = '';
    originalLeaves = [];

    @track isLoading = false;

    @wire(getLeavefromapex)
    getLeaveResult(result){
        this.leaveRequestwireResult = result;
        this.isLoading = true;
        if(result.data){
            this.getLeaves = result.data.map(a =>({
                ...a,
                cellclass: a.Status__c=='Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' :'',
                isEditDisabled: a.Status__c != 'Pending'
            }));
            this.updateCountsAndFilterData();
            this.isLoading = false; 
        }
        if(result.error){
            console.log('Fetching failed ', result.error);
            this.isLoading = false;
        }
    } 

    //If no records are in getLeaves it will show in UI.
    get noRecordsFound(){
        return this.getLeaves.length == 0;
    }

    newRequestHandler(){
        this.showpopupmodal = true;
        this.recordId = '';
    }

    closepopup(){
     this.showpopupmodal = false;
    }

    modalhandler(event){
        this.showpopupmodal = true;
        this.recordId = event.detail.row.Id;
    }

    //validation while submitting
    submitHandler(event){
        event.preventDefault();
        const fields = {...event.detail.fields};
        fields.Status__c = 'Pending';
        if(new Date(fields.From_Date__c) > new Date(fields.To_Date__c)){
            this.showToast('From date should not be greater than the To Date', 'Error', 'error');
        }
        else if(new Date() > new Date(fields.From_Date__c)){
            this.showToast('From date should be greater than Today', 'Error', 'error');
        }
        else{
            this.refs.leaveRequestform.submit(fields);
        }
    }

    successToastHandler(event){
        this.showpopupmodal = false;
        this.showToast('Data saved successfully');
        refreshApex(this.leaveRequestwireResult);
    }

    showToast(message, title = 'success', variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    updateCountsAndFilterData() {
    // Calculate the counts and filter the data based on the search term
    this.pendingCount = this.getLeaves.filter(leave => leave.Status__c === 'Pending').length;
    this.approvedCount = this.getLeaves.filter(leave => leave.Status__c === 'Approved').length;
    this.rejectedCount = this.getLeaves.filter(leave => leave.Status__c === 'Rejected').length;
    }


    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();

        if (searchTerm) {
        this.getLeaves = this.getLeaves.filter(leave => leave.Name.toLowerCase().includes(searchTerm));
        } 
       
        else {
        // If search term is empty, show all the data
        this.getLeaves = [...this.leaveRequestwireResult.data.map(a =>({
            ...a,
            cellclass: a.Status__c=='Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' :'',
            isEditDisabled: a.Status__c != 'Pending'
        }))];
        console.log ('Handle search : ' +this.getLeaves);
        }
    }

}