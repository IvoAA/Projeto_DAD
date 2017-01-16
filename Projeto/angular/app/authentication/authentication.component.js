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
var router_1 = require("@angular/router");
var user_service_1 = require("../services/user.service");
var forms_1 = require("@angular/forms");
var core_2 = require('angular2-cookie/core');
var AuthenticationComponent = (function () {
    function AuthenticationComponent(fb, router, userService, _cookieService) {
        this.router = router;
        this.userService = userService;
        this._cookieService = _cookieService;
        this.complexForm = fb.group({
            'username': [null, forms_1.Validators.required],
            'password': [null, forms_1.Validators.required]
        });
    }
    AuthenticationComponent.prototype.login = function (value) {
        var _this = this;
        this.userService
            .login({ username: value.username, password: value.password })
            .then(function (r) {
            if (r.error) {
                _this.complexForm.controls['username'].setErrors({ 'server': 'Incorrect username or password' });
            }
            else {
                _this.setCookie(r);
                //localStorage.setItem('user', JSON.stringify(r));
                _this.router.navigate(['/home']);
            }
        });
    };
    AuthenticationComponent.prototype.setCookie = function (r) {
        var d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        return this._cookieService.put('token', r.token + '#' + r._id, { expires: d.toUTCString(), path: '/' });
    };
    AuthenticationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'authentication',
            templateUrl: 'authentication.component.html',
            styleUrls: ['authentication.component.css']
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, router_1.Router, user_service_1.UserService, core_2.CookieService])
    ], AuthenticationComponent);
    return AuthenticationComponent;
}());
exports.AuthenticationComponent = AuthenticationComponent;
//# sourceMappingURL=authentication.component.js.map