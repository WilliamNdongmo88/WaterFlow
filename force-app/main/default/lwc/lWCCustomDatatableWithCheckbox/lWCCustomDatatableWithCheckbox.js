import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/CallOutSearchController.getAccounts';

export default class LWCCustomDatatableWithCheckbox extends LightningElement {
    data = [];
    error;
    @track selectedRecordIds = [];
    @track selectedRadioRecord = '';

    @wire(getAccounts)
    wireAccounts({ error, data }) {
        if (data) {
            console.log('data : ', data);
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    getAllSelectedRecord() {

        let selectedRadioRecord = '';
        let selectedRadioRows = this.template.querySelectorAll('lightning-input[data-name="radio"]');

        selectedRadioRows.forEach(currentItem => {
            if (currentItem.type === 'radio' && currentItem.checked) {
                selectedRadioRecord = currentItem.value;
            }
        })
        console.log('single radio selected Record : ' + selectedRadioRecord);
    }

}