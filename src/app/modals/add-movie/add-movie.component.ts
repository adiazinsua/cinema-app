import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movies.service';
import { ToastService } from 'src/app/services/toasts.service';
import { AddMovieRequest } from 'src/app/models/movies/add-movie.request';

@Component({
  selector: 'app-add-movie.component',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
})
export class AddmovieModalComponent implements OnInit {
  userId!: string;
  public form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private toastService: ToastService,
    private movieService: MovieService,
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        title: [null, [Validators.required]],
        description: [null, [Validators.required]],
        image: [null, Validators.required],
      },
    );
  }



  close() {
    this.modalCtrl.dismiss(null, 'close');
  }

  ngOnInit() {
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.form.controls['image'].setValue(this.selectedFile)

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  addMovie() {
    var request = new AddMovieRequest();
    request.title = this.form.value.title;
    request.description = this.form.value.description;
    request.selectedFile = this.form.value.image;
    request.userId = this.userId;
    request.creationDate = new Date();

    this.movieService.addMovie(request).subscribe((response) => {
      if (response.errorMessage) {
        this.setErrorMessage(response.errorMessage);
        return;
      }

      this.modalCtrl.dismiss(null, 'success');
    })
  }

  async setErrorMessage(message: string) {
    await this.toastService.error(message);
  }

  async clearToast() {
    await this.toastService.dismissAllToasts();
  }

  get shouldEnableSubmitBtn() {
    return this.form.valid;
  }
}
