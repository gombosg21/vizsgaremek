import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api-paths';
import { comment } from 'src/app/models/comment';
import { enviroment } from 'src/enviroments/enviroment'


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private ApiPathMain = enviroment.baseUrl + ApiPaths.Thread;
  private ApiPathSecondary = enviroment.baseUrl + ApiPaths.Comment;
  private comments: Observable<comment[]>;
  private comment: Observable<comment>;

  constructor(private http: HttpClient) {
  };


  public set setLocalCommentList(comments: comment[]) {
    this.comments = of(comments);
  };

  public get getLocalCommentList(): Observable<comment[]> {
    return this.comments;
  };

  public get getLocalCommentInstance(): Observable<comment> {
    return this.comment;
  };

  public set setLocalCommentInstance(comment: comment) {
    this.comment = of(comment);
  };

  postComment(content: string, targetThreadID: Number): Observable<any> {
    return this.http.post(this.ApiPathMain + "/" + targetThreadID + "/comment", { content: content });
  };

  editComment(content: string, commentID: Number): Observable<comment> {
    return this.http.patch<comment>(this.ApiPathSecondary + "/" + commentID, { content: content });
  };

  deleteComment(commentID: number): Observable<any> {
    return this.http.delete(this.ApiPathSecondary + "/" + commentID);
  };
};
