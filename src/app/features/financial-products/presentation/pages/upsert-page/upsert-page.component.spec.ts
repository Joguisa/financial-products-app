import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPageComponent } from './upsert-page.component';

describe('UpsertPageComponent', () => {
  let component: UpsertPageComponent;
  let fixture: ComponentFixture<UpsertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
