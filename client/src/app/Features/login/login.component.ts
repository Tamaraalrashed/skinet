import {Component, inject} from '@angular/core';
import {AccountService} from '../../Core/services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private fB = inject(FormBuilder);
  private returnUrl = '/shop';

  constructor() {
    let url = this.activeRouter.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  loginForm = this.fB.group({
    email: ['',],
    password: ['',]
  });

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe();
        this.router.navigateByUrl(this.returnUrl);
      }
    })
  }
}
