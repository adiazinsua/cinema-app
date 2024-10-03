export class AddMovieRequest {
  public userId!: string;
  public title!: string;
  public description!: string;
  public selectedFile?: File | null;
  public creationDate!: Date;
}