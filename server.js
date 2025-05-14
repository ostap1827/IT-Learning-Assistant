const express = require('express');
const session = require('express-session');
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
app.use(session({
  secret: '1111', // Ключ для підпису сесії (замініть на свій)
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // У продакшені використовуйте `secure: true` для HTTPS
}));

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

app.get('/api/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json(null);
  }
  res.json(req.session.user);
});

// Вихід
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Не вдалося вийти' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Оновіть маршрут dashboard для відправлення HTML
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(__dirname + '/public/dashboard.html');
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

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  StudentRepository.findByEmail(email, (err, studentData) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка сервера' });
    }

    if (!studentData || !studentData.user) {
      return res.status(401).json({ error: 'Користувача не знайдено' });
    }

    // Перевірка пароля (реальний додаток - використовуйте bcrypt.compare!)
    if (studentData.user.passwordHash !== password) {
      return res.status(401).json({ error: 'Невірний пароль' });
    }

    // Зберігаємо дані в сесії
    req.session.user = {
      id: studentData.user.id,
      name: studentData.user.userName,
      email: studentData.user.email,
      role: studentData.user.role,
      progress: studentData.student?.currentProgress || 0
    };

    // Повертаємо успішну відповідь з даними
    res.json({
      success: true,
      redirect: '/dashboard',
      user: req.session.user
    });


  });
});

  
app.post('/api/regStudent', (req, res) => {
    const newUserName = req.body.userName;
    const email = req.body.email;
  
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




