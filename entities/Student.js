const User = require('./User');
const ROLE = 'student';

class Student extends User {
    constructor(email, passwordHash, currentProgress = 0) {
        super(email, passwordHash, ROLE);
        this.currentProgress = currentProgress;
        this.userRoadMaps = null;
    }
}

module.exports = Student;