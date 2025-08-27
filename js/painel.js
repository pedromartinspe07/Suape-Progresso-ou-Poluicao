// URL da sua API no Railway
const API_URL_BASE = 'https://suape-progresso-ou-poluicao-backend-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    // Carrega o usuário atual para determinar permissões
    getCurrentUser();
    
    // Event listeners para formulários e botões
    const addPostForm = document.getElementById('add-post-form');
    if (addPostForm) {
        addPostForm.addEventListener('submit', handleAddPost);
    }

    const postListElement = document.getElementById('post-list');
    if (postListElement) {
        postListElement.addEventListener('click', handlePostActions);
    }

    const userListElement = document.getElementById('user-list');
    if (userListElement) {
        userListElement.addEventListener('click', handleUserActions);
    }
    
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchPosts);
    }
});

// ====================================================================
// Variáveis de Estado
// ====================================================================
let currentPage = 1;
const postsPerPage = 10;
let currentSearchTerm = '';

// ====================================================================
// Funções de Utilitário
// ====================================================================

async function getCurrentUser() {
    try {
        const response = await fetch(`${API_URL_BASE}/api/user`);
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            displayDashboard(user);
        } else if (response.status === 401) {
            // Se não estiver logado, redireciona para a página de login
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
    }
}

function displayDashboard(user) {
    const usernameElement = document.getElementById('user-username');
    const roleElement = document.getElementById('user-role');
    if (usernameElement) usernameElement.textContent = user.username;
    if (roleElement) roleElement.textContent = user.role;
    
    // Apenas admins podem ver a seção de gerenciamento de usuários
    const userManagementSection = document.getElementById('user-management-section');
    if (user.role === 'admin' && userManagementSection) {
        userManagementSection.style.display = 'block';
        fetchUsers();
    }
    
    // Inicia a busca pelos posts
    fetchPosts();
}

// ====================================================================
// Funções de Gerenciamento de Posts
// ====================================================================

async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL_BASE}/api/posts?page=${currentPage}&per_page=${postsPerPage}&search=${currentSearchTerm}`);
        const data = await response.json();
        renderPosts(data.posts);
        renderPagination(data.total_pages, data.current_page);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        alert('Erro ao carregar posts.');
    }
}

function renderPosts(posts) {
    const postListElement = document.getElementById('post-list');
    if (!postListElement) return;

    postListElement.innerHTML = '';
    if (posts.length === 0) {
        postListElement.innerHTML = '<p class="text-center text-gray-500">Nenhum post encontrado.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'border-b border-gray-200 py-4 flex justify-between items-center';
        postElement.innerHTML = `
            <div>
                <h3 class="text-lg font-bold">${post.title}</h3>
                <p class="text-gray-500">${post.excerpt.substring(0, 100)}...</p>
            </div>
            <div>
                <button data-id="${post.id}" data-action="edit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Editar</button>
                <button data-id="${post.id}" data-action="delete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Excluir</button>
            </div>
        `;
        postListElement.appendChild(postElement);
    });
}

function renderPagination(totalPages, currentPage) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;

    paginationElement.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `py-2 px-4 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`;
        button.addEventListener('click', () => {
            currentPage = i;
            fetchPosts();
        });
        paginationElement.appendChild(button);
    }
}

async function handleAddPost(e) {
    e.preventDefault();
    const form = e.target;
    const messageElement = document.getElementById('add-post-message');
    const formData = new FormData(form);
    
    // Converte os tags de uma string para um array de strings
    const tagsInput = formData.get('tags');
    if (tagsInput) {
        const tagsArray = tagsInput.split(',').map(tag => tag.trim());
        formData.set('tags', JSON.stringify(tagsArray));
    }
    
    try {
        const response = await fetch(`${API_URL_BASE}/api/posts`, {
            method: 'POST',
            body: formData, // Envia o formulário diretamente, incluindo o arquivo
        });
        
        const data = await response.json();

        if (response.status === 201) {
            messageElement.textContent = 'Post publicado com sucesso!';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            form.reset(); 
            fetchPosts(); // Atualiza a lista de posts
        } else {
            messageElement.textContent = data.message || 'Erro ao publicar o post.';
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
        }

    } catch (error) {
        messageElement.textContent = 'Erro de conexão com o servidor.';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
        console.error('Erro:', error);
    }
}

async function handleSearchPosts(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    currentSearchTerm = searchTerm;
    currentPage = 1; // Reseta a página para a primeira
    fetchPosts();
}

async function handlePostActions(e) {
    if (e.target.dataset.action === 'delete') {
        const postId = e.target.dataset.id;
        if (confirm('Tem certeza que deseja excluir este post?')) {
            await deletePost(postId);
        }
    }
    // Adicione a lógica para editar aqui
}

async function deletePost(postId) {
    try {
        const response = await fetch(`${API_URL_BASE}/api/posts/${postId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Post excluído com sucesso!');
            fetchPosts(); // Atualiza a lista após a exclusão
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao excluir o post.');
        }
    } catch (error) {
        console.error('Erro ao excluir o post:', error);
        alert('Erro de conexão ao excluir o post.');
    }
}


// ====================================================================
// Funções de Gerenciamento de Usuários
// ====================================================================

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL_BASE}/api/users`);
        if (response.ok) {
            const users = await response.json();
            renderUsers(users);
        } else {
            console.error('Não foi possível carregar os usuários.');
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

function renderUsers(users) {
    const userListElement = document.getElementById('user-list');
    if (!userListElement) return;

    userListElement.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'border-b border-gray-200 py-2 flex justify-between items-center';
        userElement.innerHTML = `
            <span>${user.username} (${user.role})</span>
            <div>
                <button data-id="${user.id}" data-action="change-role" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm mr-2">Mudar Role</button>
                <button data-id="${user.id}" data-action="delete-user" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">Excluir</button>
            </div>
        `;
        userListElement.appendChild(userElement);
    });
}

async function handleUserActions(e) {
    const userId = e.target.dataset.id;
    const action = e.target.dataset.action;

    if (!userId || !action) return;

    if (action === 'delete-user') {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            await deleteUser(userId);
        }
    } else if (action === 'change-role') {
        const currentRole = e.target.parentElement.previousElementSibling.textContent.includes('admin') ? 'editor' : 'admin';
        await updateUserRole(userId, currentRole);
    }
}

async function updateUserRole(userId, newRole) {
    try {
        const response = await fetch(`${API_URL_BASE}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });
        if (response.ok) {
            alert('Papel do usuário atualizado com sucesso!');
            fetchUsers();
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao atualizar o papel do usuário.');
        }
    } catch (error) {
        console.error('Erro ao atualizar papel do usuário:', error);
        alert('Erro de conexão.');
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`${API_URL_BASE}/api/users/${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            fetchUsers();
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao excluir o usuário.');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro de conexão.');
    }
}
