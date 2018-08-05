import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { LoginPageComponent } from '../login/login';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPageComponent {
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    fb: FormBuilder,
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  onSubmit(): void {
    this.auth
      .signUp({
        email: this.form.get('email').value,
        password: this.form.get('password').value,
      })
      .subscribe(() => {
        const index = this.navCtrl.indexOf(this.navCtrl.getActive());
        this.navCtrl
          .push(LoginPageComponent, { signUpSuccessMessageVisible: true })
          .then(() => {
            this.navCtrl.remove(index);
          });
      });
  }
}
