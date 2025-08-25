// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Animação de Scroll (Fade-in) usando IntersectionObserver
    const sections = document.querySelectorAll('.content-section, .chart-container, .intro-section, .challenge-section');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 2. Destacar o link da página atual na navegação
    const navLinks = document.querySelectorAll('header nav .nav-menu li a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active-link');
        }
    });

    // 3. Efeito de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Funcionalidade do Botão de Voltar ao Topo
    // Assume que o botão está no HTML com a classe 'back-to-top'
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Funcionalidade do Menu Hambúrguer
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // 6. Remover eventos de mouse do botão CTA (movido para CSS)
    // O seu arquivo styles.css já tem a regra .cta-button:hover,
    // então a lógica JS abaixo não é necessária e pode ser removida.
    // const ctaButton = document.querySelector('.cta-button');
    // if (ctaButton) {
    //     ctaButton.addEventListener('mouseover', ...);
    //     ctaButton.addEventListener('mouseout', ...);
    // }

});
