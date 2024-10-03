import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { LoginRequest } from 'src/app/models/login/login-request.model';
import { Movie } from 'src/app/models/movies/movie';
import { MovieService } from 'src/app/services/movies.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toasts.service';
import { AddmovieModalComponent } from 'src/app/modals/add-movie/add-movie.component';
import { debounceTime } from 'rxjs';
import { UserService } from 'src/app/services/users.service';

const MOVIE_ADDED_SUCCESS_MESSAGE = 'Movie added successfully!';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public user: any;
  public movies: Movie[] = [];
  public moviesLoading: boolean = false;

  filteredMovies: Movie[] = [];
  showSearchBar = false;

  searchControl = new FormControl('');

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private navController: NavController,
    private storageService: StorageService,
    private movieService: MovieService,
    private modalCtrl: ModalController
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value: any) => {
      this.filterMovies(value);
    });
  }

  ngOnInit() {
    const successMessage = history?.state?.successMessage;
    if (successMessage) {
      this.setSuccessMessage(successMessage);
    }

    this.storageService.getItem('user').then(user => {
      if (user != null) {
        this.user = user;

        this.getMovies();
      } else {
        this.redirectToLogin();
      }
    });
  }

  getMovies() {
    this.moviesLoading = true;
    this.movieService.getMovies(this.user.uid).subscribe((response) => {
      this.movies = response;
      console.log(response)
      this.moviesLoading = false;
      this.filteredMovies = [...this.movies];
    })
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;

    if (!this.showSearchBar) {
      this.searchControl.setValue('');
      this.filteredMovies = [...this.movies];
    }
  }

  filterMovies(term: string) {
    const lowerTerm = term.toLowerCase();
    this.filteredMovies = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(lowerTerm)
    );
  }

  changeAvatar() {
    console.log('navigaate forward')
    console.log(this.user)
    this.navController.navigateRoot([routes.changeAvatar()], { state: { user: this.user } })
  }

  logout() {
    this.userService.logout().subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }
      this.redirectToLogin();
    });
  }

  async openAddMovieModal() {
    this.clearToast();
    const modal = await this.modalCtrl.create({
      component: AddmovieModalComponent,
      componentProps: { userId: this.user.uid }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'success') {
      this.setSuccessMessage(MOVIE_ADDED_SUCCESS_MESSAGE);
      this.getMovies();
    }
  }

  redirectToLogin() {
    this.navController.navigateRoot([routes.login()]);
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async setSuccessMessage(message: string) {
    await this.toastService.success(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }

  setMessageAfterDeletion(message: string) {
    this.setSuccessMessage(message);
    this.getMovies();
  }
}
