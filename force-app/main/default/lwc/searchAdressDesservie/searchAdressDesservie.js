import { LightningElement, api, track,wire } from 'lwc';
import searchAdressDesservieApi from '@salesforce/apex/CallOutSearchController.searchAdressDesservieApi';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class SearchAdressDesservie extends LightningElement {
    @track searchTerm = '';
    @track AdresseDesservies = [];
    @track showTable = false;
    @track showError = false;
    @track selectedRecordIds = [];
    @track selectedRadioRecord = '';
    @wire(MessageContext)
    messageContext;
    infoClient;

    infoClientData() {
        let nom = this.template.querySelector('[data-id="nom"]').value;
        let prenom = this.template.querySelector('[data-id="prenom"]').value;
        return {
            nom: nom,
            prenom: prenom,
        }
    }
    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }

    handleSearch() {
        this.infoClient = this.infoClientData();
        console.log('infoClient-->', JSON.stringify(this.infoClient));
        var isValid  =  this.checkInfoClient();
        if(isValid){
            if (this.searchTerm) {
                searchAdressDesservieApi({ searchTerm: this.searchTerm })
                    .then(result => {
                        console.log('result : ', result);
                        if (result.length > 0) {
                            this.AdresseDesservies = result;
                            this.showTable = true;
                            this.showError = false;
                        } else {
                            this.AdresseDesservies = [];
                            this.showTable = false;
                            this.showError = true;
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la recherche:', error);
                        this.AdresseDesservies = [];
                        this.showTable = false;
                        this.showError = true;
                    });
            } else {
                this.AdresseDesservies = [];
                this.showTable = false;
                this.showError = true;
            }
        }
    }

    getAllSelectedRecord() {
        let idadressdesservie = '';
        let selectedRadioRows = this.template.querySelectorAll('lightning-input[data-name="radio"]');
        selectedRadioRows.forEach(currentItem => {
            if (currentItem.type === 'radio' && currentItem.checked) {
                idadressdesservie = currentItem.value;
                const payload = {
                    isdisable : false,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            }
        })
        console.log('Id adress desservie : ' + idadressdesservie);
    }

    checkInfoClient(){
        var nom =this.template.querySelector('[data-id="nom"]');
        var prenom     =this.template.querySelector('[data-id="prenom"]');

        var isvalid = true;
        
        if(nom.value == ""){
            nom.required = true;
            if(!nom.reportValidity('')) {
                isvalid = false;
                nom.setCustomValidityForField('Complete this field','Nom');
            }
        }
        if(prenom.value == ""){
            prenom.required = true;
            if(!prenom.reportValidity('')) {
                isvalid = false;
                prenom.setCustomValidityForField('Complete this field','Prenom');
            }
        }
        return isvalid;
    }
}

