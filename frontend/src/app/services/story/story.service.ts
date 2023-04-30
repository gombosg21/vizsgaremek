import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api-paths';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(private http: HttpClient) { }

  private ApiPath = enviroment.baseUrl + ApiPaths.Story;

  private caruselInstance: carousel;
  private caruselList: carousel[];


  getStoryByID(ID: number): Observable<any> {
    return this.http.get(this.ApiPath + "/" + ID);
  };

  getAllStoriesFromUserID(ID: number): Observable<any> {
    return this.http.get(this.ApiPath + "/" + ApiPaths.User + "/" + ID + "/all");
  };

  postStory(story: carousel): Observable<any> {
    return this.http.post(this.ApiPath, story);
  };

  getLocalStoryInstance(): carousel {
    return this.caruselInstance;
  };

  setLocalStoryInstance(story: carousel) {
    this.caruselInstance = story;
  };

  getLocalStoryList(): carousel[] {
    return this.caruselList;
  };

  setLocalStoryList(storyList: carousel[]) {
    this.caruselList = storyList;
  };
}
