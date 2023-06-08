import { LightningElement, track, wire } from 'lwc';
import getMyLeave from "@salesforce/apex/LeaveRequestController.getMyLeave";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Request Id', fieldName: 'Name', cellAttributes: { class: { fieldName: 'cellclass' } } },
    { label: 'FROM DATE', fieldName: 'From_Date__c', type: 'date', cellAttributes: { class: { fieldName: 'cellclass' } } },
    { label: 'TO DATE', fieldName: 'To_Date__c', type: 'date', cellAttributes: { class: { fieldName: 'cellclass' } } },
    { label: 'REASON', fieldName: 'Reason__c', type: 'text', cellAttributes: { class: { fieldName: 'cellclass' } } },
    { label: 'STATUS', fieldName: 'Status__c', type: 'text', cellAttributes: { class: { fieldName: 'cellclass' } } },
    { label: 'MANAGER COMMENT', fieldName: 'Manager_Comment__c', type: 'text', cellAttributes: { class: { fieldName: 'cellclass' } } },
    {
        type: 'button', typeAttributes: {
            label: 'Edit',
            title: 'Edit',
            type: 'edit',
            name: 'Edit',
            disabled: { fieldName: 'isEditDisabled' },
    }, cellAttributes: { class: { fieldName: 'cellclass' } }
    }
];

export default class LeaveRequests extends LightningElement {
    columns = columns;
    getLeaves_respective_manager = [];
    objectApiName = 'Leave_Request__c';
    recordId = '';
    showpopupmodal = false;
    leaveRequestwireResult_respective_manager;
    curerntuserName = Id;

    @wire(getMyLeave)
    getLeaveResult(result) {
        this.leaveRequestwireResult_respective_manager = result;
        if (result.data) {
            this.getLeaves_respective_manager = result.data.map(a =>({
            ...a,
            cellclass: a.Status__c=='Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' :'',
            isEditDisabled: a.Status__c != 'Pending'
        }));
    }
        if (result.error) {
            console.log('Fetching failed ', result.error);
        }
    }

    get noRecordsFound(){
        return this.leaveRequestwireResult_respective_manager.length == 0;
    }

    newRequestHandler() {
        this.showpopupmodal = true;
        this.recordId = '';
    }

    closepopup() {
        this.showpopupmodal = false;
    }

    modalhandler(event) {
        this.showpopupmodal = true;
        this.recordId = event.detail.row.Id;
    }

    successToastHandler(event) {
        this.showpopupmodal = false;
        this.showToast('Data saved successfully');
        refreshApex(this.leaveRequestwireResult_respective_manager);
    }

    showToast(message, title = 'success', variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}