        // Verifica se usuário está logado
        const usuario = verificarSessao();
        
        if (!usuario) {
            // Não está logado - redireciona
            window.location.href = 'login.html';
        } else {
            // Mostra informações do usuário
            document.getElementById('info-usuario').innerHTML = `
                <p>Você está logado como:</p>
                <ul>
                    <li><strong>Nome:</strong> ${usuario.nome}</li>
                    <li><strong>Email:</strong> ${usuario.email}</li>
                    <li><strong>Tipo:</strong> ${usuario.tipo || 'Usuário'}</li>
                    <li><strong>Login realizado em:</strong> ${new Date(usuario.loginTime).toLocaleString()}</li>
                </ul>
            `;
        }