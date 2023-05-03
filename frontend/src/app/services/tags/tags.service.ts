import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tag } from 'src/app/models/tag';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from 'src/app/enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private ApiPath: string = enviroment.baseUrl + ApiPaths.Tags;

  constructor(private http: HttpClient) {

  }

  getAllTags(): Observable<tag[]> {
    return this.http.get<tag[]>(this.ApiPath + "/all");
  };

  createTag(tag: tag): Observable<tag> {
    return this.http.post<tag>(this.ApiPath, tag);
  };

  editTag(tag: tag): Observable<tag> {
    return this.http.patch<tag>(this.ApiPath + "/" + tag.ID, { name: tag.name })
  };

  deleteTag(tag: tag): Observable<tag> {
    return this.http.delete<tag>(this.ApiPath + "/" + tag.ID);
  };

  searchTags(namelike: string): Observable<tag[]> {
    return this.http.get<tag[]>(this.ApiPath + "?" + "name=" + namelike);
  };
}
