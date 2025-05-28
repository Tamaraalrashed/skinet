import {Routes} from '@angular/router';
import {ShopComponent} from './Features/shop/shop.component';
import {HomeComponent} from './Features/home/home.component';
import {ProductDetailsComponent} from './Features/shop/product-details/product-details.component';
import {CartComponent} from './Features/cart/cart.component';
import {CheckoutComponent} from './Features/checkout/checkout.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'shop/:id', component: ProductDetailsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
