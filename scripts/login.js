document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (email === "teste@teste" && senha === "teste") {
    // Armazena o login no localStorage
    localStorage.setItem("usuarioLogado", "true");

    // Redireciona para a página inicial
    window.location.href = "inicio.html";
  } else {
    alert("❌ E-mail ou senha incorretos. Tente novamente.");
  }
});
