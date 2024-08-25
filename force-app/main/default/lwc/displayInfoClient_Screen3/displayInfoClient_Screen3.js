import { LightningElement, api, wire,track } from 'lwc';

export default class DisplayInfoClient_Screen3 extends LightningElement {
    @api IndexAbonnement;
    @api dateReleve;


    handleCheckIndex(){
        console.log('IndexAbonnement : ', this.IndexAbonnement);
        console.log('dateReleve : ', this.dateReleve);
    }
}