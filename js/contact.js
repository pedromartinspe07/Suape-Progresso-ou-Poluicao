// js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede recarregar a página

        formStatus.textContent = 'Enviando sua mensagem...';
        formStatus.style.color = '#333';

        emailjs.sendForm("service_zvyko2o", "template_l1f5ycj", this)
            .then(() => {
                formStatus.textContent = '✅ Mensagem enviada com sucesso!';
                formStatus.style.color = 'green';
                contactForm.reset();
            }, (error) => {
                formStatus.textContent = '❌ Ocorreu um erro: ' + JSON.stringify(error);
                formStatus.style.color = 'red';
            });
    });
});
