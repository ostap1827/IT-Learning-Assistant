const db = require('../db/database');
const Student = require('../entities/Student');
const UserRepository = require('./UserRepository');

class StudentRepository {
    static insertStudentToDB(student) {
        UserRepository.insertUserToDB(student);

        db.run(
            'INSERT INTO students (userId, currentProgress) VALUES (?, ?)',
            [student.id, student.currentProgress]);
        }


    static findAll(callback) {
        db.all(`
      SELECT u.id, u.userName, u.email, s.currentProgress
      FROM users u
      JOIN students s ON u.id = s.userId
    `, (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    }
    static findByEmail (email, callback) {
        const sql = `
            SELECT 
                users.id,
                users.userName,
                users.email,
                users.passwordHash,
                users.role,
                students.userId,
                students.currentProgress
            FROM users
            LEFT JOIN students ON users.id = students.userId
            WHERE users.email = ?
        `;
        db.get(sql, [email], (err, row) => {
            db.close(); // Закриваємо з'єднання з базою

            if (err) {
                return callback(err, null);
            }

            if (!row) {
                return callback(null, null);
            }

            // Форматуємо результат
            const studentData = {
                user: {
                    id: row.id,
                    userName: row.userName,
                    email: row.email,
                    passwordHash: row.passwordHash,
                    role: row.role
                },
                student: row.userId ? {
                    userId: row.userId,
                    currentProgress: row.currentProgress
                } : null
            };

            callback(null, studentData);
        });
};

}

module.exports = StudentRepository;