import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShopService} from '../../../Core/services/shop.service';
import {Product} from '../../../Shared/Models/product';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {CartService} from '../../../Core/services/cart.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    MatIcon,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  product?: Product;
  quantityInCart: number = 0;
  quantity: number = 1;

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: response => {
        this.product = response
        this.updateQuantityInCart()
      }
    });
  }

  updateCart() {
    if (!this.product) return;
    if (this.quantityInCart < this.quantity) {
      let itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);

    } else {
      let itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart = this.cartService.cart()?.items.find(x => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;

  }

  getButtonText(): string {
    return this.quantityInCart > 0 ? 'update cart' : 'Add to cart';
  }
}
