const db = require('../db/database');

const KEY_ID = 'id';

class RoadMapRepository {

    
    static deleteRoadMapFromDB(id, callback) {
        // Формуємо SQL запит для видалення
        const sql = `DELETE FROM roadmaps WHERE ${KEY_ID} = ?`;

        // Використовуємо db.run для виконання DELETE, INSERT, UPDATE
        db.run(
            sql,        // SQL запит
            [id],       // Масив параметрів для плейсхолдера '?'
            function(err) { // Використовуємо function(), щоб мати доступ до this.changes
                if (err) {
                    console.error("Error executing delete query:", err.message);
                    return callback(err); // Повертаємо помилку
                }

                // this.changes показує, скільки рядків було змінено (видалено)
                if (this.changes === 0) {
                    // Якщо жоден рядок не було видалено, можливо, запису з таким ID не існувало
                    console.warn(`Delete operation attempted for ID: ${id}, but no rows were affected.`);
                    // Можна повернути специфічну помилку "не знайдено", якщо потрібно
                    // return callback(new Error(`Roadmap with ID ${id} not found`));
                } else {
                    console.log(`Delete operation successful for ID: ${id}. Rows affected: ${this.changes}`);
                }

                // Повертаємо успіх (null як помилка)
                // Другий аргумент може бути інформативним, наприклад, кількість видалених рядків
                callback(null, { changes: this.changes });
            }
        );
    }


    // Ваш існуючий метод insertRoadMapToDB (з невеликим виправленням у передачі параметрів)
    static insertRoadMapToDB(roadMap) {
        // Переконайтесь, що всі три параметри передаються в масиві
        db.run('INSERT INTO roadmaps (title, description, studentId) VALUES (?, ?, ?)',
            [roadMap.title, roadMap.description, roadMap.studentId], // Потрібно передати всі значення в одному масиві
            (err) => { // Додайте callback для обробки помилок вставки (опціонально, але рекомендовано)
                if (err) {
                    console.error("Error inserting roadmap:", err.message);
                } else {
                    // Можна додати логування успішної вставки, якщо потрібно
                    // console.log(`Roadmap inserted with ID: ${this.lastID}`); // this.lastID доступний тут
                }
            });
    }

    /**
     * Знаходить всі записи roadmaps в базі даних.
     * @param {function(Error|null, Array<Object>|null)} callback - Функція зворотного виклику.
     *                                                           Перший аргумент - помилка (або null).
     *                                                           Другий аргумент - масив об'єктів roadmap (або null).
     */
    static findAll(callback) {
        // Вибираємо всі потрібні колонки з таблиці roadmaps
        const sql = `SELECT id, title, description, studentId FROM roadmaps`;

        db.all(sql, (err, rows) => {
            if (err) {
                // Якщо сталася помилка під час запиту до БД
                console.error("Error fetching roadmaps:", err.message);
                // Повертаємо помилку через callback
                return callback(err);
            }
            // Якщо помилок немає, повертаємо null для помилки і отримані рядки (roadmaps)
            callback(null, rows);
        });
    }
}

module.exports = RoadMapRepository;