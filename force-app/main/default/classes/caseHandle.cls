public with sharing class caseHandle {

    @InvocableMethod(label='Update case data' description='Return list of updated cases')
    public static void updateCaseHandle(List<InputVariables> inputvariables) {
        System.debug('inputvariables : ' + inputvariables);
        try {
            if (inputvariables == null || inputvariables.isEmpty()) {
                throw new IllegalArgumentException('La liste d\'entrée est vide ou null.');
            }
            
            InputVariables input = inputvariables[0];
            
            //Account acct = InsertAccountHandle.InsertAccount(input.nom, input.prenom);
            //System.debug('Compte créé avec succès : ' + acct.Id);
            //AdresseDesservieHandle.updateAdresseDesservie(input.adresseDesservieId, acct.Id);
            System.debug('Adresse desservie mise à jour pour : ' + input.adresseDesservieId);

            //List<Id> listBranchId = BranchementHandle.updateBranchement(input.adresseDesservieId);
            //System.debug('Branchements mis à jour : ' + listBranchId);
            //Id branchId = CompteurHandle.updateCompteur(listBranchId, input.indexCompteur, input.dateReleveCompteur);
            //System.debug('Compteur mis à jour avec branchement ID : ' + branchId);
            Case cas = [SELECT Id, Abonnement__c, AccountId, Branchement_Id__c, CaseNumber, Origin, RecordTypeId, Categorie__c, Sous_categorie__c, Motif__c,
                        ContactPhone, ClosedDate, Description_erreur__c, Objet__c, Priority, Status, Statut__c, Statut_Erreur__c
                        FROM Case 
                        WHERE Id =: input.caseId];
    
            //cas.AccountId = acct.Id;
            //cas.Branchement_Id__c = branchId;
    
            System.debug('Cas avant mise à jour : ' + cas);
            //update cas;
            System.debug('Cas mis à jour avec succès : ' + cas.Id);
    
        } catch (Exception e) {
            System.debug('La mise à jour du case a échoué : ' + e.getMessage());
        }    
    }
    
    public class InputVariables {
        @InvocableVariable public Id caseId;
        @InvocableVariable public String prenom;
        @InvocableVariable public String nom;
        @InvocableVariable public String ville;
        @InvocableVariable public String adresseDesservieId;
        @InvocableVariable public String indexCompteur;
        @InvocableVariable public Date dateReleveCompteur;
    }
    
}