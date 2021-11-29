import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IPhoto } from '../models/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photosSubject = new BehaviorSubject<IPhoto[]>([]);
  public photos$ = this.photosSubject.asObservable();

  private photoSubject = new BehaviorSubject<IPhoto | null>(null);
  public photo$ = this.photoSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getRandomPhoto(): Observable<IPhoto> {
    return this.httpClient
      .get(`https://picsum.photos/200`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        switchMap(async (response) => {
          const data = await this.createImageFromBlob(response.body);
          const retVal = {
            id: response.headers.get('picsum-id'),
            data: data,
          } as IPhoto;
          this.photosSubject.next([...this.photos, retVal]);
          return retVal;
        })
      );
  }

  getPhotoById(id: string): Observable<IPhoto> {
    const photo = this.photos?.find(photo => photo.id === id);
    if(photo) {
      this.photoSubject.next(photo);
      return of(photo);
    }

    return this.httpClient
      .get(`https://picsum.photos/id/${id}/200`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        switchMap(async (response) => {
          const data = await this.createImageFromBlob(response.body);
          const photo = {
            id: response.headers.get('picsum-id'),
            data: data,
          } as IPhoto;
          this.photoSubject.next(photo);
          return photo;
        })
      )
  }

  createImageFromBlob(
    image: Blob | null
  ): Promise<string | ArrayBuffer | null> {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject();

      if (image) {
        reader.readAsDataURL(image);
      } else {
        reject();
      }
    });
  }

  get photos(): IPhoto[] {
    return this.photosSubject.value;
  }
}
