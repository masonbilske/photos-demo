import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoComponent } from './photo/photo.component';
import { PhotosComponent } from './photos/photos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/photos',
    pathMatch: 'full',
  },
  {
    path: 'photos',
    component: PhotosComponent,
  },
  {
    path: 'photo/:id',
    component: PhotoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
