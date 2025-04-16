const express = require('express');
const StudentRepository = require('./repositories/StudentRepository');
const RoadMapRepository = require('./repositories/RoadMapRepository');
const UserRepository = require('./repositories/UserRepository');
const db = require('./db/database');
const RoadMap = require("./entities/RoadMap");
const User = require("./entities/User");
const Student = require("./entities/Student");

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ініціалізація тестових даних
db.serialize();
db.run('DELETE FROM users',);
db.run('DELETE FROM students',);
db.run('DELETE FROM roadmaps',);

//Тестові данні
let user1 = new Student('Ostap','ostap@', '12345', 20);
StudentRepository.insertStudentToDB(user1);
let rm = new RoadMap('c#','C# roadmap');
RoadMapRepository.insertRoadMapToDB(rm);


// API
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/students', (req, res) => {
    StudentRepository.findAll((err, students) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(students);
    });
});
app.post('/api/regStudent', (req, res) => {
    console.log(req.body.userName);
    StudentRepository.insertStudentToDB(new Student(req.body.userName,req.body.userEmail,req.body.userPassword));
    res.redirect('/');
});

app.listen(3000, () => console.log('Сервер запущено на http://localhost:3000'));


