declare var google : any;
import { Component, NgZone, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { share } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    MatError,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit{

  signInForm: FormGroup;
  hide : boolean = true;

  constructor(private snackBar: MatSnackBar ,private zone: NgZone,private fb: FormBuilder, private router :Router,private userService: UserService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '937377464152-nhm81ako441ank07ivfuiirv8ku9io2q.apps.googleusercontent.com',
      callback: (resp:any)=>{
        this.handleLogin(resp);
      }
    });

    google.accounts.id.renderButton(document.getElementById("signinDiv"), {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      shape: "circle",
      width:"200"
    });
  }

  handleLogin(response:any){
    if(response){
      this.zone.run(() => {
        this.router.navigate(['/dashboard']);
    });
    }
  }


  onSubmit(): void {
    if (this.signInForm.valid) {
      let payload = {
        "email": this.signInForm.controls['email'].value,
        "password": this.signInForm.controls['password'].value
      }

      this.userService.auth(payload).subscribe((res)=>{
        console.log(res);
        let isMatching = res.some((user: any) =>
          user.email === payload.email && user.password === payload.password
        );
        if (isMatching) {
          this.router.navigate(['/dashboard']);
        } else {
          this.showSnackBar('Invalid username or password');  // Show the snack bar
        }
      })
      // Add your sign in logic here
    }
  }

  forkJoin(){
    this.userService.getData().subscribe((res : any)=>{
      console.log(res);
    });
  }

  redirectToSignUp(): void {
      this.router.navigate(['/sign-up']);
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration the snackbar is displayed (in milliseconds)
      verticalPosition: 'top', // Position the snackbar at the top
      horizontalPosition: 'center', // Position the snackbar in the center horizontally
    });
  }

}
