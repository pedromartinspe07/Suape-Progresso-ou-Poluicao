// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializar AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // 2. Animação de Scroll (Fade-in) usando IntersectionObserver
    const sections = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Reduzido para 0.1 para que a animação comece mais cedo

    sections.forEach(section => {
        observer.observe(section);
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

    // 5. Funcionalidade de Modo Escuro (Dark Mode)
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

    // 6. Efeitos de Parallax Suaves (para seções com a classe 'parallax-bg')
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            bg.style.transform = `translateY(${scrollPosition * 0.2}px)`; // Ajuste o valor 0.2 para controlar a velocidade
        });
    });
    
});