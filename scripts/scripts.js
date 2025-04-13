function validarCPF(event) {
    event.preventDefault();
    const cpf = document.getElementById("CPF").value.replace(/[^\d]/g, "");
  
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      alert("CPF inválido.");
      return false;
    }
  
    const validarDigito = (base, peso) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base.charAt(i)) * peso--;
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };
  
    const base = cpf.slice(0, 9);
    const digito1 = validarDigito(base, 10);
    const digito2 = validarDigito(base + digito1, 11);
  
    if (parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2) {
      alert("Cadastro realizado com sucesso!");
      return true;
    } else {
      alert("CPF inválido.");
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
      });
      
      // Fechar o menu quando um item for clicado (opcional)
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navbarToggler.setAttribute('aria-expanded', 'false');
          navbarCollapse.classList.remove('show');
        });
      });
    }
  });
  