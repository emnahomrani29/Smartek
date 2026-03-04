package com.smartek.trainingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "course-service")
public interface CourseClient {
    
    @GetMapping("/api/courses/{id}")
    CourseResponse getCourseById(@PathVariable Long id);
    
    @GetMapping("/api/courses/{courseId}/chapters")
    List<ChapterResponse> getChaptersByCourseId(@PathVariable Long courseId);
}
