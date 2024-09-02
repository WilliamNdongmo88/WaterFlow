public with sharing class AdresseDesservieHandle {
    public static void updateAdresseDesservie(String adressId, Id newClientId) {
        System.debug('adressId : ' + adressId + '|| newClientId : ' + newClientId);
        try {
            AdresseDesservie__c adress = [SELECT Id, adresse_desservie__c,ClientName__c,matriculeCompteur__c,nomAncienOccupant__c,
                                             NumeroSerie__c,prenomAncienOccupant__c,reference__c,statutContrat__c,statutBranchement__c,
                                             Ville__c
                                             FROM AdresseDesservie__c
                                             WHERE Id =: adressId ];
            System.debug('&&&& adress : '+ adress);
            /*List<Branchement__c> listBranch = [SELECT Id,Name,adresse_desservie__c,Matricule_Compteur__c,Numero_de_compteur__c
                                               FROM Branchement__c
                                               WHERE adresse_desservie__c =: adressId];
            System.debug('adress : ' + adress);
            System.debug('listBranch : ' + listBranch);*/
            Account  acct = [SELECT Id, Name, Nom__c, Prenom__c FROM Account WHERE Id =: adress.ClientName__c];
            System.debug('acct : ' + acct);

            
            adress.ClientName__c = newClientId;
            adress.nomAncienOccupant__c = acct.Nom__c;
            adress.prenomAncienOccupant__c = acct.Prenom__c;
            System.debug('adress avant : ' + adress);
            update adress;
            System.debug('adress apres : ' + adress);
        } catch (Exception e) {
            System.debug('Update adress desservie failed'+ e.getMessage());
        }
    }

    
    /*public static Map<String, String> splitFullName(String fullName) {
        Map<String, String> nameParts = new Map<String, String>();

        //String fullName = 'Entoine Locadi Talla Tankou';
        List<String> nameList = fullName.split(' ');
        
        String firstName = '';
        String lastName = '';
        
        if (nameList.size() == 2) {
            for (Integer i = 0; i < nameList.size() - 1; i++) {
                if (i > 0) {
                    firstName += ' ';
                }
                firstName += ' ' + nameList[i];
            }
            
            lastName = nameList[nameList.size() - 1];
        }if (nameList.size() == 3) {
            for (Integer i = 0; i < nameList.size() - 2; i++) {
                if (i > 0) {
                    firstName += ' ';
                }
                firstName += ' ' + nameList[i];
            }
            
            lastName = nameList[nameList.size() - 2] + ' ' + nameList[nameList.size() - 1];
        } if (nameList.size() == 4) {
            for (Integer i = 0; i < nameList.size() - 2; i++) {
                if (i > 1) {
                    firstName += ' ';
                }
                firstName += ' ' + nameList[i];
            }
            
            lastName = nameList[nameList.size() - 2] + ' ' + nameList[nameList.size() - 1];
        } else if (nameList.size() > 4) {
            for (Integer i = 0; i < nameList.size() - 2; i++) {
                if (i > 1) {
                    firstName += ' ';
                }
                firstName += ' ' + nameList[i];
            }
            
            lastName = nameList[nameList.size() - 2] + ' ' + nameList[nameList.size() - 1];
        }

        nameParts.put('firstName', firstName);
        nameParts.put('lastName', lastName);

        System.debug('nameParts : ' + nameParts);
        return nameParts;
    }*/
    
}