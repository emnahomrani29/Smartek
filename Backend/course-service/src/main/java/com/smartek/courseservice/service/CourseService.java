package com.smartek.courseservice.service;

import com.smartek.courseservice.dto.ChapterResponse;
import com.smartek.courseservice.dto.CourseRequest;
import com.smartek.courseservice.dto.CourseResponse;
import com.smartek.courseservice.entity.Chapter;
import com.smartek.courseservice.entity.Course;
import com.smartek.courseservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        log.info("Création d'un nouveau cours: {}", request.getTitle());
        
        if (courseRepository.findByTitle(request.getTitle()).isPresent()) {
            throw new RuntimeException("Un cours avec ce titre existe déjà");
        }
        
        Course course = Course.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .duration(request.getDuration())
                .trainerId(request.getTrainerId())
                .build();
        
        Course savedCourse = courseRepository.save(course);
        log.info("Cours créé avec succès: ID {}", savedCourse.getCourseId());
        
        return mapToResponse(savedCourse, "Cours créé avec succès");
    }
    
    public List<CourseResponse> getAllCourses() {
        log.info("Récupération de tous les cours");
        return courseRepository.findAll().stream()
                .map(course -> mapToResponse(course, null))
                .collect(Collectors.toList());
    }
    
    public CourseResponse getCourseById(Long id) {
        log.info("Récupération du cours avec ID: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return mapToResponse(course, null);
    }
    
    public List<CourseResponse> getCoursesByTrainer(Long trainerId) {
        log.info("Récupération des cours du trainer avec ID: {}", trainerId);
        return courseRepository.findByTrainerId(trainerId).stream()
                .map(course -> mapToResponse(course, null))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        log.info("Mise à jour du cours avec ID: {}", id);
        
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        
        course.setTitle(request.getTitle());
        course.setContent(request.getContent());
        course.setDuration(request.getDuration());
        
        Course updatedCourse = courseRepository.save(course);
        log.info("Cours mis à jour avec succès: ID {}", updatedCourse.getCourseId());
        
        return mapToResponse(updatedCourse, "Cours mis à jour avec succès");
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        log.info("Suppression du cours avec ID: {}", id);
        
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        courseRepository.deleteById(id);
        log.info("Cours supprimé avec succès: ID {}", id);
    }
    
    private CourseResponse mapToResponse(Course course, String message) {
        List<ChapterResponse> chapters = course.getChapters().stream()
                .map(this::mapChapterToResponse)
                .collect(Collectors.toList());
        
        return CourseResponse.builder()
                .courseId(course.getCourseId())
                .title(course.getTitle())
                .content(course.getContent())
                .duration(course.getDuration())
                .trainerId(course.getTrainerId())
                .chapters(chapters)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .message(message)
                .build();
    }
    
    private ChapterResponse mapChapterToResponse(Chapter chapter) {
        return ChapterResponse.builder()
                .chapterId(chapter.getChapterId())
                .title(chapter.getTitle())
                .description(chapter.getDescription())
                .orderIndex(chapter.getOrderIndex())
                .pdfFileName(chapter.getPdfFileName())
                .pdfFilePath(chapter.getPdfFilePath())
                .courseId(chapter.getCourse().getCourseId())
                .createdAt(chapter.getCreatedAt())
                .updatedAt(chapter.getUpdatedAt())
                .build();
    }
}
