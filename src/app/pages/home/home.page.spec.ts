import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { MovieService } from 'src/app/services/movies.service';
import { MockMovieService } from 'src/app/services/mock/movies.service.mock';
import { HomePage } from './home.page';
import { StorageService } from 'src/app/services/storage.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: MovieService,
          useClass: MockMovieService
        },
        StorageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
