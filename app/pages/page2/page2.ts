import {Page} from 'ionic-angular';

import {NgFor} from 'angular2/common';
import { Pipe, Component, View} from 'angular2/core';
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
        a.push({key: key, val: dict[key]});
      }
    }
    return a;
  }
}

@Page({
  templateUrl: 'build/pages/page2/page2.html',
  directives: [CircularProgressComponent, NgFor],
    pipes: [MapToIterable]	
})
export class Page2 {
    firebaseUrl: string;
    authData: any;
    messages: Array<any>;
    messageText: string;
    messagesRef: Firebase;
    constructor() {
        this.firebaseUrl = Constants.FireBaseRefUrl + Constants.Messages;
        this.messages = [];
        this.messagesRef = new Firebase(this.firebaseUrl);
        this.messagesRef.onAuth((user) => {
			if (user) {
				this.authData = user;
			}
		});
        this.messagesRef.on('value', (childSnapshot, prevChildKey) => {
        this.messages = childSnapshot.val();
        console.log(this.messages);
    });
  // code to handle new child.


    }
    
    hack(val) {
     console.log('Before:');
  console.log(val);
  val = Array.from(val);
  console.log('After:');
  console.log(val);
  return val;
    }

    doneTyping($event) {
	  if($event.which === 13) {
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
		});
	}
    
    convertAuthData()
    {
        var result: any = {};
        if(this.authData.provider == 'twitter')
        {
            result.displayName = this.authData.twitter.displayName;
            result.profileImageURL = this.authData.twitter.profileImageURL;
            return result;
        }
        if(this.authData.provider == 'facebook')
        {
            result.displayName = this.authData.facebook.displayName;
            result.profileImageURL = this.authData.facebook.profileImageURL;
             return result;
        }
        return result;
    }
}
