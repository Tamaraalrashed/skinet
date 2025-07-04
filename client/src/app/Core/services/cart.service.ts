import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Cart, CartItem} from '../../Shared/Models/Cart';
import {Product} from '../../Shared/Models/product';
import {map} from 'rxjs';
import {DeliveryMethod} from '../../Shared/Models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  selectedDeliveryMethod = signal<DeliveryMethod | null>(null);
  itemCount = computed(() =>
    this.cart()?.items.reduce((acc, item) => acc + item.quantity, 0));
  totals = computed(() => {
    const cart = this.cart();
    const delivery = this.selectedDeliveryMethod();
    if (!cart) return null;
    let subTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    let shipping = delivery ? delivery.price : 0;
    let discount = 0;
    return {
      subTotal,
      shipping,
      discount,
      total: subTotal + shipping - discount
    }
  })


  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart/?id=' + id).pipe(
      map(res => {
        this.cart.set(res)
        return this.cart;
      }))
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: response => this.cart.set(response)
    })
  }

  addItemToCart(item: CartItem | Product, quantity: number = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item))
      item = this.mapProductToCartItem(item);
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity: number = 1) {

    const cart = this.cart();
    if (!cart) return;

    let index = cart.items.findIndex(x => x.productId === productId);
    if (index !== -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1);
      }

      if (cart.items.length === 0)
        this.deleteCart();
      else
        this.setCart(cart);
    }
  }

  private createCart(): Cart {
    let cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    let index = items.findIndex(x => x.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else
      items[index].quantity += quantity;

    return items;
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }
}
