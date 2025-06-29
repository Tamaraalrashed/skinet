import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {OrderSummaryComponent} from '../order-summary/order-summary.component';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {StripeService} from '../../Core/services/stripe.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent
} from '@stripe/stripe-js';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {Address} from '../../Shared/Models/User';
import {firstValueFrom} from 'rxjs';
import {AccountService} from '../../Core/services/account.service';
import {CheckoutDeliveryComponent} from './checkout-delivery/checkout-delivery.component';
import {CheckoutReviewComponent} from './checkout-review/checkout-review.component';
import {CartService} from '../../Core/services/cart.service';
import {CurrencyPipe} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepper,
    MatStep,
    RouterLink,
    MatButton,
    MatStepperNext,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    MatStepperPrevious,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress: boolean = false;
  completionStatus = signal<{ address: boolean, payment: boolean, delivery: boolean }>({
    address: false, payment: false, delivery: false
  });
confirmationToken?: ConfirmationToken;
loading:boolean=false;
  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.creatAddress();
      this.addressElement?.mount('#address-element');
      this.addressElement?.on('change', this.handleAddressChange);
      this.paymentElement = await this.stripeService.createPayment();
      this.paymentElement?.mount('#payment-element');
      this.paymentElement?.on('change', this.handlePaymentChange)
    } catch (error: any) {
      this.snackBar.open(error.message, 'close', {
        panelClass: 'error-snackbar'
      });
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {

    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }
  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {

    this.completionStatus.update(state => {
      state.payment = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event: boolean) {

    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }

  ngOnDestroy() {
    this.stripeService.disposeAddressElement();
  }

  async getConfirmationToken(){
    try {
      if (Object.values(this.completionStatus()).every(x => x)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error)
          throw new Error(result.error.message);

        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken)
      }
    }
    catch (error:any) {
      this.snackBar.open(error.message, 'close', {panelClass:'error-snackbar'})
    }
  }

  async confirmPayment(stepper:MatStepper){
    this.loading=true;
    try {
      if(this.confirmationToken){
        const result=await this.stripeService.confirmPayment(this.confirmationToken);
        if(result.error) throw new Error('Confirmation failed');
        else{
          this.cartService.deleteCart();
          this.cartService.selectedDeliveryMethod.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }
    }
    catch (error:any) {
      this.snackBar.open(error.message||'something went wrong',
   'close', {panelClass:'snackbar-error'})
      stepper.previous();
    }
    finally {
      this.loading=false;
    }
  }
  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent())
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken()
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;

  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue()
    const address = result?.value.address;
    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code,
      }
    }
    return null;
  }
}
