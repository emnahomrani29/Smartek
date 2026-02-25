import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, Question, Exercise, ExamResult, ExerciseAnswer } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8080/api/exams';

  constructor(private http: HttpClient) {}

  // Exam CRUD
  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  getExamsByCourse(courseId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/course/${courseId}`);
  }

  createExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  updateExam(id: number, exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Questions (for QUIZ)
  getQuestionsByExam(examId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${examId}/questions`);
  }

  createQuestion(examId: number, question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/${examId}/questions`, question);
  }

  updateQuestion(examId: number, questionId: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${examId}/questions/${questionId}`, question);
  }

  deleteQuestion(examId: number, questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/questions/${questionId}`);
  }

  // Exercises (for EXAM)
  getExercisesByExam(examId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/${examId}/exercises`);
  }

  createExercise(examId: number, exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/${examId}/exercises`, exercise);
  }

  updateExercise(examId: number, exerciseId: number, exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${examId}/exercises/${exerciseId}`, exercise);
  }

  deleteExercise(examId: number, exerciseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/exercises/${exerciseId}`);
  }

  // Exam Results
  submitExam(submissionData: any): Observable<ExamResult> {
    return this.http.post<ExamResult>('http://localhost:8080/api/exam-results/submit', submissionData);
  }

  submitQuiz(examId: number, answers: any): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/${examId}/submit-quiz`, answers);
  }

  submitExamOld(examId: number, answers: ExerciseAnswer[]): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/${examId}/submit-exam`, answers);
  }

  getResultsByUser(userId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/user/${userId}`);
  }

  getResultById(resultId: number): Observable<ExamResult> {
    return this.http.get<ExamResult>(`${this.apiUrl}/results/${resultId}`);
  }

  // Correction (for TRAINER)
  getPendingCorrections(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/pending`);
  }

  correctExercise(answerId: number, marks: number, feedback: string): Observable<ExerciseAnswer> {
    return this.http.put<ExerciseAnswer>(`${this.apiUrl}/exercise-answers/${answerId}/correct`, {
      marksObtained: marks,
      trainerFeedback: feedback
    });
  }

  finalizeCorrection(resultId: number): Observable<ExamResult> {
    return this.http.put<ExamResult>(`${this.apiUrl}/results/${resultId}/finalize`, {});
  }

  // Exam Enrollments
  getMyExams(userId: number): Observable<Exam[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Exam[]>('http://localhost:8080/api/exam-enrollments/my-exams', { params });
  }

  completeCourse(courseId: number, userId: number): Observable<string> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<string>(`http://localhost:8080/api/courses/${courseId}/complete`, null, { params });
  }
}
