import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let componentRef: ComponentRef<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('debe tener valores por defecto', () => {
      expect(component.isOpen()).toBe(false);
      expect(component.title()).toBe('');
      expect(component.confirmText()).toBe('Confirmar');
      expect(component.cancelText()).toBe('Cancelar');
    });

    it('debe aceptar valores personalizados', () => {
      componentRef.setInput('isOpen', true);
      componentRef.setInput('title', 'Custom Title');
      componentRef.setInput('confirmText', 'Yes');
      componentRef.setInput('cancelText', 'No');

      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
      expect(component.title()).toBe('Custom Title');
      expect(component.confirmText()).toBe('Yes');
      expect(component.cancelText()).toBe('No');
    });
  });

  describe('onConfirm', () => {
    it('debe emitir el evento de confirmación', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      component.onConfirm();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('debe emitir el evento de cancelación', () => {
      const emitSpy = jest.spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onOverlayClick', () => {
    it('debe emitir el evento de cancelación al hacer clic en el overlay', () => {
      const emitSpy = jest.spyOn(component.cancel, 'emit');

      const mockElement = {
        classList: {
          contains: (className: string) => className === 'modal-overlay'
        }
      } as unknown as HTMLElement;

      const mockEvent = { target: mockElement } as unknown as MouseEvent;

      component.onOverlayClick(mockEvent);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('debe emitir el evento de cancelación al hacer clic en el contenido del modal', () => {
      const emitSpy = jest.spyOn(component.cancel, 'emit');

      const mockElement = {
        classList: {
          contains: (className: string) => className === 'modal-content'
        }
      } as unknown as HTMLElement;

      const mockEvent = { target: mockElement } as unknown as MouseEvent;

      component.onOverlayClick(mockEvent);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('no debe mostrar el modal cuando isOpen es false', () => {
      componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeFalsy();
    });

    it('debe mostrar el modal cuando isOpen es true', () => {
      componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeTruthy();
    });

    it('debe mostrar el título', () => {
      componentRef.setInput('isOpen', true);
      componentRef.setInput('title', 'Test Modal Title');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Modal Title');
    });

    it('debe mostrar los textos de los botones', () => {
      componentRef.setInput('isOpen', true);
      componentRef.setInput('confirmText', 'Proceed');
      componentRef.setInput('cancelText', 'Abort');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Proceed');
      expect(compiled.textContent).toContain('Abort');
    });
  });
});
