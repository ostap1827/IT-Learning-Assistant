class User {
    static userId = 1;
    constructor(email, passwordHash, role) {
        this.id = User.userId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        User.userId++

    }

}

module.exports = User;