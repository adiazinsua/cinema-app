import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PasswordRecoveryPage } from './password-recovery.page';
import { UserService } from 'src/app/services/users.service';
import { MockUserService } from 'src/app/services/mock/users.service.mock';
import { AppModule } from 'src/app/app.module';

describe('PasswordRecoveryPage', () => {
  let component: PasswordRecoveryPage;
  let fixture: ComponentFixture<PasswordRecoveryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordRecoveryPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
