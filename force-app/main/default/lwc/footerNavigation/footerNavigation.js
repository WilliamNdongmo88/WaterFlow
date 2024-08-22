import { LightningElement, api, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';
import {
    FlowNavigationBackEvent,
    FlowNavigationNextEvent
} from "lightning/flowSupport";

export default class FooterNavigation extends LightningElement {
    @api availableActions = [];
    @wire(MessageContext)
    messageContext;

    showBack;
    isdisable = true;

    handleNext() {
        // Vérifie si l'action "NEXT" est disponible
        if (this.availableActions.includes("NEXT")) {
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
            this.showBack = !this.showBack;
        }
    }

    handleBack() {
        // Vérifie si l'action "BACK" est disponible
        if (this.availableActions.includes("BACK")) {
            const navigateBackEvent = new FlowNavigationBackEvent();
            this.dispatchEvent(navigateBackEvent);
        }
    }
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            COUNT_UPDATED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.isdisable = message.isdisable;
        //this.showBack = message.showBack;
        console.log('showBack : ', this.showBack);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
        this.showBack = false;
    }
}
