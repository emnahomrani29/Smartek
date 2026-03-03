import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningStyleShowcaseComponent } from './learning-style-showcase.component';
import { LearningStyleService } from '../../../../core/services/learning-style.service';
import { of, throwError } from 'rxjs';
import { LearningStylePreference, LearningStyleType } from '../../../../core/models/learning-style.model';

describe('LearningStyleShowcaseComponent', () => {
  let component: LearningStyleShowcaseComponent;
  let fixture: ComponentFixture<LearningStyleShowcaseComponent>;
  let mockLearningStyleService: jasmine.SpyObj<LearningStyleService>;

  const mockLearningStyles: LearningStylePreference[] = [
    {
      id: 1,
      preferredStyle: LearningStyleType.VISUAL,
      videoPreferred: true,
      textPreferred: false,
      practicalWorkPreferred: true,
      lastUpdated: '2024-01-01T00:00:00Z',
      learnerId: 1,
      learnerName: 'John Doe'
    },
    {
      id: 2,
      preferredStyle: LearningStyleType.AUDITORY,
      videoPreferred: false,
      textPreferred: true,
      practicalWorkPreferred: false,
      lastUpdated: '2024-01-02T00:00:00Z',
      learnerId: 2,
      learnerName: 'Jane Smith'
    }
  ];

  beforeEach(async () => {
    mockLearningStyleService = jasmine.createSpyObj('LearningStyleService', ['getAllLearningStyles']);

    await TestBed.configureTestingModule({
      imports: [LearningStyleShowcaseComponent],
      providers: [
        { provide: LearningStyleService, useValue: mockLearningStyleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LearningStyleShowcaseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('should load learning styles on initialization', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of(mockLearningStyles));
    
    fixture.detectChanges(); // triggers ngOnInit
    
    expect(mockLearningStyleService.getAllLearningStyles).toHaveBeenCalled();
    expect(component.learningStyles()).toEqual(mockLearningStyles);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.lastUpdated()).toBeTruthy();
  });

  it('should set loading state during fetch', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of(mockLearningStyles));
    
    expect(component.loading()).toBe(true);
    
    fixture.detectChanges();
    
    expect(component.loading()).toBe(false);
  });

  it('should handle error state when service fails', () => {
    const errorMessage = 'Unable to connect to the server';
    mockLearningStyleService.getAllLearningStyles.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    
    fixture.detectChanges();
    
    expect(component.error()).toBe(errorMessage);
    expect(component.loading()).toBe(false);
  });

  it('should display empty state when data is empty array', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of([]));
    
    fixture.detectChanges();
    
    expect(component.learningStyles().length).toBe(0);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should refresh data when refresh button is clicked', (done) => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of(mockLearningStyles));
    
    fixture.detectChanges();
    
    const initialTimestamp = component.lastUpdated();
    
    // Wait a bit to ensure timestamp changes
    setTimeout(() => {
      component.refresh();
      
      expect(mockLearningStyleService.getAllLearningStyles).toHaveBeenCalledWith(true);
      expect(component.lastUpdated()).not.toBe(initialTimestamp);
      done();
    }, 10);
  });

  it('should retry loading when retry button is clicked', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    
    fixture.detectChanges();
    
    expect(component.error()).toBeTruthy();
    
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of(mockLearningStyles));
    
    component.retry();
    
    expect(mockLearningStyleService.getAllLearningStyles).toHaveBeenCalledTimes(2);
  });

  it('should track items by learnerId', () => {
    const item = mockLearningStyles[0];
    const trackId = component.trackByLearnerId(0, item);
    
    expect(trackId).toBe(item.learnerId);
  });

  it('should set lastUpdated timestamp after successful load', () => {
    mockLearningStyleService.getAllLearningStyles.and.returnValue(of(mockLearningStyles));
    
    fixture.detectChanges();
    
    expect(component.lastUpdated()).toBeInstanceOf(Date);
  });
});
