document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o recarregamento da página

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const lembrar = document.getElementById("lembrar").checked;
  const form = e.target;

  if (!email || !senha) {
    alert("Por favor, preencha o e-mail e a senha.");
    return;
  }

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

    // Login bem-sucedido!
    alert("Login realizado com sucesso!");

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

    // Atualiza o avatar do header imediatamente
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
      const fotoUrl = (data.user && data.user.foto_url && data.user.foto_url !== 'null') ? data.user.foto_url : '/img/avatar-default.svg';
      userAvatar.src = fotoUrl;
    }

    // Redireciona para a página inicial
    window.location.href = "/"; // O servidor vai nos levar para a 'inicio.html'

  } catch (error) {
    console.error("Falha no login:", error);
    alert(`❌ Falha no login: ${error.message}`);
  }
});