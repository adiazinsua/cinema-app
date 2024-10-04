import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { MovieService } from 'src/app/services/movies.service';
import { MockMovieService } from 'src/app/services/mock/movies.service.mock';
import { MovieDetailPage } from './movie-detail.page';

describe('MovieDetailPage', () => {
  let component: MovieDetailPage;
  let fixture: ComponentFixture<MovieDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetailPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: MovieService,
          useClass: MockMovieService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
