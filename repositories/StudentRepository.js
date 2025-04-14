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
      SELECT u.id, u.email, s.currentProgress
      FROM users u
      JOIN students s ON u.id = s.userId
    `, (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    }
}

module.exports = StudentRepository;