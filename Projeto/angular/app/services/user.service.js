"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var BASE_URL = 'http://localhost:8080/api/v1/';
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    }
    UserService.prototype.upload = function (user) {
        var _this = this;
        var url = BASE_URL + 'upload';
        return this.http
            .post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.create = function (user) {
        var _this = this;
        var url = BASE_URL + 'users';
        return this.http
            .post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.update = function (user) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + "users/" + user._id;
        return this.http
            .put(url, JSON.stringify(user), { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.login = function (user) {
        var _this = this;
        var url = BASE_URL + 'login';
        return this.http
            .post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.logOut = function () {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + 'logout';
        return this.http
            .post(url, localStorage.getItem('user'), { headers: headers })
            .toPromise()
            .then(function (r) {
            localStorage.removeItem('user');
            _this.handleResponse(r.json());
        })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.get = function (id, token) {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        var url = BASE_URL + 'users/' + id;
        return this.http
            .get(url, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.getTop10Victories = function () {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + 'top10v';
        return this.http
            .get(url, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.getTop10Points = function () {
        var _this = this;
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        });
        var url = BASE_URL + 'top10p';
        return this.http
            .get(url, { headers: headers })
            .toPromise()
            .then(function (r) { return _this.handleResponse(r.json()); })
            .catch(function (r) { return _this.handleError(); });
    };
    UserService.prototype.handleResponse = function (data) {
        return Promise.resolve(data);
    };
    UserService.prototype.handleError = function () {
        return Promise.resolve({ error: true, message: 'internal error' });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map