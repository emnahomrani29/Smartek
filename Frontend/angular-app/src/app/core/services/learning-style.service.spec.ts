import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearningStyleService } from './learning-style.service';
import { LearningStylePreference, LearningStyleType } from '../models/learning-style.model';

describe('LearningStyleService', () => {
  let service: LearningStyleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LearningStyleService]
    });
    service = TestBed.inject(LearningStyleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get learning style preferences', () => {
    const mockResponse = {
      preferredStyle: LearningStyleType.VISUAL,
      videoPreferred: true,
      textPreferred: false,
      practicalWorkPreferred: true
    };

    service.getPreferences().subscribe(preferences => {
      expect(preferences.preferredStyle).toBe(LearningStyleType.VISUAL);
      expect(preferences.videoPreferred).toBe(true);
      expect(preferences.textPreferred).toBe(false);
      expect(preferences.practicalWorkPreferred).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create learning style preferences', () => {
    const newPreferences: LearningStylePreference = {
      preferredStyle: LearningStyleType.AUDITORY,
      videoPreferred: false,
      textPreferred: true,
      practicalWorkPreferred: false
    };
    
    const mockResponse = { 
      preferredStyle: LearningStyleType.AUDITORY,
      videoPreferred: false,
      textPreferred: true,
      practicalWorkPreferred: false
    };

    service.createPreferences(newPreferences).subscribe(preferences => {
      expect(preferences.preferredStyle).toBe(LearningStyleType.AUDITORY);
      expect(preferences.videoPreferred).toBe(false);
      expect(preferences.textPreferred).toBe(true);
      expect(preferences.practicalWorkPreferred).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ 
      preferredStyle: LearningStyleType.AUDITORY,
      videoPreferred: false,
      textPreferred: true,
      practicalWorkPreferred: false
    });
    req.flush(mockResponse);
  });

  it('should update learning style preferences', () => {
    const updatedPreferences: LearningStylePreference = {
      preferredStyle: LearningStyleType.READING,
      videoPreferred: true,
      textPreferred: true,
      practicalWorkPreferred: false
    };
    
    const mockResponse = { 
      preferredStyle: LearningStyleType.READING,
      videoPreferred: true,
      textPreferred: true,
      practicalWorkPreferred: false
    };

    service.updatePreferences(updatedPreferences).subscribe(preferences => {
      expect(preferences.preferredStyle).toBe(LearningStyleType.READING);
      expect(preferences.videoPreferred).toBe(true);
      expect(preferences.textPreferred).toBe(true);
      expect(preferences.practicalWorkPreferred).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ 
      preferredStyle: LearningStyleType.READING,
      videoPreferred: true,
      textPreferred: true,
      practicalWorkPreferred: false
    });
    req.flush(mockResponse);
  });

  it('should reset preferences to default', () => {
    service.resetToDefault().subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles/reset');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should delete preferences', () => {
    service.deletePreferences().subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle 404 error when preferences not found', () => {
    service.getPreferences().subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('http://localhost:8081/api/learning-styles');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});