import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CreateAccountPage } from './create-account.page';
import { AppModule } from 'src/app/app.module';
import { UserService } from 'src/app/services/users.service';
import { MockUserService } from 'src/app/services/mock/users.service.mock';

describe('CreateAccountPage', () => {
  let component: CreateAccountPage;
  let fixture: ComponentFixture<CreateAccountPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccountPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
