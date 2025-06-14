import {Component, inject} from '@angular/core';
import {AccountService} from '../../Core/services/account.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {TextInputComponent} from '../../Shared/components/text-input/text-input.component';
import {first} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatButton,
    MatCard,

    ReactiveFormsModule,

    TextInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  validatioErrors?: string[];

  registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.open('Successfully registered- you can login now', 'Close', {
          panelClass: 'success-snackbar',
        })
        this.router.navigateByUrl('/account/login');
      }, error: err => this.validatioErrors = err
    })
  }

  protected readonly first = first;
}
