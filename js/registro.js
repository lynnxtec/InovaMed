document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de registro iniciado');
    
    const form = document.getElementById('form-registro');

    //criando os elementos para cadastrar no formulário
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmar_senha');
    const tipoPaciente = document.getElementById('tipoPaciente');
    const tipoMedico = document.getElementById('tipoMedico');
    const crm = document.getElementById('crm');
    const campoCRM = document.getElementById('campoCRM');

    //mensagem de erro pra quando o usuario burro colocar algo errado aparecer bonitinho a mensagem na tela
    function criarMensagemErro(campo, texto) {
        //remove mensagem existente
        const msgExistente = campo.parentNode.querySelector('.msg-erro');
        if (msgExistente) msgExistente.remove();
        
        //criador de nova mensagens
        const msg = document.createElement('div');
        msg.className = 'msg-erro';
        msg.textContent = texto;
        msg.style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            padding: 5px 0;
        `;
        
        campo.parentNode.appendChild(msg);
        campo.style.borderColor = '#dc3545';
        campo.style.borderWidth = '2px';
    }
    
    function removerMensagemErro(campo) {
        const msgExistente = campo.parentNode.querySelector('.msg-erro');
        if (msgExistente) msgExistente.remove();
        campo.style.borderColor = '';
        campo.style.borderWidth = '';
    }
    
    function mostrarSucesso(campo) {
        campo.style.borderColor = '#28a745';
        campo.style.borderWidth = '2px';
    }
    
    // FUNÇÃO DE MENSAGEM GERAL (ESTAVA FALTANDO!)
    function mostrarMensagemGeral(texto, tipo) {
        // Remove mensagem existente
        const msgExistente = document.querySelector('.msg-geral');
        if (msgExistente) msgExistente.remove();
        
        // Cria nova mensagem
        const msg = document.createElement('div');
        msg.className = 'msg-geral';
        msg.textContent = texto;
        msg.style.cssText = `
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            ${tipo === 'erro' 
                ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' 
                : 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'}
        `;
        
        form.insertBefore(msg, form.firstChild);
        
        // Remove após 3 segundos se for sucesso
        if (tipo === 'sucesso') {
            setTimeout(() => msg.remove(), 3000);
        }
    }

    //validador de senhas 
    confirmarSenha.addEventListener('input', function() {
        if (senha.value !== confirmarSenha.value) {
            criarMensagemErro(confirmarSenha, 'As senhas não coincidem');
            criarMensagemErro(senha, 'As senhas não coincidem');
        } else if (confirmarSenha.value) {
            removerMensagemErro(confirmarSenha);
            removerMensagemErro(senha);
            mostrarSucesso(confirmarSenha);
            mostrarSucesso(senha);
        }
    });
    
    senha.addEventListener('input', function() {
        if (confirmarSenha.value && senha.value !== confirmarSenha.value) {
            criarMensagemErro(confirmarSenha, 'As senhas não coincidem');
            criarMensagemErro(senha, 'As senhas não coincidem');
        } else if (confirmarSenha.value && senha.value === confirmarSenha.value) {
            removerMensagemErro(confirmarSenha);
            removerMensagemErro(senha);
            mostrarSucesso(confirmarSenha);
            mostrarSucesso(senha);
        }
    });

    //login do médico vai verificar se existe né
    if (tipoMedico && tipoPaciente && campoCRM) {
        tipoMedico.addEventListener('change', function() {
            campoCRM.style.display = 'block';
        });
        
        tipoPaciente.addEventListener('change', function() {
            campoCRM.style.display = 'none';
        });
    }
    
    // ==============================================
    // VERIFICAÇÃO NO SUBMIT
    // ==============================================
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Limpar mensagens anteriores
        document.querySelectorAll('.msg-erro').forEach(msg => msg.remove());
        
        let temErro = false;
        
        // 1. Validar nome
        if (!nome.value.trim()) {
            criarMensagemErro(nome, 'Digite seu nome completo');
            temErro = true;
        } else if (nome.value.trim().length < 3) {
            criarMensagemErro(nome, 'Nome deve ter pelo menos 3 caracteres');
            temErro = true;
        }
        
        // 2. Validar email
        if (!email.value.trim()) {
            criarMensagemErro(email, 'Digite seu e-mail');
            temErro = true;
        } else if (!validarEmail(email.value.trim())) {
            criarMensagemErro(email, 'Digite um e-mail válido (ex: nome@email.com)');
            temErro = true;
        }
        
        // 3. Validar senha
        if (!senha.value) {
            criarMensagemErro(senha, 'Digite uma senha');
            temErro = true;
        } else if (senha.value.length < 4) {
            criarMensagemErro(senha, 'A senha deve ter pelo menos 4 caracteres');
            temErro = true;
        }
        
        // 4. Validar confirmação de senha
        if (!confirmarSenha.value) {
            criarMensagemErro(confirmarSenha, 'Confirme sua senha');
            temErro = true;
        } else if (senha.value !== confirmarSenha.value) {
            criarMensagemErro(confirmarSenha, 'As senhas não coincidem');
            criarMensagemErro(senha, 'As senhas não coincidem');
            temErro = true;
        }
        
        // 5. Validar CRM para médicos
        const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;
        if (tipoSelecionado === 'medico') {
            if (!crm.value.trim()) {
                criarMensagemErro(crm, 'CRM é obrigatório para médicos');
                temErro = true;
            } else if (crm.value.trim().length < 4) {
                criarMensagemErro(crm, 'CRM inválido');
                temErro = true;
            }
        }
        
        // 6. Verificar se email já existe (AQUI É ONDE SEU ERRO ESTAVA)
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Mostrar no console para depuração
        console.log('📋 Usuários cadastrados:', usuarios);
        console.log('📧 Email digitado:', email.value.trim());
        console.log('🔍 Email já existe?', usuarios.some(u => u.email === email.value.trim()));
        
        if (usuarios.some(u => u.email === email.value.trim())) {
            criarMensagemErro(email, 'Este e-mail já está cadastrado');
            temErro = true;
        }
        
        // Se tem erro, mostra mensagem geral e para
        if (temErro) {
            mostrarMensagemGeral('Corrija os erros acima antes de continuar', 'erro');
            
            // Scroll para o primeiro erro
            const primeiroErro = document.querySelector('.msg-erro');
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // ==============================================
        // SE CHEGOU AQUI, TUDO ESTÁ VÁLIDO
        // ==============================================
        
        // Criar usuário
        const novoUsuario = {
            id: usuarios.length + 1,
            nome: nome.value.trim(),
            email: email.value.trim(),
            senha: btoa(senha.value),
            tipo: tipoSelecionado,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };
        
        if (tipoSelecionado === 'medico') {
            novoUsuario.crm = crm.value.trim();
        }
        
        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        console.log('✅ Usuário cadastrado:', novoUsuario);
        console.log('📦 Total de usuários:', usuarios.length);
        
        // Mostrar mensagem de sucesso
        mostrarMensagemGeral('✅ Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
    
    // ==============================================
    // FUNÇÃO AUXILIAR
    // ==============================================
    
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});