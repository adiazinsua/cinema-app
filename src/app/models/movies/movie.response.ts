export class GetMoviesResponse {
  public errorMessage?: string;
  public movies?: MovieResult[];
}

export class MovieResult {
  public id!: string;
  public title!: string;
  public description!: string;
  public rating?: number | null;
  public imageUrl!: string;
  public userId!: string;
  public creationDate!: Date;
}

export class GetMovieResponse {
  public errorMessage?: string;
  public movie?: MovieResult;
}