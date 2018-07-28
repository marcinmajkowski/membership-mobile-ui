import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TabsPageComponent } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string;

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
  }

  ngOnInit(): void {
    this.auth
      .signInWithEmail(undefined)
      .subscribe(() => this.navCtrl.setRoot(TabsPageComponent), () => {});
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
