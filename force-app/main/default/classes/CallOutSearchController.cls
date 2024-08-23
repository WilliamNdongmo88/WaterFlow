public with sharing class CallOutSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> searchCityApi() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String endpoint = 'https://city-seven-chi.vercel.app';
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        Integer statusCode = response.getStatusCode();
        String responseBody = response.getBody();
        System.debug('###responseBody--->' + responseBody);
            List<Map<String, String>> datas = new List<Map<String, String>>();
        if (response.getStatusCode() == 200) {
            String jsonStr = responseBody;
            List<Object> jsonData = (List<Object>) JSON.deserializeUntyped(jsonStr);
            for (Object obj : jsonData) {
                Map<String, Object> item = (Map<String, Object>) obj;
                System.debug('###item--->' + item);
                datas.add(new Map<String, String>{ 'id' => (String)item.get('id'), 'nom' => (String)item.get('nom'), 'isCovered' => (String)item.get('isCovered') });   
            }  
        }

        System.debug('###datas--->' + datas);
        return datas;
    }

    @AuraEnabled(cacheable=true)
    public static List<AdresseDesservie__c> searchAdressDesservieApi(String searchTerm) {
        if (String.isBlank(searchTerm)) {
            return new List<AdresseDesservie__c>();
        }
        return [SELECT Id, adresse_desservie__c, nomAncienOccupant__c, prenomAncienOccupant__c,matriculeCompteur__c,NumeroSerie__c,
                       statutBranchement__c,statutContrat__c
                FROM AdresseDesservie__c 
                WHERE adresse_desservie__c 
                LIKE :('%' + searchTerm + '%')];
    }

    /*@AuraEnabled(cacheable=true)
    public static List<Account> searchAdressDesservieApi(String searchTerm) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String endpoint = 'https://adress-eta.vercel.app';
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        Integer statusCode = response.getStatusCode();
        String responseBody = response.getBody();
        System.debug('###responseBody--->' + responseBody);
        List<Object> adressList = new List<Object>();
        if (response.getStatusCode() == 200) {
            String jsonStr = responseBody;
            Map<String, Object> regions = (Map<String, Object>) JSON.deserializeUntyped(jsonStr);

            List<Object> ouestList = (List<Object>) regions.get('Ouest');
            for (Object obj : ouestList) {
                Map<String, Object> region = (Map<String, Object>) obj;
                String ville = (String) region.get('ville');
                System.debug('Ville : ' + ville);
                List<Object> adresses = (List<Object>) region.get('adresses');
                for (Integer i = 0; i < adresses.size(); i++){
                    if (String.isBlank(searchTerm) && searchTerm == adresses[i]) {
                        return new List<Account>();
                    }
                    //adressList.add(adresses[i]);
                    //System.debug('Adresse: ' + adresses[i]);
            }  
        
            }
        }
        
        return [SELECT Id, Name, Phone, Industry FROM Account];
        //System.debug('###adressList--->' + adressList);
        //return adressList;    
    }*/
    @AuraEnabled(Cacheable = true)
        public static List<AdresseDesservie__c> getAccounts(){
          return [SELECT Id, adresse_desservie__c, nomAncienOccupant__c, prenomAncienOccupant__c,matriculeCompteur__c,NumeroSerie__c,
          statutBranchement__c,statutContrat__c FROM AdresseDesservie__c ];
    }
}