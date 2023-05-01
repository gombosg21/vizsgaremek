import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { MediaTilesetComponent } from './components/media-tileset/media-tileset.component';
import { RegisterComponent } from './components/register/register.component';
import { QueryComponent } from './components/query/query.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselTilesetComponent } from './components/carousel-tileset/carousel-tileset.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'query',
    component: QueryComponent
  },
  {
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'medias',
    component: MediaTilesetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'medias/:id',
    component: MediaTilesetComponent
  },
  {
    path: 'carousel/:id',
    component: CarouselComponent
  },
  {
    path: 'carousels',
    component: CarouselTilesetComponent
  },
  {
    path: 'carousels/:id',
    component: CarouselTilesetComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
