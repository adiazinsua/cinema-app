import { Injectable } from '@angular/core';
import { Movie } from '../models/movies/movie';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getErrorMessage } from '../models/error-codes.enum';
import { AddMovieRequest } from '../models/movies/add-movie.request';
import { catchError, finalize, from, map, Observable, of, switchMap } from 'rxjs';
import { EditMovieRequest } from '../models/movies/edit-movie.request';
import { BaseResponse } from '../models/base.response';
import { LoaderService } from './loader.service';
import { GetMovieResponse } from '../models/movies/movie.response';

export abstract class MovieService {
  public abstract addMovie(request: AddMovieRequest): Observable<BaseResponse>;
  public abstract getMovies(userId: string): Observable<Movie[]>;
  public abstract get(movieId: string): Observable<GetMovieResponse>;
  public abstract edit(request: EditMovieRequest): Observable<BaseResponse>;
  public abstract delete(docId: string): Observable<BaseResponse>
}


@Injectable({
  providedIn: 'root',
})
export class ApiMovieService implements MovieService {
  private readonly COLLECTION_KEY = 'movies';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private loaderService: LoaderService) {
  }

  addMovie(request: AddMovieRequest): Observable<BaseResponse> {
    this.loaderService.showLoader();

    const movieData = {
      userId: request.userId,
      title: request.title,
      description: request.description,
      creationDate: request.creationDate,
      imageUrl: '',
      rating: null
    };

    return from(this.firestore.collection(this.COLLECTION_KEY).add(movieData)).pipe(
      switchMap(docRef => {
        if (request.selectedFile) {
          this.loaderService.updateMessage('Uploading image...')
          const filePath = `movies/${docRef?.id}/${request.selectedFile.name}`;
          return from(this.storage.upload(filePath, request.selectedFile)).pipe(
            switchMap(snapshot => from(snapshot.ref.getDownloadURL())),
            switchMap(downloadURL =>
              from(this.firestore.collection(this.COLLECTION_KEY).doc(docRef.id).update({ imageUrl: downloadURL }))
            ),
            map(() => ({}))
          );
        }
        return of({});
      }),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) })),
      finalize(() => this.loaderService.hideLoader())
    );
  }

  getMovies(userId: string): Observable<Movie[]> {
    return this.firestore.collection<any>(this.COLLECTION_KEY, ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'docRef' }).pipe(
      map(movies => {
        return movies.map(movie => ({ id: movie.docRef, ...movie }));
      })
    );
  }

  get(movieId: string): Observable<GetMovieResponse> {
    return this.firestore.collection<any>(this.COLLECTION_KEY).doc(movieId).valueChanges().pipe(
      map(movie => {
        if (movie) {
          if (movie.creationDate) {
            movie.creationDate = movie.creationDate.toDate();
          }
          return { movie: { id: movieId, ...movie } } as GetMovieResponse;
        }
        return { errorMessage: 'Movie not found.' } as GetMovieResponse;
      }),
      catchError(error => {
        console.error('Error retrieving movie:', error);
        return of({ errorMessage: 'Error retrieving movie.' } as GetMovieResponse);
      }),
    );
  }

  edit(request: EditMovieRequest): Observable<BaseResponse> {
    if (request.showLoader) {
      this.loaderService.showLoader()
    }
    const updatedFields: { description?: string; rating?: number } = {};

    if (request.description) {
      updatedFields.description = request.description;
    }

    if (request.rating !== null) {
      updatedFields.rating = request.rating;
    }

    return from(this.firestore.collection(this.COLLECTION_KEY).doc(request.movieId).update(updatedFields)).pipe(
      map(() => ({})),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) })),
      finalize(() => {
        if (request.showLoader) {
          this.loaderService.hideLoader();
        }
      })
    );
  }

  delete(docId: string): Observable<BaseResponse> {
    this.loaderService.showLoader();
    return from(this.firestore.collection(this.COLLECTION_KEY).doc(docId).delete()).pipe(
      map(() => ({})),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) })),
      finalize(() => this.loaderService.hideLoader())

    );
  }

}
