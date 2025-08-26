// URL da sua API no Railway
const API_URL_BASE = 'https://suape-progresso-ou-poluicao-backend-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('login-message');

    try {
        const response = await fetch(`${API_URL_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Login bem-sucedido!';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            // Redireciona para o painel de controle
            window.location.href = '/painel.html';
        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
        }
    } catch (error) {
        messageElement.textContent = 'Erro na conexão com o servidor.';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('register-message');

    try {
        const response = await fetch(`${API_URL_BASE}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.status === 201) {
            messageElement.textContent = 'Cadastro bem-sucedido! Redirecionando para login...';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            // Opcional: redirecionar para a página de login após o cadastro
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
        }
    } catch (error) {
        messageElement.textContent = 'Erro na conexão com o servidor.';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
    }
}

async function handleLogout() {
    try {
        const response = await fetch(`${API_URL_BASE}/api/logout`, {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            alert('Falha ao fazer logout.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro de conexão ao tentar sair.');
    }
}