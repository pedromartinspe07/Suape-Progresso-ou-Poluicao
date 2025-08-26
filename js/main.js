// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializar AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // 2. Efeito de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Funcionalidade do Botão de Voltar ao Topo
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Funcionalidade de Modo Escuro (Dark Mode)
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Aplica o tema salvo no localStorage
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    // 5. Efeitos de Parallax Suaves (para seções com a classe 'parallax-bg')
    /*
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            bg.style.transform = `translateY(${scrollPosition * 0.2}px)`; // Ajuste o valor 0.2 para controlar a velocidade
        });
    });
    */
    
});

// 6. Filtros de Publicações
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter publications
            publicationItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// 7. Filtros do Blog
document.addEventListener('DOMContentLoaded', function() {
    const blogFilterButtons = document.querySelectorAll('.blog-filters .filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    blogFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            blogFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter blog posts
            blogPosts.forEach(post => {
                const category = post.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
});

// CSS animation for fade in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);