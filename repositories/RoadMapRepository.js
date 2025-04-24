const db = require('../db/database');

class RoadMapRepository {
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