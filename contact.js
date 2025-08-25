// js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Validação básica do lado do cliente
        if (!name || !email || !subject || !message) {
            formStatus.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            formStatus.style.color = 'red';
            return;
        }

        formStatus.textContent = 'Enviando sua mensagem...';
        formStatus.style.color = '#333';

        try {
            // Este é um exemplo de como o formulário enviaria dados.
            // Para um site estático, a forma mais fácil é usar serviços como Formspree ou EmailJS.
            // A linha abaixo é apenas uma simulação para mostrar o efeito.
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simula o tempo de envio

            formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
            formStatus.style.color = '#28a745';
            contactForm.reset(); // Limpa o formulário
        } catch (error) {
            formStatus.textContent = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.';
            formStatus.style.color = 'red';
        }
    });
});
