import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { IPhoto } from '../models/photo';
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

  getPhotos(n = 5): void {
    this.loading$.next(true);
    const request: Array<Observable<IPhoto>> = Array(n).fill(this.photoService.getRandomPhoto());
    forkJoin(request)
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe();
  }
}
