import { Observable, of } from "rxjs";
import { BaseResponse } from "src/app/models/base.response";
import { MovieService } from "../movies.service";
import { AddMovieRequest } from "src/app/models/movies/add-movie.request";
import { EditMovieRequest } from "src/app/models/movies/edit-movie.request";
import { Movie } from "src/app/models/movies/movie";
import { GetMovieResponse, MovieResult } from "src/app/models/movies/movie.response";

export class MockMovieService extends MovieService {
  private moviesList: Movie[] = [
    {
      id: "1",
      userId: "user1",
      creationDate: new Date(),
      title: "Inception",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: null,
      imageUrl: "imageUrl"
    },
    {
      id: "2",
      userId: "user1",
      creationDate: new Date(),
      title: "Titanic",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: null,
      imageUrl: "imageUrl"
    },
    {
      id: "3",
      userId: "user1",
      creationDate: new Date(),
      title: "The Matrix",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: null,
      imageUrl: "imageUrl"
    },
  ]

  private movieResponse: GetMovieResponse = {
    movie: {
      id: "3",
      userId: "user1",
      creationDate: new Date(),
      title: "The Matrix",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: null,
      imageUrl: "imageUrl"
    },
  }

  public override addMovie(request: AddMovieRequest): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override getMovies(userId: string): Observable<Movie[]> {
    return of(this.moviesList)
  }

  public override get(movieId: string): Observable<GetMovieResponse> {
    return of(this.movieResponse);
  }

  public override edit(request: EditMovieRequest): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }

  public override delete(docId: string): Observable<BaseResponse> {
    const response = new BaseResponse();
    return of(response);
  }
}