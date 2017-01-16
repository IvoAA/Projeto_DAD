export class User {
    _id: string;
    username: string;
    email: string;
    password: string;
    totalPoints: number;
    totalStars: number;
    token: string;
    avatar: string;

    constructor(_id: string, username: string, email: string, password: string, totalPoints: number, totalStars: number) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.totalPoints = totalPoints;
        this.totalStars = totalStars;
    }
}