import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { EditMovieRequest } from 'src/app/models/movies/edit-movie.request';
import { Movie } from 'src/app/models/movies/movie';
import { MovieService } from 'src/app/services/movies.service';
import { ToastService } from 'src/app/services/toasts.service';

const MOVIE_DELETED_SUCCESS_MESSAGE = 'Movie deleted successfully!'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {

  @Input()
  public movie!: Movie;

  @Output()
  public successMessageEmitter: EventEmitter<string> = new EventEmitter<string>();

  isImageLoaded = false;
  constructor(
    private toastService: ToastService,
    private navController: NavController,
    private movieService: MovieService,
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit() {

  }


  update() {
    this.clearToast();
    var request = new EditMovieRequest();
    request.rating = this.movie.rating;

    this.movieService.edit(this.movie.id, request, false).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

    })
  }

  setRating(rate: number, $event: any) {
    $event.stopPropagation();
    this.movie.rating = rate;
    this.update();
  }

  redirectToEdit() {
    this.navController.navigateRoot([routes.detail(this.movie.id)], { state: { isReadonly: false, fromSlide: true } });
  }

  async showDeleteMovieAlert() {
    this.clearToast();
    const alert = await this.alertCtrl.create({
      header: 'Delete Movie',
      message: 'Are you sure you want to delete this movie? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.deleteMovie();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteMovie() {
    this.movieService.delete(this.movie.id).subscribe((response) => {
      console.log(response)
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.successMessageEmitter.emit(MOVIE_DELETED_SUCCESS_MESSAGE);
    })
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.substring(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '...';
  }

  onImageLoad() {
    console.log('loading')
    this.isImageLoaded = true;
  }

  redirectToDetail() {
    this.navController.navigateForward([routes.detail(this.movie.id)])
  }

  redirectToHomeWithMessage(message: string = '') {
    this.navController.navigateForward([routes.home(), { state: { successMessage: message } }])
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
