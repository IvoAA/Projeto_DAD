import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../model/User";
import {CookieService} from 'angular2-cookie/core';

@Component({
    moduleId: module.id,
    selector: 'authentication',
    templateUrl: 'authentication.component.html',
    styleUrls: ['authentication.component.css']
})
export class AuthenticationComponent {
    static user: User;
    complexForm: FormGroup;

    constructor(fb: FormBuilder, private router: Router, private userService: UserService, private _cookieService: CookieService) {

        this.complexForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });
    }

    login(value: any): void {
        this.userService
            .login({username: value.username, password: value.password})
            .then(r => {
                if (r.error) {
                    this.complexForm.controls['username'].setErrors({'server': 'Incorrect username or password'})
                } else {
                    this.setCookie(r);
                    //localStorage.setItem('user', JSON.stringify(r));
                    this.router.navigate(['/home'])
                }
            });
    }

    setCookie(r: User) {
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        return this._cookieService.put('token', r.token + '#' + r._id, {expires: d.toUTCString(), path: '/'});
    }
}