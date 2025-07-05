document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o recarregamento da página

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const btn = e.target.querySelector('button[type="submit"]');
  const lembrar = document.getElementById("lembrar").checked;
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  // Estado inicial: limpa erros visuais
  emailInput.classList.remove('is-invalid');
  senhaInput.classList.remove('is-invalid');

  if (!email || !senha) {
    mostrarToast("Por favor, preencha o e-mail e a senha.", 'comentario');
    if (!email) emailInput.classList.add('is-invalid');
    if (!senha) senhaInput.classList.add('is-invalid');
    return;
  }

  // Loading visual
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Entrando...';
  emailInput.disabled = true;
  senhaInput.disabled = true;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Se a resposta não for 2xx, lança um erro com a mensagem do servidor
      throw new Error(data.message || 'Erro ao fazer login.');
    }

    mostrarToast("Login realizado com sucesso!", 'gol');

    // Salva o token conforme o checkbox
    if (lembrar) {
      // Salva em cookie por 30 dias
      document.cookie = `sensacionalismo_fc_token=${data.token}; path=/; max-age=${60*60*24*30}`;
      localStorage.setItem("sensacionalismo_fc_token", data.token); // Mantém também no localStorage para facilitar uso
    } else {
      // Salva no localStorage (sessão)
      localStorage.setItem("sensacionalismo_fc_token", data.token);
      // Remove o cookie se existir
      document.cookie = 'sensacionalismo_fc_token=; path=/; max-age=0';
    }

    // Salva o time_id do usuário logado
    if (data.user && data.user.time_id) {
      localStorage.setItem('sensacionalismo_fc_time_id', data.user.time_id);
    }

    // Atualiza o avatar do header imediatamente
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
      const fotoUrl = (data.user && data.user.foto_url && data.user.foto_url !== 'null') ? data.user.foto_url : '/img/avatar-default.svg';
      userAvatar.src = fotoUrl;
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 1200);

  } catch (error) {
    btn.disabled = false;
    btn.innerHTML = 'Entrar no gramado ⚽';
    emailInput.disabled = false;
    senhaInput.disabled = false;
    // Feedback visual de erro
    emailInput.classList.add('is-invalid');
    senhaInput.classList.add('is-invalid');
    mostrarToast(`Erro ao fazer login: ${error.message}`, 'comentario');
  }
});