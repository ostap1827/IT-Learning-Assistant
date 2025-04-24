
document.addEventListener("DOMContentLoaded", () => {
    const userNameInput = document.querySelector('input[name="userName"]');
    const userEmailInput = document.querySelector('input[name="userEmail"]');
    const userPasswordInput = document.querySelector('input[name="userPassword"]');
    const regButton = document.querySelector('button[type="submit"]');
    const messageEl = document.getElementById('canOrNot');

    // Показуємо повідомлення одразу при завантаженні
    messageEl.textContent = 'Заповніть форму для реєстрації.';
    messageEl.style.color = 'gray';
    regButton.disabled = true;

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateInputs() {
        const name = userNameInput.value.trim();
        const mail = userEmailInput.value.trim();
        const password = userPasswordInput.value.trim();

        let msg = '';

        // Перевірки
        if (name === '') {
            msg += 'Введіть ім’я користувача!\n';
        } else if (name.length < 4) {
            msg += 'Ім’я має містити щонайменше 4 символи!\n';
        }

        if (mail === '') {
            msg += 'Введіть пошту!\n';
        } else if (!isValidEmail(mail)) {
            msg += 'Формат пошти некоректний!\n';
        }

        if (password === '') {
            msg += 'Введіть пароль!\n';
        } else if (password.length < 4) {
            msg += 'Пароль має бути щонайменше 4 символи!\n';
        }

        if (msg !== '') {
            messageEl.textContent = msg.trim();
            messageEl.style.color = 'red';
            regButton.disabled = true;
            return;
        }

        // Перевірка на унікальність імені та пошти
        fetch('/api/checkUserData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: name, email: mail })
        })
        .then(res => res.json())
        .then(data => {
            let checkMsg = '';
            if (data.nameExists) checkMsg += 'Ім’я вже зайняте. ';
            if (data.emailExists) checkMsg += 'Ця пошта вже використовується.';

            if (checkMsg) {
                messageEl.textContent = checkMsg;
                messageEl.style.color = 'red';
                regButton.disabled = true;
            } else {
                messageEl.textContent = 'Ім’я та пошта доступні ✔';
                messageEl.style.color = 'green';
                regButton.disabled = false;
            }
        });
    }

    userNameInput.addEventListener('input', validateInputs);
    userEmailInput.addEventListener('input', validateInputs);
    userPasswordInput.addEventListener('input', validateInputs);
});

fetch('/api/roadmaps')
    .then(res => res.json())
        .then(roadmaps =>{
            const list = document.getElementById('roadmaps');
            roadmaps.forEach(roadmap => {
                const divOfMaps = document.createElement('div');
                divOfMaps.id = "divOfMaps";
                const li = document.createElement('li');
                li.textContent = '';

                const titleText = document.createElement('h2')
                titleText.textContent = roadmap.title;
                li.appendChild(titleText);

                const descriptionText = document.createTextNode(`Опис: ${roadmap.description}.`);
                li.appendChild(descriptionText);

                divOfMaps.appendChild(li);
                list.appendChild(divOfMaps);
        
            });
            
});

fetch('/api/students')
    .then(res => res.json())
        .then(students => {
            const list = document.getElementById('studentList');
            students.forEach(student => {
                const li = document.createElement('li');
                li.textContent = `${student.id}  ${student.userName}  ${student.email} | Прогрес: ${student.currentProgress}%`;
                list.appendChild(li);
            });
        });