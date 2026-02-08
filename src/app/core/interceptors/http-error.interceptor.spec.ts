import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../services/notification.service';
import { HttpStatus } from '../constants/http-status.constants';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        NotificationService
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe pasar por solicitudes exitosas', () => {
    httpClient.get('/test').subscribe(data => {
      expect(data).toEqual({ success: true });
    });

    const req = httpMock.expectOne('/test');
    req.flush({ success: true });
  });

  describe('HTTP errors', () => {
    it('debe manejar error de red (status 0)', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: HttpStatus.NETWORK_ERROR, statusText: 'Unknown Error' });

      expect(errorSpy).toHaveBeenCalledWith('No se puede conectar con el servidor. Verifique su conexión.');
    });

    it('debe manejar solicitud incorrecta (400)', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush({ message: 'Invalid data' }, { status: HttpStatus.BAD_REQUEST, statusText: 'Bad Request' });

      expect(errorSpy).toHaveBeenCalledWith('Invalid data');
    });

    it('debe manejar solicitud incorrecta sin mensaje', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: HttpStatus.BAD_REQUEST, statusText: 'Bad Request' });

      expect(errorSpy).toHaveBeenCalledWith('Datos inválidos. Verifique la información ingresada.');
    });

    it('debe manejar no encontrado (404)', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush({ message: 'Resource not found' }, { status: HttpStatus.NOT_FOUND, statusText: 'Not Found' });

      expect(errorSpy).toHaveBeenCalledWith('Resource not found');
    });

    it('debe manejar no encontrado sin mensaje', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: HttpStatus.NOT_FOUND, statusText: 'Not Found' });

      expect(errorSpy).toHaveBeenCalledWith('El recurso solicitado no fue encontrado.');
    });

    it('debe manejar conflicto (409)', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: HttpStatus.CONFLICT, statusText: 'Conflict' });

      expect(errorSpy).toHaveBeenCalledWith('El recurso ya existe o hay un conflicto con los datos.');
    });

    it('debe manejar error interno del servidor (500)', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: HttpStatus.INTERNAL_SERVER_ERROR, statusText: 'Internal Server Error' });

      expect(errorSpy).toHaveBeenCalledWith('Error interno del servidor. Intente más tarde.');
    });

    it('debe manejar códigos de estado desconocidos con mensaje', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush({ message: 'Custom error' }, { status: 418, statusText: 'I am a teapot' });

      expect(errorSpy).toHaveBeenCalledWith('Custom error');
    });

    it('debe manejar códigos de estado desconocidos sin mensaje', () => {
      const errorSpy = jest.spyOn(notificationService, 'error');

      httpClient.get('/test').subscribe({
        error: () => { }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: 418, statusText: 'I am a teapot' });

      expect(errorSpy).toHaveBeenCalledWith('Error 418: I am a teapot');
    });
  });

  describe('propagación de errores', () => {
    it('debe volver a lanzar el error', (done) => {
      httpClient.get('/test').subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne('/test');
      req.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });
});
