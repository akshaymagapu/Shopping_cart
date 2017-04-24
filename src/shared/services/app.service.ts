import { Injectable } from "@angular/core"
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class ApiService {
  private urlJson = 'https://api.myjson.com/bins/19ynm&callback=callbackFN';  // URL to web api
  constructor(private http: Http) { }
  getData(): Observable<any> {
    return this.http.get(this.urlJson)
      .map(res => res.json().productsInCart)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
