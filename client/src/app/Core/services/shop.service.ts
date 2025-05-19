import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../../Shared/Models/pagination';
import {Product} from '../../Shared/Models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl='https://localhost:5001/api/';
  private http=inject(HttpClient);

  brands:String[]=[];
  types:String[]=[];

  constructor() { }
  getProducts(criteria:any)
  {
    let params=new HttpParams();
   if(criteria.selectedBrands && criteria.selectedBrands.length>0)
     params=params.append('brands',criteria.selectedBrands.join(','));
   if(criteria.selectedTypes && criteria.selectedTypes.length>0)
    params= params.append('types',criteria.selectedTypes.join(','));
   if(criteria.sort)
     params=params.append('sort',criteria.sort);
   if(criteria.search)
     params=params.append('search',criteria.search);

   if(criteria.pageIndex)
     params=params.append('pageIndex',criteria.pageIndex.toString());

   if(criteria.pageSize)
     params=params.append('pageSize',criteria.pageSize);

   return this.http.get<Pagination<Product>>(this.baseUrl+'products',{params:params})

  }
  getBrands()
  {
    if(this.brands.length>0) return;
    return this.http.get<String[]>(this.baseUrl+'products/brands').subscribe({
      next: response => this.brands =response
    })
  }
  getTypes()
  {
    if(this.types.length>0) return;
    return this.http.get<String[]>(this.baseUrl+'products/types').subscribe({
      next: response => this.types =response
    })
  }

}
