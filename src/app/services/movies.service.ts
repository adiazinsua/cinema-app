import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Movie } from '../models/movies/movie';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ErrorCodes, getErrorMessage } from '../models/error-codes.enum';
import { AddMovieRequest } from '../models/movies/add-movie.request';
import { catchError, concatMap, defer, finalize, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { EditMovieRequest } from '../models/movies/edit-movie.request';
import { BaseResponse } from '../models/base.response';
import { LoaderService } from './loader.service';
import { GetMovieResponse, MovieResult } from '../models/movies/movie.response';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly COLLECTION_KEY = 'movies';
  private movies: Movie[] = [];

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
        return movies.map(movie => ({ id: movie.docRef, ...movie })); // Devuelve las películas
      })
    );
  }

  get(movieId: string): Observable<GetMovieResponse> {
    return this.firestore.collection<any>(this.COLLECTION_KEY).doc(movieId).valueChanges().pipe(
      map(movie => {
        if (movie) {
          // Convierte creationDate a Date si es necesario
          if (movie.creationDate) {
            movie.creationDate = movie.creationDate.toDate(); // Asegúrate de que esto se ajuste a tu estructura
          }
          return { movie: { id: movieId, ...movie } } as GetMovieResponse; // Devuelve el movie con id
        }
        return { errorMessage: 'Movie not found.' } as GetMovieResponse; // Devuelve mensaje de error si no se encuentra
      }),
      catchError(error => {
        console.error('Error retrieving movie:', error);
        return of({ errorMessage: 'Error retrieving movie.' } as GetMovieResponse); // Manejo de errores
      }),
    );
  }

  edit(docId: string, request: EditMovieRequest, showLoader: boolean = true): Observable<BaseResponse> {
    if (showLoader) {
      this.loaderService.showLoader()
    }
    const updatedFields: { description?: string; rating?: number } = {};

    if (request.description) {
      updatedFields.description = request.description;
    }

    if (request.rating !== null) {
      updatedFields.rating = request.rating;
    }

    return from(this.firestore.collection(this.COLLECTION_KEY).doc(docId).update(updatedFields)).pipe(
      map(() => ({})),
      catchError(error => of({ errorMessage: getErrorMessage(error.code) })),
      finalize(() => {
        if (showLoader) {
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
