import {Page, NavController, Modal} from 'ionic-angular';
import {Constants} from '../../core/constants';
import {Login} from '../login/login';
declare var window;
@Page({
  templateUrl: 'build/pages/page3/page3.html'
})

export class Page3 {
      authRef : Firebase;
    isSigningOut: boolean = false;
    authData: any;
    user: any;
    constructor(public nav: NavController) {
           this.authRef = new Firebase(Constants.FireBaseRefUrl);
                this.authRef.onAuth((user) => {
            if (user) {
                this.authData = user;
                this.user = this.convertAuthData();
            }
           
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
    
     logout(){
        this.isSigningOut = true;
        this.authRef.unauth();
        if(window && window.cookies)
        {
        window.cookies.clear(() => {
            console.log("Cookies cleared!");
        });
        }
         let modal = Modal.create(Login);
         this.nav.present(modal)
    }
}
