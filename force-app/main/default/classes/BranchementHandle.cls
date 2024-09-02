public with sharing class BranchementHandle {
    public static List<Id> updateBranchement(Id adressId) {
        List<Id> listId = new List<Id>();
        try {
            List<Branchement__c> listBranch = [SELECT Id,Name,adresse_desservie__c,Consommation_Moyenne__c,Date_dernier_releve_index_compteur__c,
                                               Domaine__c,Index_Compteur__c,Matricule_Compteur__c,Numero_de_compteur__c,Reference__c,Statut__c,
                                               Statut_compteur__c,Type_Branchement__c
                                               FROM Branchement__c
                                               WHERE adresse_desservie__c =: adressId];
            
            for (Branchement__c b : listBranch) {
                listId.add(b.Id);
            }
        } catch (Exception e) {
            System.debug('Update branchement failled'+ e.getMessage()); 
        }
        return listId;
    }
}