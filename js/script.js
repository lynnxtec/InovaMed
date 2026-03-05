 const formCadastro = document.getElementById('formCadastro');
        const mensagem = document.getElementById('mensagem');

        //adiciona o add no forms
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            //valores dos campos 
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            
            // validar se os valores com o campo registrado
            if (senha !== confirmarSenha) {
                mostrarMensagem('As senhas não são iguais.', 'erro');
                return;
            }
            
            if (senha.length < 6) {
                mostrarMensagem('❌ A senha deve ter pelo menos 6 caracteres!', 'erro');
                return;
            }
            
            // PEGAR USUÁRIOS DO LOCALSTORAGE (OU CRIAR ARRAY VAZIO)
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            
            // VERIFICAR SE EMAIL JÁ EXISTE
            const emailExistente = usuarios.find(user => user.email === email);
            
            if (emailExistente) {
                mostrarMensagem('❌ Este e-mail já está cadastrado!', 'erro');
                return;
            }
            
            // CRIAR OBJETO USUÁRIO (JSON)
            const novoUsuario = {
                id: Date.now(), // ID ÚNICO
                nome: nome,
                email: email,
                senha: senha, // EM PRODUÇÃO, CRIE UMA CRIPTOGRAFIA
                dataCadastro: new Date().toLocaleDateString('pt-BR')
            };
            
            // ADICIONAR AO ARRAY DE USUÁRIOS
            usuarios.push(novoUsuario);
            
            // SALVAR NO LOCALSTORAGE (COMO JSON)
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            // MOSTRAR MENSAGEM DE SUCESSO
            mostrarMensagem('✅ Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
            
            // LIMPAR FORMULÁRIO
            formCadastro.reset();
            
            // REDIRECIONAR PARA LOGIN APÓS 2 SEGUNDOS
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
        
        // FUNÇÃO PARA MOSTRAR MENSAGENS
        function mostrarMensagem(texto, tipo) {
            mensagem.textContent = texto;
            mensagem.className = 'mensagem ' + tipo;
        }