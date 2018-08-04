import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPageComponent {
  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
  ) {}

  getUser(): User {
    return this.authService.user;
  }

  signOut() {
    this.authService.signOut();
  }
}
