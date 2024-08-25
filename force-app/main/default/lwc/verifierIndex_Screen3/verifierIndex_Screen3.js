import { LightningElement, api, wire,track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class VerifierIndex_Screen3 extends LightningElement {
    @wire(MessageContext)
    messageContext;
    @api ancienIndex;
    @api dateDernierReleveIndex;
    @api IndexAbonnement;
    indexMin = 0;
    indexMax = 0;
    @api dateReleve;
    indexCorrect = false;
    indexTropFaible = false;
    indexTropFort = false;
    moisTotal;
    isdisableButton = false;
    //isdisablecheckbox = true;


    handleCheckIndex(){
        const lastDate = this.transformDate(this.dateDernierReleveIndex);
        this.moisTotal = this.getMonthDifference(lastDate,this.dateReleve);
        this.indexMin = Number(this.ancienIndex) + Number(this.moisTotal)*5;
        this.indexMax = this.indexMin + Number(this.moisTotal);
        console.log('ancienIndex :',this.ancienIndex,'indexAbo : ',this.IndexAbonnement, 'indexMin : ', this.indexMin);
        if (Number(this.IndexAbonnement) < this.indexMin) {
            this.indexTropFaible = true;
            this.indexTropFort = false;
            this.indexCorrect = false;
            this.isdisableButton = true;
           //this.isdisablecheckbox = false;
            console.log('isdisableButton :',this.isdisableButton,'isdisablecheckbox : ',this.isdisablecheckbox);
        }else if (Number(this.IndexAbonnement) > this.indexMax) {
            this.indexTropFort = true;
            this.indexTropFaible = false
            this.indexCorrect = false;
            this.isdisableButton = true;
            //this.isdisablecheckbox = false;
        }else{
            this.indexCorrect = true;
            this.indexTropFort = false;
            this.indexTropFaible = false
            const payload = {
                showBack : this.showBack,
                isdisable : this.isdisable,
            };
            publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
        }
    }
    handleCheckBox() {
        let checkbox = this.template.querySelector('[data-id="checkbox"]').checked;
        console.log('/*/checkbox :',checkbox);
        
    
        if (checkbox) {
            this.isdisableButton = true;
            const payload = {
                isdisable: this.isdisable,
            };
            publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            console.log('/true/isdisableButton :',this.isdisableButton,'isdisablecheckbox : ',this.isdisablecheckbox);
        }
        if(!check){
            this.isdisableButton = false;
            //this.isdisablecheckbox = !this.isdisablecheckbox;
            this.isdisableButton = true;
            const payload = {
                isdisable: !this.isdisable,
            };
            publish(this.messageContext, COUNT_UPDATED_CHANNEL, payload);
            console.log('/false/isdisableButton :',this.isdisableButton,'isdisablecheckbox : ',this.isdisablecheckbox);
        }
    }

    transformDate(dateStr) {
        const [weekday, day, monthStr, year] = dateStr.split(' ');
    
        const months = {
            "janvier": "01",
            "février": "02",
            "mars": "03",
            "avril": "04",
            "mai": "05",
            "juin": "06",
            "juillet": "07",
            "août": "08",
            "septembre": "09",
            "octobre": "10",
            "novembre": "11",
            "décembre": "12"
        };
    
        const month = months[monthStr.toLowerCase()];
    
        const formattedDate = `${year}-${month}-${day}`;
    
        return String(formattedDate);
    }

    getMonthDifference(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const yearsDiff = end.getFullYear() - start.getFullYear();
        const monthsDiff = end.getMonth() - start.getMonth();
    
        const totalMonths = yearsDiff * 12 + monthsDiff;
    
        return totalMonths;
    }
}