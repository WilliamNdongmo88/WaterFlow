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
    public static List<Map<String, String>> searchAdresseApi() {
        List<Map<String, String>> listDatas = new List<Map<String, String>>();
        GetServiceWeb getcity = new GetServiceWeb();
        String endpoint = 'https://adress-eta.vercel.app/';
        String jsonStr = getcity.getserviceweb(endpoint);
        Region regionData = (Region) JSON.deserialize(jsonStr, Region.class);
        System.debug('###regionData--->' + regionData);
    
        for (Ville ville : regionData.Ouest) {
            Map<String, String> mapDatas = new Map<String, String>();
            mapDatas.put('Ville', ville.ville);
            
            for (Adresse adresse : ville.adresses) {
                mapDatas.put('Adresse', adresse.adresse);
                mapDatas.put('Code_postal', adresse.code_postal);
                
                listDatas.add(new Map<String, String>(mapDatas));
            }
        }
        System.debug('###listDatas--->' + listDatas);
        return listDatas;
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

    public class Adresse {
        public String adresse { get; set; }
        public String code_postal { get; set; }
    }
    
    public class Ville {
        public String ville { get; set; }
        public List<Adresse> adresses { get; set; }
    }
    
    public class Region {
        public List<Ville> Ouest { get; set; }
    }
    
}