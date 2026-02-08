import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('debe agregar la notificación a la lista', () => {
      service.show('Test message', 'info', 0);

      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].message).toBe('Test message');
      expect(service.notifications()[0].type).toBe('info');
    });

    it('debe auto-dismiss la notificación después de la duración', fakeAsync(() => {
      service.show('Auto dismiss', 'info', 1000);

      expect(service.notifications().length).toBe(1);

      tick(1000);

      expect(service.notifications().length).toBe(0);
    }));

    it('no debe auto-dismiss cuando la duración es 0', fakeAsync(() => {
      service.show('No auto dismiss', 'info', 0);

      tick(5000);

      expect(service.notifications().length).toBe(1);
    }));

    it('debe incrementar el id para cada notificación', () => {
      service.show('First', 'info', 0);
      service.show('Second', 'info', 0);

      expect(service.notifications()[0].id).toBe(1);
      expect(service.notifications()[1].id).toBe(2);
    });
  });

  describe('success', () => {
    it('debe mostrar la notificación de éxito', () => {
      service.success('Success message');

      expect(service.notifications()[0].type).toBe('success');
      expect(service.notifications()[0].message).toBe('Success message');
    });
  });

  describe('error', () => {
    it('debe mostrar la notificación de error', () => {
      service.error('Error message');

      expect(service.notifications()[0].type).toBe('error');
      expect(service.notifications()[0].message).toBe('Error message');
    });
  });

  describe('warning', () => {
    it('debe mostrar la notificación de advertencia', () => {
      service.warning('Warning message');

      expect(service.notifications()[0].type).toBe('warning');
      expect(service.notifications()[0].message).toBe('Warning message');
    });
  });

  describe('info', () => {
    it('debe mostrar la notificación de información', () => {
      service.info('Info message');

      expect(service.notifications()[0].type).toBe('info');
      expect(service.notifications()[0].message).toBe('Info message');
    });
  });

  describe('dismiss', () => {
    it('debe eliminar la notificación específica por id', () => {
      service.show('First', 'info', 0);
      service.show('Second', 'info', 0);

      const firstId = service.notifications()[0].id;
      service.dismiss(firstId);

      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].message).toBe('Second');
    });
  });

  describe('dismissAll', () => {
    it('debe eliminar todas las notificaciones', () => {
      service.show('First', 'info', 0);
      service.show('Second', 'info', 0);
      service.show('Third', 'info', 0);

      service.dismissAll();

      expect(service.notifications().length).toBe(0);
    });
  });

  describe('hasNotifications', () => {
    it('debe retornar false cuando no hay notificaciones', () => {
      expect(service.hasNotifications()).toBe(false);
    });

    it('debe retornar true cuando hay notificaciones', () => {
      service.show('Test', 'info', 0);
      expect(service.hasNotifications()).toBe(true);
    });
  });
});
