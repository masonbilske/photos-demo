import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  photos$ = this.photoService.photos$;
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    if (!this.photoService.photos?.length) {
      this.getPhotos();
    }
  }

  getPhotos(): void {
    this.loading$.next(true);
    forkJoin([
      this.photoService.getRandomPhoto(),
      this.photoService.getRandomPhoto(),
      this.photoService.getRandomPhoto(),
      this.photoService.getRandomPhoto(),
      this.photoService.getRandomPhoto(),
    ])
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe();
  }
}
