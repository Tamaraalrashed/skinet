import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, DefaultValueAccessor, FormControl, NgControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatError} from '@angular/material/form-field';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = '';

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(value: any): void {
  }

  registerOnTouched(fn: () => void): void {
  }

  registerOnChange(fn: (_: any) => {}): void {

  }

  setDisabledState(isDisabled: boolean): void {
  }

  get control() {
    return this.controlDir.control as FormControl;
  }

}
