import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsUploadingDataComponent } from './docs-uploading-data.component';

describe('DocsUploadingDataComponent', () => {
  let component: DocsUploadingDataComponent;
  let fixture: ComponentFixture<DocsUploadingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsUploadingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsUploadingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
