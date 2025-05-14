document.addEventListener("DOMContentLoaded", function() {
    // Отримати дані користувача
    fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            if (!user) {
                window.location.href = '/';
                return;
            }

            // Оновлення UI
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
            document.getElementById('userName').textContent = user.name;
            document.getElementById('fullName').value = user.name;
            document.getElementById('email').value = user.email;

            // Логіка для виходу
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                fetch('/api/logout', { method: 'POST' })
                    .then(() => window.location.href = '/');
            });
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = '/';
        });
});