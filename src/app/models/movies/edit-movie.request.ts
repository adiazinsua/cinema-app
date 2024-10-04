export class EditMovieRequest {
  public movieId!: string;
  public description?: string | null;
  public rating?: number | null;
  public showLoader?: boolean = true;
}