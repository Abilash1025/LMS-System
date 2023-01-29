import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleResourcesComponent } from './module-resources.component';

describe('ModuleResourcesComponent', () => {
  let component: ModuleResourcesComponent;
  let fixture: ComponentFixture<ModuleResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
