import {Page, ViewController, NavController} from 'ionic-angular';
import {CircularProgressComponent} from '../circularprogress/circularprogress';
import {Constants} from '../../core/constants';
import {Page1} from '../page1/page1';
@Page({
   templateUrl: 'build/pages/login/login.html',
   directives: [CircularProgressComponent]
})
export class Login {
    private viewCtrl;
    isLoggedIn: boolean = false;
    isProcessing: boolean = false;
    authData: any;
    errorMessage: string = '';
    isError: boolean = false;
   nav: any;
    authRef: Firebase;
    
  constructor(nav: NavController, viewCtrl: ViewController) {
        this.authRef = new Firebase(Constants.FireBaseRefUrl);
    this.viewCtrl = viewCtrl;
    this.nav = nav;
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
                this.close();
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
              this.close();
            }
            this.isProcessing = false;
        });


    }
    
  close() {
     
    this.viewCtrl.dismiss();
    //this.nav push(Page1);
  }
}