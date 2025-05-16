import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './Layout/header/header.component';
import {HttpClient} from '@angular/common/http';
import {Pagination} from './Shared/Models/pagination';
import {Product} from './Shared/Models/product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'skinet';
  baseUrl='https://localhost:5001/api/';
  private http=inject(HttpClient);
  products:Product[] = [];
  ngOnInit(){
    this.http.get<Pagination<Product>>(this.baseUrl+'products').subscribe({
      next: response => this.products =response.data,
      error: err => {console.log(err)}
      }
    )
   }
}
