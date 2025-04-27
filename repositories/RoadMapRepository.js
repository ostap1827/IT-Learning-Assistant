const db = require('../db/database');

class RoadMapRepository {
    static insertRoadMapToDB(roadMap) {
        db.run('INSERT INTO roadmaps (title, description,studentId) VALUES (?, ?,?)',
            [roadMap.title, roadMap.description],roadMap.studentId);
    }

    static getRoadMap() {
       // db.get(`SELECT * FROM roadmaps`);
    }
}
module.exports = RoadMapRepository;