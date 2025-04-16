class User {
    static userId = 1;
    constructor(userName, email, passwordHash, role) {
        this.id = User.userId;
        this.userName = userName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        User.userId++

    }

}

module.exports = User;