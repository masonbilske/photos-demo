import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { first } from 'rxjs/operators';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit, OnDestroy {
  photo$ = this.photoService.photo$;

  private finalise$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.finalise$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getPhoto(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.finalise$.next();
    this.finalise$.complete();
  }

  getPhoto(id: string): void {
    this.photoService.getPhotoById(id).pipe(first()).subscribe();
  }
}
