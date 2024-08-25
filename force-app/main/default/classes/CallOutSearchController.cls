public with sharing class CallOutSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> searchCityApi() {
        List<Map<String, String>> datas = new List<Map<String, String>>();
        GetServiceWeb getcity = new GetServiceWeb();
        String endpoint = 'https://city-seven-chi.vercel.app';
        String jsonStr = getcity.getserviceweb(endpoint);
        List<Object> jsonData = (List<Object>) JSON.deserializeUntyped(jsonStr);
        for (Object obj : jsonData) {
            Map<String, Object> item = (Map<String, Object>) obj;
            System.debug('###item--->' + item);
            datas.add(new Map<String, String>{ 'id' => (String)item.get('id'), 'nom' => (String)item.get('nom'), 'isCovered' => (String)item.get('isCovered') });   
        } 

        System.debug('###datas--->' + datas);
        return datas;
    }

    @AuraEnabled(cacheable=true)
    public static List<AdresseDesservie__c> searchAdressDesservieApi(String jsonObj) {
        WrapperData data = (WrapperData) JSON.deserialize(jsonObj, WrapperData.class);
        List<AdresseDesservie__c> adressList;
        try { 
            if (String.isBlank(data.searchTerm)) {
                return new List<AdresseDesservie__c>();
            }
            adressList = [SELECT Id, reference__c,adresse_desservie__c, nomAncienOccupant__c, prenomAncienOccupant__c,
                                matriculeCompteur__c,NumeroSerie__c,Ville__c,
                                statutBranchement__c,statutContrat__c
                          FROM AdresseDesservie__c 
                          WHERE adresse_desservie__c 
                          LIKE :('%' + data.searchTerm + '%')
                          AND Ville__c =: data.cityName];
        } catch (Exception e) {
            System.debug('Une exception a été levée : ' + e.getMessage());
        }
        return adressList;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> searchIndexApi(String reference) {
        Map<String, Object> combinedMap = new Map<String, Object>();
        try {
            GetServiceWeb getIndex = new GetServiceWeb();
            String endpoint = 'https://index-compteur.vercel.app';
            String jsonStr = getIndex.getserviceweb(endpoint);
            List<Object> jsonData = (List<Object>) JSON.deserializeUntyped(jsonStr);
            for (Object obj : jsonData) {
                Map<String, Object> item = (Map<String, Object>) obj;
                System.debug('###item--->' + item);
                if (reference == (String)item.get('reference')) {
                    combinedMap.put('derniere_date_releve_index', (String)item.get('derniere_date_releve_index'));
                    combinedMap.put('index', (Integer)item.get('index'));
                }
            }
            System.debug('###combinedMap--->' + combinedMap);
        } catch (Exception e) {
            System.debug('Une exception a été levée : ' + e.getMessage());
        }
        return combinedMap;
    }

    public class WrapperData {
        public String searchTerm { get; set; }
        public String cityName { get; set; }
    }
}