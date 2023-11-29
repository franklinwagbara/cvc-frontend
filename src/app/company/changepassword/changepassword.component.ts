import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'changepassword.component.html',
  styleUrls: ['../company.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  createForm() {
    this.changePasswordForm = new FormGroup(
      {
        current_pasword: new FormControl('', [Validators.required]),
        new_pasword: new FormControl('', [Validators.required]),
        confirm_new_password: new FormControl('', [Validators.required]),
      },
      {}
    );
  }

  changePassword() {}
}
