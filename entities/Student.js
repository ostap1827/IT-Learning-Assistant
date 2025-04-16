const User = require('./User');
const ROLE = 'student';

class Student extends User {
    constructor(userName, email, passwordHash, currentProgress = 0) {
        super(userName, email, passwordHash, ROLE);
        this.currentProgress = currentProgress;
        this.userRoadMaps = null;
    }
}

module.exports = Student;