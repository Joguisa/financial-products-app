import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { FinancialProductsApiService } from '../../core/services/api/financial-products-api.service';

export function dateNotInPastValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { dateInPast: true };
}

export function minLengthTrimmed(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const trimmed = control.value.trim();
        return trimmed.length >= minLength ? null : { minLengthTrimmed: { requiredLength: minLength, actualLength: trimmed.length } };
    };
}

export function maxLengthTrimmed(maxLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const trimmed = control.value.trim();
        return trimmed.length <= maxLength ? null : { maxLengthTrimmed: { requiredLength: maxLength, actualLength: trimmed.length } };
    };
}

export function uniqueIdValidator(apiService: FinancialProductsApiService, excludeId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value || control.value.trim().length < 3) {
            return of(null);
        }

        if (excludeId && control.value === excludeId) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300),
            switchMap(id => apiService.verifyId(id)),
            map(exists => exists ? { idExists: true } : null),
            catchError(() => of(null)),
            first()
        );
    };
}
