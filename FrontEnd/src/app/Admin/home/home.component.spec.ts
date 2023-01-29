import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponet } from './home.component';


describe('Test2Component', () => {
  let component: HomeComponet;
  let fixture: ComponentFixture<HomeComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponet ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
