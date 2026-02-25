import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillEvidenceListComponent } from './admin-skill-evidence.component';

describe('SkillEvidenceListComponent', () => {
  let component: SkillEvidenceListComponent;
  let fixture: ComponentFixture<SkillEvidenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillEvidenceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillEvidenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
