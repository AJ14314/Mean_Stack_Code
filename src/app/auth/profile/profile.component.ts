import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  private userId;
  private userDetails: AuthData;
  userName: string;
  userEmail: string;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.authService.fetchUserProfile(this.userId);
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(data => {
      this.isLoading = false;
      this.userDetails = this.authService.getUserDetails();
      console.log(this.userDetails);
      this.userName = this.userDetails.username;
      this.userEmail = this.userDetails.email;
    });
  }

  onProfileUpdate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
  }
}
