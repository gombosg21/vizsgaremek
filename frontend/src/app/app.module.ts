import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UploadImageModalComponent } from './components/modals/upload-image-modal/upload-image-modal.component';
import { ImageModalComponent } from './components/modals/image-modal/image-modal.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TokenInterceptor } from './auth/token.interceptor';
import { ThreadComponent } from './components/thread/thread.component';
import { CommentComponent } from './components/comment/comment.component';
import { FriendsComponent } from './components/friends/friends.component';
import { TagsComponent } from './components/tags/tags.component';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ImageComponent } from './components/image/image.component';
import { dbConfig } from './config/db';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { EditModalComponent } from './components/modals/edit-modal/edit-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DbService } from './services/db/db.service';
import { ReactionModalComponent } from './components/modals/reaction-modal/reaction-modal.component';
import { MediaTilesetComponent } from './components/media-tileset/media-tileset.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselTilesetComponent } from './components/carousel-tileset/carousel-tileset.component';
import { UserSearchModalComponent } from './components/modals/user-search-modal/user-search-modal.component';
import { ThreadSearchModalComponent } from './components/modals/thread-search-modal/thread-search-modal.component';
import { CarouselSearchModalComponent } from './components/modals/carousel-search-modal/carousel-search-modal.component';
import { MediaSearchComponent } from './components/media-search/media-search.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { ImageEditTagsModalComponent } from './components/modals/image-edit-tags-modal/image-edit-tags-modal.component';
import { FollowedComponent } from './components/followed/followed.component';
import { ImagePickerModalComponent } from './components/modals/image-picker-modal/image-picker-modal.component';
import { AuthService } from './services/auth/auth.service';
import { ThreadShortComponent } from './components/thread-short/thread-short.component';
import { ThreadCreateModalComponent } from './components/modals/thread-create-modal/thread-create-modal.component';
import { CarouselSearchComponent } from './components/carousel-search/carousel-search.component';
import { CarouselBuilderComponent } from './components/carousel-builder/carousel-builder.component';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { AdminTagsComponent } from './components/admin/admin-tags/admin-tags.component';
import { AdminReactionsComponent } from './components/admin/admin-reactions/admin-reactions.component';
import { MediaThreadComponent } from './components/media-thread/media-thread.component';
import { CarouselThreadComponent } from './components/carousel-thread/carousel-thread.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FeedComponent,
    ProfileComponent,
    NavbarComponent,
    UploadImageModalComponent,
    ImageModalComponent,
    ThreadComponent,
    CommentComponent,
    FriendsComponent,
    TagsComponent,
    ReactionsComponent,
    ImageComponent,
    EditModalComponent,
    ReactionModalComponent,
    MediaTilesetComponent,
    CarouselComponent,
    CarouselTilesetComponent,
    UserSearchModalComponent,
    ThreadSearchModalComponent,
    CarouselSearchModalComponent,
    MediaSearchComponent,
    EditProfileComponent,
    EditImageComponent,
    ImageEditTagsModalComponent,
    FollowedComponent,
    ImagePickerModalComponent,
    ThreadShortComponent,
    ThreadCreateModalComponent,
    CarouselSearchComponent,
    CarouselBuilderComponent,
    AdminBoardComponent,
    AdminTagsComponent,
    AdminReactionsComponent,
    MediaThreadComponent,
    CarouselThreadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,
    CarouselModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: DbService
    },
    {
      provide: AuthService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (reactions: DbService) => async () => { return await reactions.fillReactions() },
      deps: [DbService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (tags: DbService) => async () => { return await tags.fillTags() },
      deps: [DbService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
