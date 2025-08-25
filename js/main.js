// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Animação de Scroll (Fade-in)
    // Usando a IntersectionObserver API para detectar quando elementos entram na viewport
    const sections = document.querySelectorAll('.content-section, .chart-container, .intro-section, .challenge-section');
    
    const observerOptions = {
        root: null, // O viewport como a área de observação
        rootMargin: '0px',
        threshold: 0.2 // O callback é acionado quando 20% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para a animação rodar apenas uma vez
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 2. Destacar o link da página atual na navegação
    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        // Verifica se o href do link corresponde ao caminho atual da URL
        if (link.href.includes(currentPath)) {
            link.classList.add('active-link');
        }
    });

    // 3. Efeito de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 4. Efeito no botão de CTA na página inicial (usando classes CSS para transições)
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseover', () => {
            ctaButton.style.transform = 'translateY(-3px)';
            ctaButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
        });

        ctaButton.addEventListener('mouseout', () => {
            ctaButton.style.transform = 'translateY(0)';
            ctaButton.style.boxShadow = 'var(--shadow)';
        });
    }

    // 5. Botão de Voltar ao Topo
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '&#9650;'; // Ícone de seta para cima
    backToTopButton.classList.add('back-to-top');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
