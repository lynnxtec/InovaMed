document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de registro iniciado');
    
    const form = document.getElementById('form-registro');
    
    // ==============================================
    // ELEMENTOS DO FORMULÁRIO
    // ==============================================
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmar_senha');
    const tipoPaciente = document.getElementById('tipoPaciente');
    const tipoMedico = document.getElementById('tipoMedico');
    const crm = document.getElementById('crm');
    const campoCRM = document.getElementById('campoCRM');
    
    // ==============================================
    // MOSTRAR/ESCONDER CRM
    // ==============================================
    if (tipoMedico && tipoPaciente && campoCRM) {
        tipoMedico.addEventListener('change', function() {
            campoCRM.style.display = 'block';
        });
        
        tipoPaciente.addEventListener('change', function() {
            campoCRM.style.display = 'none';
        });
    }
    
    // ==============================================
    // VALIDAÇÃO 1: ENQUANTO DIGITA (feedback visual)
    // ==============================================
    confirmarSenha.addEventListener('input', function() {
        if (senha.value !== confirmarSenha.value) {
            confirmarSenha.style.borderColor = 'red';
            senha.style.borderColor = 'red';
        } else {
            confirmarSenha.style.borderColor = 'green';
            senha.style.borderColor = 'green';
        }
    });
    
    senha.addEventListener('input', function() {
        if (confirmarSenha.value && senha.value !== confirmarSenha.value) {
            confirmarSenha.style.borderColor = 'red';
            senha.style.borderColor = 'red';
        } else if (confirmarSenha.value && senha.value === confirmarSenha.value) {
            confirmarSenha.style.borderColor = 'green';
            senha.style.borderColor = 'green';
        }
    });
    
    // ==============================================
    // VALIDAÇÃO 2: ANTES DE ENVIAR (MÚLTIPLAS VERIFICAÇÕES)
    // ==============================================
    
    // VERIFICAÇÃO NO CLIQUE DO BOTÃO
    const botao = form.querySelector('button[type="submit"]');
    botao.addEventListener('click', function(event) {
        console.log('🔍 Verificando senhas antes de enviar...');
        
        if (senha.value !== confirmarSenha.value) {
            event.preventDefault();
            alert('As senhas são diferentes! Digite a mesma senha nos dois campos.');
            senha.style.borderColor = 'red';
            confirmarSenha.style.borderColor = 'red';
            senha.focus();
            return false;
        }
    });
    
    // VERIFICAÇÃO PRINCIPAL NO SUBMIT
    form.addEventListener('submit', function(event) {
        console.log('📝 Processando formulário...');
        
        // IMPEDIR COMPORTAMENTO PADRÃO
        event.preventDefault();
        
        // ==============================================
        // VALIDAÇÕES
        // ==============================================
        
        // 1. Campos obrigatórios
        if (!nome.value.trim()) {
            alert('❌ Digite seu nome!');
            nome.focus();
            return;
        }
        
        if (!email.value.trim()) {
            alert('❌ Digite seu e-mail!');
            email.focus();
            return;
        }
        
        // 2. Validação de email
        if (!validarEmail(email.value.trim())) {
            alert('❌ Digite um e-mail válido!');
            email.focus();
            return;
        }
        
        // 3. Validação de senha (MAIS IMPORTANTE)
        if (!senha.value) {
            alert('❌ Digite uma senha!');
            senha.focus();
            return;
        }
        
        if (!confirmarSenha.value) {
            alert('❌ Confirme sua senha!');
            confirmarSenha.focus();
            return;
        }
        
        // VERIFICAÇÃO CRÍTICA - SENHAS DIFERENTES
        if (senha.value !== confirmarSenha.value) {
            alert('❌ AS SENHAS NÃO COINCIDEM! Digite a mesma senha nos dois campos.');
            senha.style.borderColor = 'red';
            confirmarSenha.style.borderColor = 'red';
            senha.value = ''; // Limpa os campos
            confirmarSenha.value = '';
            senha.focus();
            return; // IMPEDE O CADASTRO
        }
        
        // 4. Tamanho da senha
        if (senha.value.length < 4) {
            alert('❌ A senha deve ter pelo menos 4 caracteres!');
            senha.focus();
            return;
        }
        
        // 5. Validação do tipo médico
        const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;
        
        if (tipoSelecionado === 'medico') {
            if (!crm.value.trim()) {
                alert('❌ CRM é obrigatório para médicos!');
                crm.focus();
                return;
            }
        }
        
        // 6. Verificar se email já existe
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (usuarios.some(u => u.email === email.value.trim())) {
            alert('❌ Este e-mail já está cadastrado!');
            email.focus();
            return;
        }
        
        // ==============================================
        // SE CHEGOU AQUI, TUDO ESTÁ VÁLIDO
        // ==============================================
        console.log('✅ Todas as validações passaram!');
        
        // CRIAR USUÁRIO
        const novoUsuario = {
            id: usuarios.length + 1,
            nome: nome.value.trim(),
            email: email.value.trim(),
            senha: btoa(senha.value), // Codifica a senha
            tipo: tipoSelecionado,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };
        
        // Adicionar CRM se for médico
        if (tipoSelecionado === 'medico') {
            novoUsuario.crm = crm.value.trim();
        }
        
        // Salvar no localStorage
        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        console.log('✅ Usuário cadastrado:', novoUsuario);
        
        // Mensagem de sucesso
        alert('✅ Cadastro realizado com sucesso! Faça o login.');
        
        // Redirecionar para login
        window.location.href = 'login.html';
    });
    
    // Função auxiliar para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});