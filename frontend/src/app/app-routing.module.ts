import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { MediaTilesetComponent } from './components/media-tileset/media-tileset.component';
import { RegisterComponent } from './components/register/register.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselTilesetComponent } from './components/carousel-tileset/carousel-tileset.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { AdminReactionsComponent } from './components/admin/admin-reactions/admin-reactions.component';
import { AdminTagsComponent } from './components/admin/admin-tags/admin-tags.component';
import { MediaThreadComponent } from './components/media-thread/media-thread.component';
import { CarouselThreadComponent } from './components/carousel-thread/carousel-thread.component';

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
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
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
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'medias',
    component: MediaTilesetComponent,
  },
  {
    path: 'medias/:id',
    component: MediaTilesetComponent,
    canActivate: [AuthGuard]
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
  },
  {
    path: 'friends',
    component: FriendsComponent
  },
  {
    path: 'admin/tags',
    component: AdminTagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/reactions',
    component: AdminReactionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminBoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'media/:mediaid/thread/:threadid',
    component: MediaThreadComponent
  }, 
  {
    path: 'carousel/:carouselid/thread/:threadid',
    component: CarouselThreadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
