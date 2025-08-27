// URL da sua API no Railway
const API_URL_BASE = 'https://suape-progresso-ou-poluicao-backend-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    // Formulários e botões de autenticação existentes
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Novos elementos para recuperação e redefinição de senha
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginBtn = document.getElementById('login-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Novas chamadas para os formulários de recuperação de senha
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
    }

    // Listener para o botão de login, caso seja redirecionado da redefinição
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login.html';
        });
    }
});

// ====================================================================
// Funções de Autenticação Existentes
// ====================================================================

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
            // Em vez de alert(), use uma mensagem na tela
            console.error('Falha ao fazer logout.');
            // Adicione um elemento para exibir a mensagem na página, se necessário
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        // Em vez de alert(), use uma mensagem na tela
    }
}

// ====================================================================
// Funções de Recuperação e Redefinição de Senha
// ====================================================================

async function handleForgotPassword(e) {
    e.preventDefault();
    const username = document.getElementById('forgot-username').value;
    const messageElement = document.getElementById('forgot-password-message');

    try {
        const response = await fetch(`${API_URL_BASE}/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Um link para redefinir sua senha foi enviado para seu email. (No console do servidor, o token foi exibido)';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            
            // Em um cenário real, você não faria isso. Isso é apenas para demonstração.
            console.log("Token de redefinição de senha para teste:", data.token);

        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        messageElement.textContent = 'Erro na conexão com o servidor.';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageElement = document.getElementById('reset-password-message');

    if (newPassword !== confirmPassword) {
        messageElement.textContent = 'As senhas não coincidem!';
        messageElement.classList.add('error');
        return;
    }

    try {
        const response = await fetch(`${API_URL_BASE}/api/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, new_password: newPassword })
        });
        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Senha redefinida com sucesso!';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            // Redireciona para a página de login após a redefinição
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 3000);
        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        messageElement.textContent = 'Erro na conexão com o servidor.';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
    }
}
