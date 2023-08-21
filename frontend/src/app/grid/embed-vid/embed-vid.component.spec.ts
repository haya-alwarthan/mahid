import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedVidComponent } from './embed-vid.component';

describe('EmbedVidComponent', () => {
  let component: EmbedVidComponent;
  let fixture: ComponentFixture<EmbedVidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbedVidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbedVidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
