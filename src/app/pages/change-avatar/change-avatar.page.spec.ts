import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangeAvatarPage } from './change-avatar.page';
import { UserService } from 'src/app/services/users.service';
import { MockUserService } from 'src/app/services/mock/users.service.mock';
import { AppModule } from 'src/app/app.module';

describe('ChangeAvatarPage', () => {
  let component: ChangeAvatarPage;
  let fixture: ComponentFixture<ChangeAvatarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeAvatarPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
