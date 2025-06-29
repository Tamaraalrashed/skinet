import {inject, Injectable} from '@angular/core';
import {
  ConfirmationToken,
  loadStripe,
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
  StripePaymentElement
} from '@stripe/stripe-js';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CartService} from './cart.service';
import {Cart} from '../../Shared/Models/Cart';
import {firstValueFrom, map} from 'rxjs';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  baseUrl: string = environment.apiUrl;
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

  constructor(private router: Router) {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise
  }

  async createPayment() {
    if (!this.paymentElement) {
      const elements = await this.initializeElements();
      if (elements) {
        this.paymentElement = this.elements?.create('payment')
      } else {
        throw new Error('Unable to create payment,elements has not been initialized.');
      }
    }
    return this.paymentElement;
  }

  async creatAddress() {
    if (!this.addressElement) {
      const elements = await this.initializeElements();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + '' + user.lastName
          if (user.address) {
            defaultValues.address = {
              line1: user.address.line1,
              line2: user.address.line2,
              city: user.address.city,
              country: user.address.country,
              state: user.address.state,
              postal_code: user.address.postalCode
            };
          }
        }

        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues: defaultValues,
        }
        this.addressElement = this.elements?.create('address', options)
      } else {
        throw new Error('Unable to create address,elements has not been initialized.');
      }
    }
    return this.addressElement;
  }


  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements(
          {clientSecret: cart.clientSecret, appearance: {labels: 'floating'}});
      } else {
        throw new Error('Stripe not found');
      }
    }
    return this.elements;
  }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error("Cart not found!");
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    )
  }

  async createConfirmationToken() {
    const stripe=await this.getStripeInstance();
    const elements=await this.initializeElements();
    const result=await elements.submit();
    if(result.error)
      throw new Error(result.error.message);

    if(stripe){
    return await stripe.createConfirmationToken({elements});
    }
    else throw new Error('stripe not found');
  }

  async confirmPayment(confirmationToken:ConfirmationToken) {
    const stripe=await this.getStripeInstance();
    const elements=await this.initializeElements();
    const result=await elements.submit();
    if(result.error)
      throw new Error(result.error.message);
    const clientSecret=this.cartService.cart()?.clientSecret;
if(stripe &&clientSecret){
return await stripe.confirmPayment(
  {
  clientSecret:clientSecret,
    confirmParams:{
    confirmation_token:confirmationToken.id
    },
    redirect:'if_required'
})}
else{
  throw new Error('Unable to load stripe');
  }

  }
  disposeAddressElement() {
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }
}
