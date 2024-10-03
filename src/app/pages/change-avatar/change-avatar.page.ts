import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/users.service';

const AVATAR_CHANGED_SUCCESS_MESSAGE = 'Avatar changed successfully!';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.page.html',
  styleUrls: ['./change-avatar.page.scss'],
})
export class ChangeAvatarPage implements OnInit {
  user: any;
  avatars: any[] = [];
  selectedAvatarUrl: string | null = null;

  constructor(
    private toastService: ToastService,
    private storageService: StorageService,
    private usersService: UserService
  ) { }

  async ngOnInit() {
    this.user = await this.storageService.getItem('user');
    this.loadAvatars();
    this.selectedAvatarUrl = this.user?.avatarUrl
  }

  loadAvatars() {
    this.usersService.getAvatars()
      .subscribe((response) => {
        console.log(response)
        this.avatars = response
      });
  }

  selectAvatar(avatarUrl: string) {
    this.selectedAvatarUrl = avatarUrl;
  }

  async saveAvatar() {
    if (this.selectedAvatarUrl) {
      this.usersService.updateUserAvatar(this.user.uid, this.selectedAvatarUrl).subscribe((response) => {
        if (response.errorMessage) {
          this.setErrorMessage(response.errorMessage);
          return;
        }

        this.user.avatarUrl = this.selectedAvatarUrl;
        this.storageService.setItem('user', this.user);
        this.setSuccessMessage(AVATAR_CHANGED_SUCCESS_MESSAGE);
      })
    }

  }

  async setSuccessMessage(message: string) {
    await this.toastService.success(message);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }


}
