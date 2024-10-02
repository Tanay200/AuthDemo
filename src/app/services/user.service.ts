import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient) { }

  public auth(payload:any):Observable<any>{
    // return this.httpClient.post("http://localhost:8080/auth/login",payload);
    return this.httpClient.get("/assets/JSON/db.json");
  }

  public getMovies(): Observable<any>{
    return this.httpClient.get("https://dummyapi.online/api/movies");
  }

  getData() {
    const observables = [
      this.httpClient.get('https://jsonplaceholder.typicode.com/todos'),
      this.httpClient.get('https://jsonplaceholder.typicode.com/posts')
    ]

    return forkJoin([observables]);

  }
}
