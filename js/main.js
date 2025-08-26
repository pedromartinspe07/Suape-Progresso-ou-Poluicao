// Ativa o Dark Mode no carregamento da página com base na preferência do usuário
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('darkModeToggle').checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        document.getElementById('darkModeToggle').checked = false;
    }
}

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme === 'dark');
} else {
    applyTheme(userPrefersDark);
}

document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
});

// ====================================================================
// Código para animações (AOS) e rolagem suave
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a biblioteca AOS
    AOS.init({
        duration: 1000,
        once: true,
    });
    
    // Adiciona evento de clique para rolagem suave para links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ====================================================================
    // Código para buscar e renderizar posts do blog (NOVO)
    // ====================================================================

    // URL da sua API do backend
    const API_URL = 'https://suape-progresso-ou-poluicao-backend-production.up.railway.app/api/posts';
    
    // Filtro de posts
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                document.querySelectorAll('.blog-post').forEach(post => {
                    const postCategory = post.dataset.category;
                    if (filter === 'all' || postCategory === filter) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Se a página for o blog.html, faça a requisição para a API
    // Usei document.querySelector para verificar se os elementos do blog existem
    const blogPageContent = document.querySelector('.blog-grid');
    if (blogPageContent) {
        fetchPosts();
    }
});

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error("Falha ao buscar posts:", error);
        // Opcional: mostrar uma mensagem de erro na interface
        const blogContainer = document.querySelector('.blog-grid');
        if (blogContainer) {
            blogContainer.innerHTML = '<p class="text-danger">Não foi possível carregar os posts. Tente novamente mais tarde.</p>';
        }
    }
}

function renderPosts(posts) {
    const featuredPostContainer = document.querySelector('.blog-post.featured');
    const blogGridContainer = document.querySelector('.blog-grid');
    
    // Limpa os posts existentes
    if (featuredPostContainer) {
        featuredPostContainer.innerHTML = '';
        featuredPostContainer.style.display = 'none'; // Oculta o container até que um post seja adicionado
    }
    if (blogGridContainer) {
        blogGridContainer.innerHTML = '';
    }

    if (!posts || posts.length === 0) {
        if (blogGridContainer) {
            blogGridContainer.innerHTML = '<p>Nenhum post encontrado.</p>';
        }
        return;
    }

    // Renderiza o primeiro post como destaque
    const featuredPost = posts[0];
    if (featuredPostContainer) {
        featuredPostContainer.innerHTML = createPostHTML(featuredPost);
        featuredPostContainer.dataset.category = featuredPost.category;
        featuredPostContainer.style.display = 'block';
    }

    // Renderiza os posts restantes na grade
    const recentPosts = posts.slice(1);
    if (blogGridContainer) {
        recentPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.dataset.category = post.category;
            postElement.innerHTML = createPostHTML(post);
            blogGridContainer.appendChild(postElement);
        });
    }

    // Atualiza a animação AOS após a renderização dos posts
    AOS.refresh();
}

function createPostHTML(post) {
    const tagsHtml = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
        <div class="post-header">
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
                <span class="post-category">${post.category}</span>
                <span class="post-read-time"><i class="fas fa-clock"></i> 5 min de leitura</span>
            </div>
            <h3>${post.title}</h3>
        </div>
        <div class="post-content">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${tagsHtml}
            </div>
            <a href="javascript:void(0)" class="read-more-btn">Ler mais <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
}