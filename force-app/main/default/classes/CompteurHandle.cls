public with sharing class CompteurHandle {
    public static Id updateCompteur(List<Id> listBranchId, String indexCompteur, Date dateReleveCompteur) {
        Id branchId;
        try {
            Compteur__c compteur = [SELECT Id,Name,Branchement__c,Consommation_Moyenne__c,Date_de_pose__c,Date_dernier_releve_index__c,Index__c,Matricule__c,Statut_compteur__c
                                    FROM Compteur__c 
                                    WHERE Branchement__c IN: listBranchId];
            compteur.Index__c = Decimal.valueOf(indexCompteur);
            compteur.Date_dernier_releve_index__c = dateReleveCompteur;
            System.debug('compteur : '+ compteur);
            update compteur;
            branchId = compteur.Branchement__c;
        } catch (Exception e) {
            System.debug('Update compteur failled'+ e.getMessage()); 
        }
        return branchId;
    }
}