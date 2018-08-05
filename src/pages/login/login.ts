import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TabsPageComponent } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loginError: string;
  signUpSuccessMessageVisible = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    fb: FormBuilder,
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
    this.signUpSuccessMessageVisible =
      this.navParams.get('signUpSuccessMessageVisible') || false;
  }

  login(): void {
    const data = this.loginForm.value;

    if (!data.email) {
      return;
    }

    const credentials = {
      email: data.email,
      password: data.password,
    };
    this.auth
      .signInWithEmail(credentials)
      .subscribe(
        () => this.navCtrl.setRoot(TabsPageComponent),
        error => (this.loginError = error.message),
      );
  }
}
