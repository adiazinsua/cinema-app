import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { MovieService } from 'src/app/services/movies.service';
import { MockMovieService } from 'src/app/services/mock/movies.service.mock';
import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieCardComponent],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: MovieService,
          useClass: MockMovieService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
