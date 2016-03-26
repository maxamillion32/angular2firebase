import {Page, Scroll} from 'ionic-angular';
import {NgFor} from 'angular2/common';
import {OnInit, AfterViewChecked, Pipe, Component, View, ElementRef, ViewChild} from 'angular2/core';
import {CircularProgressComponent} from '../circularprogress/circularprogress';
import {Constants} from '../../core/constants';
import {FirebaseEventPipe} from '../../core/firebasepipe';

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterable {
    transform(dict: Object): Array<any> {
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    }
}

@Page({
    templateUrl: 'build/pages/page2/page2.html',
    directives: [CircularProgressComponent, NgFor],
    pipes: [MapToIterable, FirebaseEventPipe]
})
export class Page2 implements OnInit, AfterViewChecked{
    firebaseUrl: string;
    isLoading: boolean = false;
    authData: any;
    messages: Array<any>;
    messageText: string;
    messagesRef: Firebase;
    constructor() {
        this.firebaseUrl = Constants.FireBaseRefUrl + Constants.Messages;
        this.messages = [];
        
        this.messagesRef = new Firebase(this.firebaseUrl);
        this.isLoading = true;
        this.messagesRef.onAuth((user) => {
            if (user) {
                this.authData = user;
            }
        });
        this.getMessages();
    }
    
    ngOnInit() { 
       // this.scrollToBottom();
    }


    ngAfterViewChecked() {        
       // this.scrollToBottom();        
    } 

    getMessages() {
        this.messagesRef.limitToLast(50).on('value', (childSnapshot, prevChildKey) => {
            this.messages = childSnapshot.val();
           
            this.isLoading = false;
        });

    }

    doneTyping($event) {
        if ($event.which === 13) {
            if(!this.messageText)
            {
                return;
            }
            this.addMessage(); //($event.target.value);
            $event.target.value = null;
        }
    }

    addMessage() {
        var user = this.convertAuthData();
        this.messagesRef.push({
            name: user.displayName,
            profileImageURL: user.profileImageURL,
            text: this.messageText
        }, (error: any) => {
            this.messageText = '';
            this.scrollToBottom();
            
        });
    }

    convertAuthData() {
        var result: any = {};
        if (this.authData.provider == 'twitter') {
            result.displayName = this.authData.twitter.displayName;
            result.profileImageURL = this.authData.twitter.profileImageURL;
            return result;
        }
        if (this.authData.provider == 'facebook') {
            result.displayName = this.authData.facebook.displayName;
            result.profileImageURL = this.authData.facebook.profileImageURL;
            return result;
        }
        return result;
    }

    scrollToBottom() {

        try {
            var listItem = document.querySelector(".page2-content scroll-content");
            if (listItem) {
                listItem.scrollTop = listItem.scrollHeight;
            }
        } catch (err) {
            console.log(err);
        }
    }
  
}
