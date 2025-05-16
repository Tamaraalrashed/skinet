import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatBadge} from '@angular/material/badge';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [
    MatBadge,
MatIcon,
    MatButton
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
