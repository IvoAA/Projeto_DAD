import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {User} from '../model/User';

const BASE_URL = 'http://localhost:8080/api/v1/';

@Injectable()
export class UserService {
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});

    constructor(private http: Http) {
    }

    upload(user: User): Promise<any> {
        let url = BASE_URL + 'upload';
        return this.http
            .post(url, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    create(user: User): Promise<any> {
        let url = BASE_URL + 'users';
        return this.http
            .post(url, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    update(user: User) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + "users/" + user._id;
        return this.http
            .put(url, JSON.stringify(user), {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    login(user: any) {
        let url = BASE_URL + 'login';
        return this.http
            .post(url, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    logOut() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + 'logout';
        return this.http
            .post(url, localStorage.getItem('user'), {headers: headers})
            .toPromise()
            .then(r => {
                localStorage.removeItem('user');
                this.handleResponse(r.json());
            })
            .catch(r => this.handleError());
    }

    get(id: string, token: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        let url = BASE_URL + 'users/' + id;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    getTop10Victories() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + 'top10v';
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    getTop10Points() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        let url = BASE_URL + 'top10p';
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(r => this.handleResponse(r.json()))
            .catch(r => this.handleError());
    }

    private handleResponse(data: any): Promise<any> {
        return Promise.resolve(data);
    }

    private handleError(): Promise<any> {
        return Promise.resolve({error: true, message: 'internal error'});
    }
}