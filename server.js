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
let rm2 = new RoadMap('Embedded','Embedded course');
RoadMapRepository.insertRoadMapToDB(rm);
RoadMapRepository.insertRoadMapToDB(rm2);


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

app.get('/api/roadmaps', (req,res) => {
  RoadMapRepository.findAll((err, roadmaps) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(roadmaps);
  });
});



app.post('/api/checkUserData', (req, res) => {
  const { userName, email } = req.body;

  StudentRepository.findAll((err, students) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    const result = {
      nameExists: false,
      emailExists: false
    };

    if (email) {
      result.emailExists = students.some(student => student.email === email);
    }

    if (userName) {
      result.nameExists = students.some(student => student.userName === userName);
    }

    

    res.json(result);
  });
});

  
app.post('/api/regStudent', (req, res) => {
    const newUserName = req.body.userName;
  
    StudentRepository.findAll((err, students) => {
      if (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
        return;
      }
  
      const nameExists = students.some(student => student.userName === newUserName);
      const emailExists = students.some(student => student.email === email);
  
      if (nameExists) {
        res.status(400).send('');
        return;
      }
      if (emailExists){
        res.status(400).send('');
        return;
      }
  
      StudentRepository.insertStudentToDB(new Student(
        req.body.userName,
        req.body.userEmail,
        req.body.userPassword
      ));
  
      res.redirect('/');
    });
  });
  
  app.delete("/api/deleteCourse/:id", (req,res) => {
    const { id } = req.params; 

    RoadMapRepository.deleteRoadMapFromDB(id, (err, result) => {
      if (err) {
          console.error('Помилка при видаленні курсу з БД:', err.message);
          return res.status(500).json({ message: 'Помилка сервера при видаленні курсу' });
      }

      if (result && result.changes === 0) {
          console.log(`Спроба видалення ID ${id}, але курс не знайдено в БД.`);
          return res.status(404).json({ message: 'Курс з таким ID не знайдено' });
      }

      console.log(`Курс з ID ${id} успішно видалено.`);
      res.status(200).json({
          message: `Курс успішно видалено!`,
          deletedId: id
      });

  });
  
  
  });

  app.post("/api/createNewCourse", (req,res) => {
    const newCourseTopic = req.body.course_topic;
  
    RoadMapRepository.findAll((err,roadmap) => {
      if (err) {
        console.log(err);
        res.status(500).send('');
      };
      const topicExists = roadmap.some(roadmap => roadmap.title === newCourseTopic)
      if (topicExists) {
        res.status(400).send('');
        return;
      };
  
      RoadMapRepository.insertRoadMapToDB(new RoadMap(
        req.body.course_topic,
        req.body.course_description
      ));
  
      res.redirect('/');
    });
  });

  
app.listen(3000, () => console.log('Сервер запущено на http://localhost:3000'));




