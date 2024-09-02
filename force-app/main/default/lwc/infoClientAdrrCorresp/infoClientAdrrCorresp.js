import { LightningElement, api, track,wire } from 'lwc';
import searchApi from '@salesforce/apex/CallOutSearchController.searchAdresseApi';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class InfoClientAdrrCorresp extends LightningElement {
    @wire(MessageContext)
    messageContext;
    @api nom;
    @api prenom;
    @api dateNaissance;
    @track searchTerm = '';
    @track adresseList = [];
    @track tableList = [];
    @track searchResults = [];
    @track showDropdown = false;

    @api adresse = '';
    @api precisionadresse = '';
    @api codepostal = '';
    @api ville = '';
    @api email = '';
    @api mobile = '';
    @api telephoneFixe = '';
    @api valueCivility = '';
    @api valuePays = 'Cameroun';

    showText = false;
    isDisabled = true;
    isValueCivility = false;
    isDateNaissance = false;
    isValid = false;
    checkedAdresseFacturation = true;

    // Initialisation des options
    get options() {
        return [
            { label: '-- Aucun --', value: '' },
            { label: 'Monsieur', value: 'Monsieur' },
            { label: 'Madame', value: 'Madame' },
            { label: 'Mademoiselle', value: 'Mademoiselle' },
        ];
    }

    get optionsPays() {
        return [
            { label: 'Cameroun', value: 'Cameroun' },
            { label: 'Gabon', value: 'Gabon' },
            { label: "Cote d'Ivoire", value: "Cote d'Ivoire" },
        ];
    }

    connectedCallback() {
        this.fetchAddresses();
    }

    fetchAddresses() {
        searchApi()
            .then(result => {
                this.adresseList = result.map(item => ({
                    label: item.Adresse,
                    value: item.Adresse
                }));
                console.log(' this.adresseList :', this.adresseList[0]);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }

    handleChangeCivility(event) {
        const valueCivility = event.detail.value;
        if (valueCivility != null) {
            this.valueCivility = valueCivility;
            console.log('valueCivility : ', this.valueCivility);
            
            if (this.isValid == true && this.isDateNaissance == true) {
                const payload = {
                    isdisable: this.isdisable,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            } else {
                this.isValueCivility = true;
            }
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeDateNaiss(event){
        const dateNaissance = event.detail.value;
        const today = new Date();
        const date21YearsAgo = new Date(today.setFullYear(today.getFullYear() - 20));
        
        const birthDate = new Date(dateNaissance);
        
        if (birthDate >= date21YearsAgo) {
            this.showText = true;
        } else if (dateNaissance != null){
            let timestamp = Date.parse(dateNaissance);
            this.dateNaissance = new Date(timestamp);
            console.log('&&&&& typeof var : ',typeof this.dateNaissance);
            this.showText = false;
            console.log('dateNaissance : ', this.dateNaissance);
            if (this.isValid == true && this.isValueCivility == true) {
                const payload = {
                    isdisable: this.isdisable,
                };
                publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            } else {
                this.isDateNaissance = true;
            }
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeEmail(event){
        const email = event.detail.value;
        if (email != null) {
            this.email = email;
            console.log('email : ', this.email);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeMobile(event){
        const mobile = event.detail.value;
        if (mobile != null) {
            this.mobile = mobile;
            console.log('mobile : ', this.mobile);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeFix(event){
        const telephoneFixe = event.detail.value;
        if (telephoneFixe != null) {
            this.telephoneFixe = telephoneFixe;
            console.log('telephoneFixe : ', this.telephoneFixe);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeAdresse(event){
        const adresse = event.detail.value;
        if (adresse != null) {
            this.adresse = adresse;
            console.log('adresse : ', this.adresse);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeCodePostal(event){
        const codepostal = event.detail.value;
        if (codepostal != null) {
            this.codepostal = codepostal;
            console.log('codepostal : ', this.codepostal);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangeVille(event){
        const ville = event.detail.value;
        if (ville != null) {
            this.ville = ville;
            console.log('ville : ', this.ville);
        }else{
            this.checkInfoClient();
        }
    }
    handleChangePrecisionAdress(event){
        const precisionadresse = event.detail.value;
        if (precisionadresse != null) {
            this.precisionadresse = precisionadresse;
            console.log('precisionadresse : ', this.precisionadresse);
        }else{
            //this.checkInfoClient();
        }
    }
    handleChangePays(event) {
        this.valuePays = event.detail.value;
    }

    handleCheckBoxforcerAdresse(){
        let checkbox = this.template.querySelector('[data-id="forcerAdresse"]').checked;
        console.log('/*/checkbox :',checkbox);
        this.isDisabled = !checkbox;
    }

    handleChange(event) {
        this.searchTerm = event.target.value.toLowerCase();

        if (this.searchTerm.length >= 3) {
            this.search();
        } else {
            this.showDropdown = false;
            this.searchResults = [];
        }
    }

    search() {
        searchApi({})
            .then(result => {
                console.log('result :', result);
                // Filtrer les adresses en fonction du terme de recherche
                this.searchResults = result.filter(addr =>
                    addr.Adresse.toLowerCase().includes(this.searchTerm)
                ).map(addr => ({
                    id: addr.Code_postal, // Utilise le code postal comme ID unique
                    nom: addr.Adresse,
                    ville: addr.Ville,
                    codePostal: addr.Code_postal
                }));

                this.showDropdown = this.searchResults.length > 0;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }

    handleSelect(event) {
        const selectedAddress = event.currentTarget.dataset.id;
        console.log('Selected Address:', selectedAddress);

        // Trouver les détails de l'adresse sélectionnée dans searchResults
        const selectedDetails = this.searchResults.find(addr => addr.nom === selectedAddress);

        if (selectedDetails) {
            this.selectedAddressDetails = selectedDetails;
            console.log('Selected Address Details:', this.selectedAddressDetails);
            this.adresse = this.selectedAddressDetails.nom;
            this.codepostal = this.selectedAddressDetails.codePostal;
            this.ville = this.selectedAddressDetails.ville;
            
        }
        // Affiche l'adresse sélectionnée dans le champ de saisie
        this.searchTerm = selectedAddress;
        this.showDropdown = false;

        if (this.dateNaissance != '' && this.valueCivility != '') {
            const payload = {
                isdisable: this.isdisable,
            };
            publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            this.isValid = false;
        } else {
            this.isValid = true;
            console.log('----------||--------------');
        }
        
        // Effectuer d'autres traitements en fonction de la sélection
        //this.handleAddressProcessing(selectedAddress);
    }

    handleAddressProcessing(selectedAddress) {
        // Traiter les données en fonction de l'adresse sélectionnée
        console.log('Traitement de l\'adresse:', this.selectedAddressDetails.nom);

        if (this.selectedAddressDetails.nom === selectedAddress) {
            console.log('adresse sélectionnée : ', this.selectedAddressDetails.nom);
        }
        // Ajoute d'autres conditions ou traitements selon les besoins
    }

    checkInfoClient(){
        var valueCivility = this.template.querySelector('[data-id="civility"]');
        var dateNaissance = this.template.querySelector('[data-id="date"]');
        var codepostal = this.template.querySelector('[data-id="codepostal"]');
        var ville = this.template.querySelector('[data-id="ville"]');

        var isvalid = true;
        
        if(valueCivility.value == ""){
            valueCivility.required = true;
            if(!valueCivility.reportValidity('')) {
                isvalid = false;
                valueCivility.setCustomValidityForField('Complete this field','Civilité');
            }
        }
        if(dateNaissance.value == ""){
            dateNaissance.required = true;
            if(!dateNaissance.reportValidity('')) {
                isvalid = false;
                dateNaissance.setCustomValidityForField('Complete this field','Date Naissance');
            }
        }
        if(adresse.value == ""){
            adresse.required = true;
            if(!adresse.reportValidity('')) {
                isvalid = false;
                adresse.setCustomValidityForField('Complete this field','Adresse');
            }
        }
        if(codepostal.value == ""){
            codepostal.required = true;
            if(!codepostal.reportValidity('')) {
                isvalid = false;
                codepostal.setCustomValidityForField('Complete this field','Code postal');
            }
        }
        if(ville.value == ""){
            ville.required = true;
            if(!ville.reportValidity('')) {
                isvalid = false;
                ville.setCustomValidityForField('Complete this field','Ville');
            }
        }

        return isvalid;
    }
}
