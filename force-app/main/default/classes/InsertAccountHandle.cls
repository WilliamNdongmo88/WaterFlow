public with sharing class InsertAccountHandle {

    public static Account InsertAccount(String nom, String prenom) {
        Account acct = new Account();
        try {
            acct.Name = nom + ' ' + prenom;
            acct.Nom__c = nom;
            acct.Prenom__c = prenom;
            acct.proprietaire__c = false;
            System.debug('acct : '+ acct);
            insert acct;
        } catch (Exception e) {
            System.debug('Insert account failled'+ e.getMessage());
        }

        return acct;
    }
}