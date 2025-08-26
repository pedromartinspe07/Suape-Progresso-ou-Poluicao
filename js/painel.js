// URL da sua API no Railway
const API_URL_BASE = 'https://suape-progresso-ou-poluicao-backend-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    const addPostForm = document.getElementById('add-post-form');
    
    if (addPostForm) {
        addPostForm.addEventListener('submit', handleAddPost);
    }
});

async function handleAddPost(e) {
    e.preventDefault();
    const form = e.target;
    const messageElement = document.getElementById('add-post-message');
    const formData = new FormData(form);
    
    // Converte os dados do formulário para um objeto JSON
    const postData = {
        title: formData.get('title'),
        date: formData.get('date'),
        category: formData.get('category'),
        excerpt: formData.get('excerpt'),
        image: formData.get('image'),
        tags: formData.get('tags').split(',').map(tag => tag.trim())
    };

    try {
        const response = await fetch(`${API_URL_BASE}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        const data = await response.json();

        if (response.status === 201) {
            messageElement.textContent = 'Post publicado com sucesso!';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            form.reset(); // Limpa o formulário
        } else if (response.status === 401) {
            messageElement.textContent = 'Sessão expirada. Faça login novamente.';
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            setTimeout(() => { window.location.href = '/login.html'; }, 2000);
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