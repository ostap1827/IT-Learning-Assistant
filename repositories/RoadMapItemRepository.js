const db = require('../db/database');

class RoadMapItemRepository {
    static insertRoadMapItemToDB(roadMapItem,roadMap) {
        db.run('INSERT INTO roadmapitem (title,roadMapId) VALUES (?, ?)',
            [roadMapItem.title,roadMap.id]);
    }
}
module.exports = RoadMapItemRepository;