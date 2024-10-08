import { LightningElement, api, track,wire } from 'lwc';
import searchAdressDesservieApi from '@salesforce/apex/CallOutSearchController.searchAdressDesservieApi';
import searchIndexApi from '@salesforce/apex/CallOutSearchController.searchIndexApi';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class SearchAdressDesservie extends LightningElement {
    @track searchTerm = '';
    @track AdresseDesservies = [];
    @track showTable = false;
    @track showError = false;
    @track selectedRecordIds = [];
    @track selectedRadioRecord = '';
    @track isLoading = false;
    @wire(MessageContext)
    messageContext;
    infoClient;
    reference;
    @api city;
    @api nom;
    @api prenom;
    @api adressdesservie;
    @api idadressdesservie;
    @api ancienIndex;
    @api dateRernierReleveIndex;

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
        this.nom = this.infoClient.nom;
        this.prenom = this.infoClient.prenom;
        console.log('this.nom : ', this.nom);
        console.log('this.prenom : ', this.prenom);
        console.log('////ville-->', this.city);
        console.log('////searchTerm-->', this.searchTerm);
        console.log('infoClient-->', JSON.stringify(this.infoClient));
        var isValid  =  this.checkInfoClient();
        if(isValid){
            if (this.searchTerm) {
                this.isLoading = true;
                const obj = {};
                        obj.searchTerm = this.searchTerm;
                        obj.cityName = this.city;
                        const jsonObj = JSON.stringify(obj);
                        console.log('////jsonObj-->', jsonObj);
                searchAdressDesservieApi({ jsonObj: jsonObj })
                    .then(result => {
                        console.log('result adress: ', result[0]);
                        if (result.length > 0) {
                            this.adressdesservie = result[0].adresse_desservie__c;
                            this.reference = result[0].reference__c;
                            console.log('this.reference : ', this.reference);
                            this.AdresseDesservies = result;
                            this.showTable = true;
                            this.showError = false;
                            this.searchIndex(this.reference);
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
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            } else {
                this.AdresseDesservies = [];
                this.showTable = false;
                this.showError = true;
            }
        }
    }
    searchIndex(reference){
        searchIndexApi({reference : reference})
        .then(result => {
            console.log('result index : ', result);
            
            this.ancienIndex = result.index;
            this.dateRernierReleveIndex = this.formatDate(result.derniere_date_releve_index);
        })
        .catch(error => {
            console.error('Erreur lors de la recherche:', error);
        });
    }
    getAllSelectedRecord() {
        this.idadressdesservie = '';
        let selectedRadioRows = this.template.querySelectorAll('lightning-input[data-name="radio"]');
        selectedRadioRows.forEach(currentItem => {
            if (currentItem.type === 'radio' && currentItem.checked) {
                this.idadressdesservie = currentItem.value;
                const payload = {
                    isdisable : false,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            }
        })
        console.log('Id adress desservie : ' + this.idadressdesservie);
    }

    checkInfoClient(){
        var nom = this.template.querySelector('[data-id="nom"]');
        var prenom = this.template.querySelector('[data-id="prenom"]');

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

    formatDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(`${year}-${month}-${day}`);
    
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        return date.toLocaleDateString('fr-FR', options);
    }
    
}

