import { Component, OnInit, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinancialProduct } from '../../../domain/financial-product.model';
import { FinancialProductsApiService } from '../../../../../core/services/api/financial-products-api.service';
import {
  dateNotInPastValidator,
  minLengthTrimmed,
  maxLengthTrimmed,
  uniqueIdValidator
} from '../../../../../shared/validators/financial-product-validators';
import { calculateRevisionDate } from '../../../../../core/utils/date-utils';

@Component({
  selector: 'bp-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(FinancialProductsApiService);

  product = input<FinancialProduct | null>(null);
  formSubmit = output<FinancialProduct>();
  formCancel = output<void>();

  form!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.product();
    this.initForm();

    if (this.isEditMode && this.product()) {
      this.patchFormValues(this.product()!);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [
        { value: '', disabled: this.isEditMode },
        [Validators.required, minLengthTrimmed(3), maxLengthTrimmed(10)],
        this.isEditMode ? [] : [uniqueIdValidator(this.apiService)]
      ],
      name: ['', [Validators.required, minLengthTrimmed(5), maxLengthTrimmed(100)]],
      description: ['', [Validators.required, minLengthTrimmed(10), maxLengthTrimmed(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, dateNotInPastValidator]],
      date_revision: [{ value: '', disabled: true }]
    });

    this.form.get('date_release')?.valueChanges.subscribe(date => {
      if (date) {
        const revisionDate = calculateRevisionDate(date);
        this.form.get('date_revision')?.setValue(revisionDate);
      }
    });
  }

  private patchFormValues(product: FinancialProduct): void {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      this.formSubmit.emit(formValue);
    } else {
      this.markAllAsTouched();
    }
  }

  onReset(): void {
    if (this.isEditMode && this.product()) {
      this.patchFormValues(this.product()!);
    } else {
      this.form.reset();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError(error) && control.touched : false;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && control.touched : false;
  }

  isValidating(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.pending : false;
  }
}
