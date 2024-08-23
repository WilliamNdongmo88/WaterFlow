import { LightningElement, api, track, wire } from 'lwc';
import searchApi from '@salesforce/apex/CallOutSearchController.searchCityApi';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class SearchCity_cmp extends LightningElement {
    @track searchTerm = '';
    @track searchResults = [];
    @track showDropdown = false;
    @track isCorrect = false;
    @track isInCorrect = true;
    @track isLoading = false;
    @wire(MessageContext)
    messageContext;
    showBack = false;
    isdisable = false;
    @api getCity;
    
    handleChange(event) {
        this.searchTerm = event.target.value;

        if (this.searchTerm.length >= 3) {
            this.search();
        } else {
            this.showDropdown = false;
            this.searchResults = [];
        }
    }

    search() {
        this.isLoading = true;

        searchApi({})
        .then(result => {
            this.searchResults = result.filter(item =>
                item.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
            this.showDropdown = this.searchResults.length > 0;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    handleSelect(event) {
        this.searchTerm = event.target.innerText;
        this.searchResults.forEach(item => {
            if (this.searchTerm == item.nom && item.isCovered == 'true') {
                this.showDropdown = false;
                this.isCorrect = true;
                this.isInCorrect = true;
                console.log('ID:', item.id);
                console.log('name:', item.nom);
                console.log('isCovered:', item.isCovered);
                const payload = {
                    showBack : this.showBack,
                    isdisable : this.isdisable,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            }else if (this.searchTerm == item.nom && item.isCovered == 'false') {
                this.showDropdown = false;
                this.isInCorrect = false;
                this.isCorrect = false;
                console.log('ID:', item.id);
                console.log('name:', item.nom);
                console.log('isCovered:', item.isCovered);
                const payload = {
                    showBack : this.showBack,
                    isdisable : !this.isdisable,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            }
        });
    }

}
