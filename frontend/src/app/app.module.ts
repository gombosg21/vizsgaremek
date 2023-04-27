import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { UploadComponent } from './components/modals/upload-modal/upload.component';
import { ImageModalComponent } from './components/modals/image-modal/image-modal.component';
import { QueryComponent } from './components/query/query.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './auth/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ThreadComponent } from './components/thread/thread.component';
import { CommentComponent } from './components/comment/comment.component';
import { StoryComponent } from './components/story/story.component';
import { FriendsComponent } from './components/friends/friends.component';
import { TagsComponent } from './components/tags/tags.component';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ImageComponent } from './components/image/image.component';
import { dbConfig } from './config/db';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
<<<<<<< HEAD
import { EditModalComponent } from './edit-modal/edit-modal.component';=======
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

>>>>>>> 75a43e62ee7bd8195cb6c735e6f887b30fc5c5f0


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FeedComponent,
    ProfileComponent,
    NavbarComponent,
    SearchComponent,
    UploadComponent,
    ImageModalComponent,
    QueryComponent,
    ThreadComponent,
    CommentComponent,
    StoryComponent,
    FriendsComponent,
    TagsComponent,
    ReactionsComponent,
<<<<<<< HEAD
    ImageComponent,
    EditModalComponent,
=======
>>>>>>> 75a43e62ee7bd8195cb6c735e6f887b30fc5c5f0
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
