import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { routes } from 'src/app/app.routes';
import { EditMovieRequest } from 'src/app/models/movies/edit-movie.request';
import { MovieResult } from 'src/app/models/movies/movie.response';
import { MovieService } from 'src/app/services/movies.service';
import { ToastService } from 'src/app/services/toasts.service';

const MOVIE_EDITED_SUCCESS_MESSAGE = 'Movie edited successfully!'
const MOVIE_DELETED_SUCCESS_MESSAGE = 'Movie deleted successfully!'

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private movieId!: string | null;
  public isReadonly: boolean = true;
  public fromSlide: boolean = false;
  public form: FormGroup;

  public movieDetail!: MovieResult;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private movieService: MovieService,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group(
      {
        description: [null, Validators.required],
        rating: [null],
      },
    );
  }

  ngOnInit() {
    this.isReadonly = history?.state?.isReadonly ?? true;
    this.fromSlide = history?.state?.fromSlide;
    this.activatedRoute.paramMap.subscribe(params => {
      this.movieId = params.get('id');
      if (this.movieId) {
        this.movieService.get(this.movieId).subscribe((response) => {
          if (response.errorMessage) {
            this.setErrorMessage(response.errorMessage);
            return;
          }

          if (response.movie) {
            this.movieDetail = response.movie;

            this.form.patchValue({
              description: this.movieDetail.description,
              rating: this.movieDetail.rating,
            });
          }
        })
      }
    });
  }

  onEdit() {
    this.isReadonly = false;
  }

  hasChanged(): boolean {
    return (
      this.form.value.description !== this.movieDetail.description ||
      this.form.value.rating !== this.movieDetail.rating
    );
  }

  get shouldEnableEditBtn() {
    return this.hasChanged() && this.form.valid;
  }

  update() {
    this.clearToast();
    var request = new EditMovieRequest();
    request.description = this.form.value.description;
    request.rating = this.form.value.rating;
    request.movieId = this.movieDetail.id,

      this.movieService.edit(request).subscribe((response) => {
        if (response.errorMessage) {
          this.setErrorMessage(response.errorMessage);
          return;
        }

        this.redirectToHomeWithMessage(MOVIE_EDITED_SUCCESS_MESSAGE);
      })
  }

  setRating(rate: number, movieId: string) {
    if (this.isReadonly) {
      return
    } else {
      this.form.controls['rating'].setValue(rate);
    }
  }

  cancelEdition() {
    this.form.reset();
    if (this.fromSlide) {
      this.redirectToHomeWithMessage();
    } else {
      this.isReadonly = true;
    }
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
    this.movieService.delete(this.movieDetail.id).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.redirectToHomeWithMessage(MOVIE_DELETED_SUCCESS_MESSAGE);
    })
  }

  redirectToHomeWithMessage(message: string = '') {
    this.navController.navigateRoot([routes.home()], { state: { successMessage: message } });
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }
}
