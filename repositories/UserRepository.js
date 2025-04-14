const db = require('../db/database');
const User = require('../entities/User');

class UserRepository {
    static insertUserToDB(user) {
        db.run(
            'INSERT INTO users (id, email, passwordHash, role) VALUES (?, ?, ?,?)',
            [user.userId, user.email, user.passwordHash, user.role]
        );
    }

    // static findAll(callback) {
    //     db.all('SELECT * FROM users', (err, rows) => {
    //         if (err) return callback(err);
    //         callback(null, rows.map(row => new User(row.id, row.email, row.passwordHash, row.role)));
    //     });
    // }
}

module.exports = UserRepository;