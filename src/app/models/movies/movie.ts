export interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number | null;
  imageUrl: string;
  userId: string;
  creationDate: Date;
}