import {Page, NavController, Modal} from 'ionic-angular';
import {Page1} from '../page1/page1';
import {Page2} from '../page2/page2';
import {Page3} from '../page3/page3';
import {Login} from '../login/login';
import {CircularProgressComponent} from '../circularprogress/circularprogress';
import {Constants} from '../../core/constants';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html',
  directives: [CircularProgressComponent]
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = Page1;
  tab2Root: any = Page2;
  tab3Root: any = Page3;
  isLoggedIn: boolean = false;
  nav : any;
    authData: any;
    authRef: Firebase;
    isProcessing: boolean = false;
    errorMessage: string = '';
    isError: boolean = false;
    
  constructor(nav: NavController){
    this.nav = nav;
    
     
        this.authRef = new Firebase(Constants.FireBaseRefUrl);
        this.authRef.onAuth((user) => {
            if (user) {
                this.authData = user;
                this.isLoggedIn = true;
            }
           
        });
   
  }
  
  
   public authWithProvider(provider) {
        this.isProcessing = true;
        this.isError = false;
        this.authRef.authWithOAuthPopup(provider, (error, authData) => {
            this.errorMessage = "Finished oauth";
            if (error) {
                this.errorMessage ="error.";
                console.log(error);
                this.errorMessage = error;
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    this.doOAuthRedirect(provider);
                }
                else {
                    this.isError = true;
                    this.errorMessage = error;
                    this.isProcessing = false;
                }
            }
            else {
                this.errorMessage = "no error";
                console.log(authData);
                this.authData = authData;
                this.isLoggedIn = true;
                this.isProcessing = false;
            }

        });
    }

    doOAuthRedirect(provider) {
        // fall-back to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        this.authRef.authWithOAuthRedirect(provider, (error) => {
           if (error) {
                console.log(error);
                 this.isError = true;
                    this.errorMessage = error;
            }
            else {
                this.isLoggedIn = true;
            }
            this.isProcessing = false;
        });


    }
    
}
