"use strict";
var User = (function () {
    function User(_id, username, email, password, totalPoints, totalStars) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.totalPoints = totalPoints;
        this.totalStars = totalStars;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map