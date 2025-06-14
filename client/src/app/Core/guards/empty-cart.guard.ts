import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {CartService} from '../services/cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  let total = cartService.totals()?.total ?? 0;
  if (!cartService.cart() || cartService.cart()?.items.length == 0) {
    snackBar.open('empty cart!!', 'Close', {
      panelClass: 'danger-snackbar',
    })
    return false;
  }
  return true;

};
