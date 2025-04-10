document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
  
    if (email === "teste@teste" && senha === "teste") {
      alert("Login bem-sucedido! Bem-vindo ao Sensacionalismo FC 🎉");
      window.location.href = "inicio.html"; // redireciona para a home (altere se quiser)
    } else {
      alert("❌ E-mail ou senha incorretos. Tente novamente.");
    }
  });
  