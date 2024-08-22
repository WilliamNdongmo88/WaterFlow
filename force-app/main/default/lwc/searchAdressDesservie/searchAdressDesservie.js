import { LightningElement, api, track,wire } from 'lwc';
import searchAdressDesservieApi from '@salesforce/apex/CallOutSearchController.searchAdressDesservieApi';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class SearchAdressDesservie extends LightningElement {
    @track searchTerm = '';
    @track AdresseDesservies = [];
    @track showTable = false;
    @track showError = false;
    @track selectedRows = [];
    @wire(MessageContext)
    messageContext;

    @track columns = [
        { label: 'Adresse desservie', fieldName: 'adresse_desservie__c', type: 'text' },
        { label: 'Nom ancien occupant', fieldName: 'nomAncienOccupant__c', type: 'text' },
        { label: 'Prénom ancien occupant', fieldName: 'prenomAncienOccupant__c', type: 'text' },
        { label: 'Matricule compteur', fieldName: 'matriculeCompteur__c', type: 'text' },
        { label: 'Numero de serie', fieldName: 'NumeroSerie__c', type: 'text' },
        { label: 'Statut du branchement', fieldName: 'statutBranchement__c', type: 'text' },
        { label: 'Statut contrat', fieldName: 'statutContrat__c', type: 'text' }
    ];

    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }

    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows.map(row => row.id);
        console.log('Lignes sélectionnées:', this.selectedRows);
    }

    handleSearch() {
        if (this.searchTerm) {
            searchAdressDesservieApi({ searchTerm: this.searchTerm })
                .then(result => {
                    if (result.length > 0) {
                        this.AdresseDesservies = result;
                        this.showTable = true;
                        this.showError = false;
                        const payload = {
                            isdisable : false,
                        };
                        publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
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

