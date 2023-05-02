import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api-paths';
import { comment } from 'src/app/models/comment';
import { enviroment } from 'src/enviroments/enviroment'


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private ApiPathMain = enviroment.baseUrl + ApiPaths.Thread;
  private ApiPathSecondary = enviroment.baseUrl + ApiPaths.Comment;

  private comments: comment[];

  private comment:comment;

  constructor(private http: HttpClient) {
  }

  setLocalCommentList(comments: comment[]): void {
    this.comments = comments;
  };

  getLocalCommentList(): comment[] {
    return this.comments;
  };

  getLocalCommentInstance():comment {
    return this.comment;
  };

  setLocalCommentInstance(comment:comment):void {
    this.comment = comment;
  };

  postCommnet(data: comment, targetThreadID: Number): Observable<any> {
    return this.http.post(this.ApiPathMain + "/" + targetThreadID, data);
  };

  editComment(data: object, commentID: Number): Observable<comment> {
    return this.http.patch<comment>(this.ApiPathSecondary + "/" + commentID, data);
  };

  deleteComment(commentID: number): Observable<any> {
    return this.http.delete(this.ApiPathSecondary + "/" + commentID);
  };

};
