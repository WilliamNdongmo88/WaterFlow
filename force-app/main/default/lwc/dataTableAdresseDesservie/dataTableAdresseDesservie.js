import { LightningElement, api, track } from 'lwc';
import searchAdressDesservieApi from '@salesforce/apex/CallOutSearchController.searchAdressDesservieApi';

export default class DataTableAdresseDesservie extends LightningElement {
    @track searchTerm = '';
    @track AdresseDesservies = [];
    @track showTable = true;
    @track showError = false;
    @track selectedRows = [];


    @track columns = [
        { label: 'Adresse desservie', fieldName: 'adresse_desservie__c', type: 'text' },
        { label: 'Nom ancien occupant', fieldName: 'nomAncienOccupant__c', type: 'text' },
        { label: 'Prénom ancien occupant', fieldName: 'prenomAncienOccupant__c', type: 'text' },
        { label: 'Matricule compteur', fieldName: 'matriculeCompteur__c', type: 'text' },
        { label: 'Numero de serie', fieldName: 'NumeroSerie__c', type: 'text' },
        { label: 'Statut du branchement', fieldName: 'statutBranchement__c', type: 'text' },
        { label: 'Statut contrat', fieldName: 'statutContrat__c', type: 'text' }
    ];


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