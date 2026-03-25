alert('🚀 Sistema de login iniciado...');


document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
});

function inicializarSistema() {
    alert('Inicializando sistema...');
    
    // Cria usuário padrão se não existir
    if (!localStorage.getItem('usuarios')) {
        criarUsuarioPadrao();
    }
    
    // Configura o formulário de login
    configurarFormularioLogin();
}

//Sistema de criar o formulário para logar
function configurarFormularioLogin() {
    const form = document.getElementById('form-login');
    
    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        processarLogin();
    });
    
    console.log('Formulário configurado!');
}

//Sistema de login pae
function processarLogin() {
    // Pega os valores dos campos
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;
    
    console.log('📧 Tentativa de login:', email);
    
    // Validações básicas
    if (!email || !senha) {
        mostrarMensagem('❌ Preencha todos os campos!', 'erro');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarMensagem('❌ Digite um e-mail válido!', 'erro');
        return;
    }
    
    // Busca usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email);
    
    // Verifica login
    if (usuario && usuario.senha === btoa(senha)) {
        // Login com sucesso
        loginSucesso(usuario, lembrar);
    } else {
        mostrarMensagem('❌ E-mail ou senha incorretos!', 'erro');
    }
}

// ==============================================
// LOGIN BEM-SUCEDIDO
// ==============================================
function loginSucesso(usuario, lembrar) {
    console.log('✅ Login bem-sucedido para:', usuario.email);
    
    // Cria objeto de sessão
    const sessao = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        loginTime: new Date().toISOString()
    };
    
    // Salva sessão (localStorage = permanente, sessionStorage = temporário)
    if (lembrar) {
        localStorage.setItem('sessao', JSON.stringify(sessao));
        console.log('💾 Sessão salva em localStorage (permanente)');
    } else {
        sessionStorage.setItem('sessao', JSON.stringify(sessao));
        console.log('💾 Sessão salva em sessionStorage (temporária)');
    }
    
    mostrarMensagem('✅ Login realizado com sucesso! Redirecionando...', 'sucesso');
    
    // Redireciona após 2 segundos
    setTimeout(function() {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// ==============================================
// CRIAÇÃO DE USUÁRIO PADRÃO
// ==============================================
function criarUsuarioPadrao() {
    const usuarios = [
        {
            id: 1,
            nome: 'Administrador',
            email: 'admin@inovamed.com',
            senha: btoa('admin123'), // senha: admin123
            tipo: 'admin',
            dataCadastro: new Date().toISOString()
        },
        {
            id: 2,
            nome: 'Médico Teste',
            email: 'medico@inovamed.com',
            senha: btoa('medico123'), // senha: medico123
            tipo: 'medico',
            dataCadastro: new Date().toISOString()
        },
        {
            id: 3,
            nome: 'Paciente Teste',
            email: 'paciente@inovamed.com',
            senha: btoa('paciente123'), // senha: paciente123
            tipo: 'paciente',
            dataCadastro: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log('Usuários padrão criados:', usuarios.length);
}

// ==============================================
// FUNÇÕES AUXILIARES
// ==============================================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarMensagem(texto, tipo) {
    // Remove mensagem anterior
    const msgAnterior = document.querySelector('.mensagem-login');
    if (msgAnterior) msgAnterior.remove();
    
    // Cria nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-login';
    mensagem.textContent = texto;
    
    // Estilo
    mensagem.style.cssText = `
        padding: 12px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        ${tipo === 'erro' 
            ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' 
            : 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'}
    `;
    
    // Insere antes do formulário
    const form = document.getElementById('form-login');
    form.parentNode.insertBefore(mensagem, form);
    
    // Remove mensagem de sucesso após 3 segundos
    if (tipo === 'sucesso') {
        setTimeout(() => mensagem.remove(), 3000);
    }
}

// ==============================================
// FUNÇÕES GLOBAIS (para usar em outras páginas)
// ==============================================

// Verifica se usuário está logado
window.verificarSessao = function() {
    const sessao = JSON.parse(localStorage.getItem('sessao')) || 
                  JSON.parse(sessionStorage.getItem('sessao'));
    return sessao;
};

// Faz logout
window.fazerLogout = function() {
    localStorage.removeItem('sessao');
    sessionStorage.removeItem('sessao');
    window.location.href = 'login.html';
};

// Pega dados do usuário atual
window.getUsuarioAtual = function() {
    return window.verificarSessao();
};