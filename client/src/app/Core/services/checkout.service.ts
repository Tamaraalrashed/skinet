import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DeliveryMethod} from '../../Shared/Models/deliveryMethod';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];

  getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) return;
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-method').pipe(
      map(methods => {
        this.deliveryMethods = methods.sort((a, b) => b.price - a.price)
        return methods;
      })
    )
  }
}
