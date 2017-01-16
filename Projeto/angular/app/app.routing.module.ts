import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationComponent} from "./authentication/authentication.component";
//import {RegistrationComponent} from "./registration/registration.component";
//import {HomeComponent} from "./home/home.component";
//import {GameComponent} from "./game/game.component";
//import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
    {path: '', component: AuthenticationComponent},
    //{path: 'login', component: AuthenticationComponent},
    //{path: 'register', component: RegistrationComponent},
    //{path: 'home', component: HomeComponent},
    //{path: 'game', component: GameComponent},
    //{path: 'profile', component: ProfileComponent},
    //{path: 'upload', component: ProfileComponent},

    //redirect home if other
    {path: '**', redirectTo: ''}
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}