import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CompaniesComponent } from '../companies/companies.component';
import { CoursesComponent } from '../courses/courses.component';
import { MentorsComponent } from '../mentors/mentors.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';
import { LearningStyleShowcaseComponent } from '../components/learning-style-showcase/learning-style-showcase.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    CompaniesComponent,
    CoursesComponent,
    MentorsComponent,
    TestimonialsComponent,
    ContactComponent,
    NewsletterComponent,
    LearningStyleShowcaseComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
