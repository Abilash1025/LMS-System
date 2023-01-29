import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

//Local Storage
import { Storage } from 'src/app/Enums/Storage';

//Crypto Class
import { Cryptography } from 'src/app/Classes/Cryptography';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  public cryptoObj: Cryptography = new Cryptography();

  constructor(private http: HttpClient) { }

  httpOptions_With_ContentType = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT'
    })
  };

  httpOptionsFile_Without_ContentType = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT'
    })
  };

  ErrorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.error.message || "Server Error");
  }

  //Get Request
  GetRequest(url: string): Observable<any> {
    return this.http.get<any>(url, this.httpOptionsFile_Without_ContentType).pipe(catchError(this.ErrorHandler));
  }

  GetRequest_RequestParam(url: string, requestParam: any): Observable<any> {
    const requestOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT'
      }),
      params: requestParam
    }

    return this.http.get<any>(url, requestOption).pipe(catchError(this.ErrorHandler));
  }

  //Post
  PostRequest(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body, this.httpOptions_With_ContentType).pipe(catchError(this.ErrorHandler));
  }

  PostRequest_Multipart(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body, this.httpOptionsFile_Without_ContentType).pipe(catchError(this.ErrorHandler));
  }

  //Put
  PutRequest(url: string, body: any): Observable<any> {
    return this.http.put<any>(url, body, this.httpOptions_With_ContentType).pipe(catchError(this.ErrorHandler));
  }

  PutRequest_Multipart(url: string, body: any): Observable<any> {
    return this.http.put<any>(url, body, this.httpOptionsFile_Without_ContentType).pipe(catchError(this.ErrorHandler));
  }

  //Delete
  DeleteRequest(url: string): Observable<any> {
    return this.http.delete<any>(url, this.httpOptionsFile_Without_ContentType).pipe(catchError(this.ErrorHandler));
  }

  DeleteRequest_RequestParam(url: string, requestParam: any): Observable<any> {
    const requestOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT'
      }),
      params: requestParam
    }

    return this.http.delete<any>(url, requestOption).pipe(catchError(this.ErrorHandler));
  }
}
