import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { HttpStatus } from '../constants/http-status.constants';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case HttpStatus.NETWORK_ERROR:
            errorMessage = 'No se puede conectar con el servidor. Verifique su conexión.';
            break;
          case HttpStatus.BAD_REQUEST:
            errorMessage = error.error?.message || 'Datos inválidos. Verifique la información ingresada.';
            break;
          case HttpStatus.NOT_FOUND:
            errorMessage = error.error?.message || 'El recurso solicitado no fue encontrado.';
            break;
          case HttpStatus.CONFLICT:
            errorMessage = 'El recurso ya existe o hay un conflicto con los datos.';
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            errorMessage = 'Error interno del servidor. Intente más tarde.';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      notificationService.error(errorMessage);

      return throwError(() => error);
    })
  );
};
