document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-recuperar');
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('button[type="submit"]');
    
    // Função para mostrar mensagem
    function showMessage(message, type) {
        // Remove mensagem existente se houver
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insere após o formulário
        form.insertAdjacentElement('afterend', messageDiv);
        
        // Remove após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Função para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!email) {
            return 'Por favor, digite seu email ou ID profissional';
        }
        if (!emailRegex.test(email)) {
            return 'Por favor, digite um email válido';
        }
        return null;
    }
    
    // Função para mostrar loading
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar link de recuperação';
        }
    }
    
    // Evento de submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar email
        const emailError = validateEmail(emailInput.value);
        if (emailError) {
            showMessage(emailError, 'error');
            emailInput.classList.add('error');
            return;
        }
        
        emailInput.classList.remove('error');
        
        // Simular envio
        setLoading(true);
        
        try {
            // Simulação de requisição ao servidor
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Sucesso
            showMessage('Link de recuperação enviado para o seu email!', 'success');
            form.reset();
        } catch (error) {
            // Erro
            showMessage('Erro ao enviar. Tente novamente mais tarde.', 'error');
        } finally {
            setLoading(false);
        }
    });
    
    // Remover erro ao digitar
    emailInput.addEventListener('input', function() {
        emailInput.classList.remove('error');
    });
});