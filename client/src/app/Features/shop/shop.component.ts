import {Component, inject, OnInit} from '@angular/core';
import {ShopService} from '../../Core/services/shop.service';
import {Product} from '../../Shared/Models/product';
import {ProductItemComponent} from './product-item/product-item.component';
import {MatDialog} from '@angular/material/dialog';
import {FiltersDialogComponent} from './filters-dialog/filters-dialog.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pagination} from '../../Shared/Models/pagination';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatPaginator,
    FormsModule,
    MatIconButton,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements  OnInit{

  private shopService=inject(ShopService);
  private dialogService=inject(MatDialog);

  public products?:Pagination<Product>  ;
  public pageSizeOptions=[5,10,20,50];
  public sortOptions=[{name:'Alphabetic',value:'name'}
    ,{name:'Price:L-H',value:'priceAsc'},{name:'Price H-L',value:'priceDesc'}];

   public criteria: {
    selectedBrands:string []
    selectedTypes:string []
    search?:string
    sort?:string
    pageIndex:number
    pageSize:number

  } = {
    selectedBrands: [],
    selectedTypes: [],
    sort:'name',
    pageIndex:1,
    pageSize:10
  };

  ngOnInit(){
  this.initializeShop();

  }
  private initializeShop():void{
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }
  onSortChange(event:MatSelectionListChange){
    const selectedOption=event.options[0];
    if(selectedOption){
      this.criteria.sort=selectedOption.value;
      this.criteria.pageIndex=1;
      this.getProducts();
    }
  }

   openFiltersDialog():void{
    const dialogRef=this.dialogService.open(FiltersDialogComponent,{
      minWidth:'400px',
      data:{ selectedBrands:this.criteria.selectedBrands,
        selectedTypes:this.criteria.selectedTypes}
    })
  dialogRef.afterClosed().subscribe(
  {
    next:result=> {

      if (result) {
        this.criteria.selectedBrands = result.selectedBrands;
        this.criteria.selectedTypes = result.selectedTypes;
        this.criteria.pageIndex=1;
        this.getProducts();
      }
    }
})
  }

  onPageChange(event:PageEvent){
    this.criteria.pageIndex=event.pageIndex+1;
    this.criteria.pageSize=event.pageSize;
    this.getProducts();
  }

  onSearchChange(){

    this.criteria.pageIndex=1;
    this.getProducts();
  }

 private getProducts(){
    this.shopService.getProducts(this.criteria).subscribe({
      next: response => this.products =response,
      error: err => {console.log(err)}
    })
  }



}
