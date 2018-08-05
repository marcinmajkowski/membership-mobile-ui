import { Component } from '@angular/core';
import { TabsPageComponent } from '../tabs/tabs';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { LoginPageComponent } from '../login/login';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePageComponent {
  constructor(private navCtrl: NavController, private auth: AuthService) {}

  ionViewDidLoad(): void {
    this.auth
      .signInWithEmail(undefined)
      .subscribe(() => this.navCtrl.setRoot(TabsPageComponent), () => {});
  }

  onSignInClick(): void {
    this.navCtrl.push(LoginPageComponent);
  }

  onSignUpClick(): void {
    // TODO sign up
  }
}
