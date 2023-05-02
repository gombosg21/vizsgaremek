import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api-paths';
import { thread } from 'src/app/models/thread';
import { enviroment } from 'src/enviroments/enviroment'

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  private ApiPath = enviroment.baseUrl + ApiPaths.Thread;

  private threadData: thread;
  private threadList: thread[];

  constructor(private http: HttpClient) {

  }

  setLocalData(thread: thread): void {
    this.threadData = thread;
  };

  getLocalData(): thread {
    return this.threadData;
  };

  getThreadByID(ID: number): Observable<thread> {
    return this.http.get<thread>(this.ApiPath + "/" + ID);
  };

  createThread(data: thread): Observable<any> {
    return this.http.post(this.ApiPath, data);
  };

  patchThreadName(name: string, ID: number): Observable<any> {
    return this.http.patch(this.ApiPath + "/" + ID, { name: name });
  };
};
