import {Component, inject} from '@angular/core';
import {MatDivider} from '@angular/material/divider';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {ShopService} from '../../../Core/services/shop.service';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
 shopService=inject(ShopService);
 private dialogRef=inject(MatDialogRef<FiltersDialogComponent>);
 data=inject(MAT_DIALOG_DATA);
 selectedBrands:String[]=this.data.selectedBrands;
 selectedTypes:String[]=this.data.selectedTypes;

 applyFilters(){
   this.dialogRef.close({selectedBrands:this.selectedBrands,selectedTypes:this.selectedTypes});
 }
}
