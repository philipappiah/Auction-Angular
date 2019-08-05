import { Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  animal: string;
  name: string;
  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'account-circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/account_circle.svg'));
      iconRegistry.addSvgIcon(
        'bid',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/bid.svg'));

        iconRegistry.addSvgIcon(
          'money',
          sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/money.svg'));
    
  }
  


  openDialog(): void {
    const dialogRef = this.dialog.open(SignIn, {
      width: "500px",
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }


  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(SignUp, {
      width: "500px",
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }


}





@Component({
  selector: 'SignIn',
  templateUrl: 'SignIn.html',
})
export class SignIn {

  constructor(
    public dialogRef: MatDialogRef<SignIn>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSignInData() {
    let userLoginEmail = (<HTMLInputElement>document.getElementById('loginEmail')).value;
    let userLoginPass = (<HTMLInputElement>document.getElementById('loginPassword')).value;
    if (userLoginEmail.trim() == '') {
      alert("Email field is required");
      (<HTMLInputElement>document.getElementById('loginEmail')).focus();
      return;
    }

    if (userLoginPass.trim() == '') {
      alert("Password field is required");
      (<HTMLInputElement>document.getElementById('loginPassword')).focus();
      return;
    }

    alert("Validating login details. Please Wait...");




  }

}

@Component({
  selector: 'SignUp',
  templateUrl: 'SignUp.html',
})
export class SignUp {

  constructor(
    public dialogRef: MatDialogRef<SignUp>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSignUpData() {
    let userRegFname = (<HTMLInputElement>document.getElementById('signupFirstname')).value;
    let userRegLname = (<HTMLInputElement>document.getElementById('signupLastname')).value;
    let userRegEmail = (<HTMLInputElement>document.getElementById('signupEmail')).value;
    let userRegPass = (<HTMLInputElement>document.getElementById('signupPass')).value;
    let userRegConPass = (<HTMLInputElement>document.getElementById('signupConPass')).value;
    if (userRegFname.trim() == '') {
      alert("Firstname field is required");
      (<HTMLInputElement>document.getElementById('signupFirstname')).focus();
      return;
    }

    if (userRegLname.trim() == '') {
      alert("Lastname field is required");
      (<HTMLInputElement>document.getElementById('signupLastname')).focus();
      return;
    }

    if (userRegEmail.trim() == '') {
      alert("Email field is required");
      (<HTMLInputElement>document.getElementById('signupEmail')).focus();
      return;
    }
    if (userRegPass.trim() == '') {
      alert("Password field is required");
      (<HTMLInputElement>document.getElementById('signupPass')).focus();
      return;
    }

    if (!((userRegPass.trim()) === (userRegConPass.trim()))) {
      alert("Passwords do not match");

      (<HTMLInputElement>document.getElementById('signupPass')).value = '';
      (<HTMLInputElement>document.getElementById('signupConPass')).value = '';
      (<HTMLInputElement>document.getElementById('signupPass')).focus();
      return;
    }

    alert("Validating and registering new user. Please Wait...");




  }

}