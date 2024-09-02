public with sharing class AccountHandle {
    public static void updateAccount() {
        Account acct = new Account();
        try {

        } catch (Exception e) {
            System.debug('Insert account failled'+ e.getMessage());
        }

    }
}