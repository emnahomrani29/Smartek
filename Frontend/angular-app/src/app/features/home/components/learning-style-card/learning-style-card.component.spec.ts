import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningStyleCardComponent } from './learning-style-card.component';
import { LearningStylePreference, LearningStyleType } from '../../../../core/models/learning-style.model';

describe('LearningStyleCardComponent', () => {
  let component: LearningStyleCardComponent;
  let fixture: ComponentFixture<LearningStyleCardComponent>;

  const mockLearningStyle: LearningStylePreference = {
    id: 1,
    preferredStyle: LearningStyleType.VISUAL,
    videoPreferred: true,
    textPreferred: false,
    practicalWorkPreferred: true,
    lastUpdated: '2024-01-15T10:30:00Z',
    learnerId: 101,
    learnerName: 'John Doe'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningStyleCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LearningStyleCardComponent);
    component = fixture.componentInstance;
    component.learningStyle = mockLearningStyle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display learner name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('h3');
    expect(nameElement?.textContent?.trim()).toBe('John Doe');
  });

  it('should display preferred learning style', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const styleText = compiled.textContent;
    expect(styleText).toContain('Visual Learner');
  });

  it('should display video preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.material-icons');
    const videoIcon = Array.from(icons).find(icon => icon.textContent?.trim() === 'videocam');
    expect(videoIcon).toBeTruthy();
  });

  it('should display text preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.material-icons');
    const textIcon = Array.from(icons).find(icon => icon.textContent?.trim() === 'description');
    expect(textIcon).toBeTruthy();
  });

  it('should display practical work preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.material-icons');
    const practicalIcon = Array.from(icons).find(icon => icon.textContent?.trim() === 'build');
    expect(practicalIcon).toBeTruthy();
  });

  it('should have ARIA labels for preferred style icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const styleIcon = compiled.querySelector('.material-icons[aria-label*="Visual Learner"]');
    expect(styleIcon).toBeTruthy();
    expect(styleIcon?.getAttribute('role')).toBe('img');
  });

  it('should have ARIA labels for video preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const videoIcon = Array.from(compiled.querySelectorAll('.material-icons')).find(
      icon => icon.textContent?.trim() === 'videocam'
    );
    expect(videoIcon?.getAttribute('aria-label')).toContain('video content');
    expect(videoIcon?.getAttribute('role')).toBe('img');
  });

  it('should have ARIA labels for text preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textIcon = Array.from(compiled.querySelectorAll('.material-icons')).find(
      icon => icon.textContent?.trim() === 'description'
    );
    expect(textIcon?.getAttribute('aria-label')).toContain('text content');
    expect(textIcon?.getAttribute('role')).toBe('img');
  });

  it('should have ARIA labels for practical work preference icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const practicalIcon = Array.from(compiled.querySelectorAll('.material-icons')).find(
      icon => icon.textContent?.trim() === 'build'
    );
    expect(practicalIcon?.getAttribute('aria-label')).toContain('practical work');
    expect(practicalIcon?.getAttribute('role')).toBe('img');
  });

  it('should return correct icon for VISUAL style', () => {
    expect(component.getStyleIcon(LearningStyleType.VISUAL)).toBe('visibility');
  });

  it('should return correct icon for AUDITORY style', () => {
    expect(component.getStyleIcon(LearningStyleType.AUDITORY)).toBe('hearing');
  });

  it('should return correct icon for READ_WRITE style', () => {
    expect(component.getStyleIcon(LearningStyleType.READ_WRITE)).toBe('menu_book');
  });

  it('should return correct icon for KINESTHETIC style', () => {
    expect(component.getStyleIcon(LearningStyleType.KINESTHETIC)).toBe('touch_app');
  });

  it('should return correct icon for MULTIMODAL style', () => {
    expect(component.getStyleIcon(LearningStyleType.MULTIMODAL)).toBe('apps');
  });

  it('should return correct label for VISUAL style', () => {
    expect(component.getStyleLabel(LearningStyleType.VISUAL)).toBe('Visual Learner');
  });

  it('should return correct label for AUDITORY style', () => {
    expect(component.getStyleLabel(LearningStyleType.AUDITORY)).toBe('Auditory Learner');
  });

  it('should return correct label for READ_WRITE style', () => {
    expect(component.getStyleLabel(LearningStyleType.READ_WRITE)).toBe('Reading/Writing Learner');
  });

  it('should return correct label for KINESTHETIC style', () => {
    expect(component.getStyleLabel(LearningStyleType.KINESTHETIC)).toBe('Kinesthetic Learner');
  });

  it('should return correct label for MULTIMODAL style', () => {
    expect(component.getStyleLabel(LearningStyleType.MULTIMODAL)).toBe('Multimodal Learner');
  });

  it('should apply green color to preferred content icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const videoIcon = Array.from(compiled.querySelectorAll('.material-icons')).find(
      icon => icon.textContent?.trim() === 'videocam'
    );
    expect(videoIcon?.classList.contains('text-green-600')).toBe(true);
  });

  it('should apply gray color to non-preferred content icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textIcon = Array.from(compiled.querySelectorAll('.material-icons')).find(
      icon => icon.textContent?.trim() === 'description'
    );
    expect(textIcon?.classList.contains('text-gray-400')).toBe(true);
  });

  it('should display all required fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    
    // Check learner name
    expect(text).toContain('John Doe');
    
    // Check preferred style
    expect(text).toContain('Visual Learner');
    
    // Check content preferences labels
    expect(text).toContain('Video Content');
    expect(text).toContain('Text Content');
    expect(text).toContain('Practical Work');
  });
});
