import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { MovieService } from 'src/app/services/movies.service';
import { MockMovieService } from 'src/app/services/mock/movies.service.mock';
import { AddmovieModalComponent } from './add-movie.component';

describe('AddmovieModalComponent', () => {
  let component: AddmovieModalComponent;
  let fixture: ComponentFixture<AddmovieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddmovieModalComponent],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: MovieService,
          useClass: MockMovieService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddmovieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
