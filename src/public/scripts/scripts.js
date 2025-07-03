// Variável para controlar se as notícias já foram carregadas
let noticiasCarregadas = false;

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path === '/' || path === '/inicio.html') {
        // Removido o bloqueio de login para acesso à página inicial
        const token = localStorage.getItem('sensacionalismo_fc_token');
        if (!noticiasCarregadas) {
            carregarNoticias(token); // Se não houver token, o backend pode retornar notícias públicas
            configurarLogout();
            noticiasCarregadas = true;
        }
    }

    else if (path === '/register') {
        carregarTimes();
        configurarFormularioCadastro();
    }
});

// --- FUNÇÕES GLOBAIS ---

// Variável para controlar se já está carregando notícias
let carregandoNoticias = false;

async function carregarNoticias(token) {
    // Previne execuções simultâneas
    if (carregandoNoticias) {
        return;
    }

    carregandoNoticias = true;
    
    try {
        const response = await fetch('/api/news', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('sensacionalismo_fc_token');
            alert("Sua sessão expirou. Por favor, faça o login novamente.");
            window.location.replace('/login');
            return;
        }

        if (!response.ok) throw new Error('Não foi possível carregar as notícias.');

        const noticias = await response.json();
        const carouselInner = document.querySelector('#carouselNoticias .carousel-inner');
        const carouselIndicators = document.querySelector('#carouselNoticias .carousel-indicators');

        if (carouselInner && carouselIndicators) {
            // Limpa o conteúdo anterior completamente
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            
            // Força uma atualização do DOM
            await new Promise(resolve => setTimeout(resolve, 10));

            // Verifica se há notícias
            if (noticias.length === 0) {
                carouselInner.innerHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height: 400px;"><h3>Nenhuma notícia encontrada</h3></div></div>';
                return;
            }

            // Adiciona cada notícia
            noticias.forEach((noticia, index) => {
                const isActive = index === 0 ? 'active' : '';
                // Cria o indicador
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#carouselNoticias');
                indicator.setAttribute('data-bs-slide-to', index.toString());
                indicator.className = isActive;
                indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                carouselIndicators.appendChild(indicator);
                // Cria o item do carrossel
                const item = document.createElement('div');
                item.className = `carousel-item ${isActive}`;
                item.innerHTML = `
                    <img src="${noticia.imagem_url}" class="d-block w-100" alt="${noticia.titulo}" style="height: 400px; object-fit: cover;">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${noticia.titulo}</h5>
                        <p>${noticia.conteudo}</p>
                        <div class="noticia-acoes">
                          <button class="btn-curtir" title="Curtir"><i class="fas fa-thumbs-up"></i> Curtir <span class="curtidas-count">0</span></button>
                          <button class="btn-comentar" title="Comentar"><i class="fas fa-comment"></i> Comentar</button>
                        </div>
                        <div class="comentarios-container" data-comentarios-noticia="${noticia.id}"></div>
                    </div>
                `;
                // Eventos de curtir/comentar
                const btnCurtir = item.querySelector('.btn-curtir');
                btnCurtir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleCurtir(noticia.id, btnCurtir);
                });
                renderizarCurtidas(noticia.id, btnCurtir);
                item.querySelector('.btn-comentar').addEventListener('click', (e) => {
                    e.stopPropagation();
                    abrirModalComentario(noticia.id);
                });
                carouselInner.appendChild(item);
                // Renderiza comentários
                renderizarComentarios(noticia.id);
            });
        }

        const noticiasTimeContainer = document.getElementById('noticiasTimeContainer');
        if (noticiasTimeContainer) {
            noticiasTimeContainer.innerHTML = '';
            // Filtra notícias do time do usuário (as primeiras do array)
            const timeIdUsuario = noticias.length > 0 ? noticias[0].time_id : null;
            const noticiasTime = noticias.filter(n => n.time_id === timeIdUsuario);
            if (noticiasTime.length > 0) {
                noticiasTime.forEach(noticia => {
                    const card = document.createElement('div');
                    card.className = 'noticia-time-card';
                    card.innerHTML = `
                        <img src="${noticia.imagem_url}" alt="${noticia.titulo}">
                        <h4>${noticia.titulo}</h4>
                        <p>${noticia.conteudo}</p>
                        <div class="noticia-acoes">
                          <button class="btn-curtir" title="Curtir"><i class="fas fa-thumbs-up"></i> Curtir <span class="curtidas-count">0</span></button>
                          <button class="btn-comentar" title="Comentar"><i class="fas fa-comment"></i> Comentar</button>
                        </div>
                        <div class="comentarios-container" data-comentarios-noticia="${noticia.id}"></div>
                    `;
                    // Eventos de curtir/comentar
                    const btnCurtir = card.querySelector('.btn-curtir');
                    btnCurtir.addEventListener('click', () => {
                        toggleCurtir(noticia.id, btnCurtir);
                    });
                    renderizarCurtidas(noticia.id, btnCurtir);
                    card.querySelector('.btn-comentar').addEventListener('click', () => {
                        abrirModalComentario(noticia.id);
                    });
                    noticiasTimeContainer.appendChild(card);
                    // Renderiza comentários
                    renderizarComentarios(noticia.id);
                });
            } else {
                noticiasTimeContainer.innerHTML = '<p style="text-align:center;">Nenhuma notícia do seu time encontrada.</p>';
            }
        }

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        const carouselInner = document.querySelector('#carouselNoticias .carousel-inner');
        if (carouselInner) {
            carouselInner.innerHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height: 400px;"><h3>Erro ao carregar notícias</h3></div></div>';
        }
    } finally {
        carregandoNoticias = false;
    }
}

function configurarLogout() {
    const logoutButton = document.getElementById('btnLogout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('sensacionalismo_fc_token');
            alert("Você saiu da sua conta.");
            window.location.replace('/login');
        });
    }
}

async function carregarTimes() {
    try {
        const response = await fetch('/api/auth/teams');
        if (!response.ok) throw new Error('Não foi possível carregar os times.');
        
        const times = await response.json();
        const selectTime = document.getElementById('time');
        if (!selectTime) return;

        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time.id;
            option.textContent = time.nome;
            selectTime.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

function isCpfValido(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    const validarDigito = (base, peso) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) soma += parseInt(base.charAt(i)) * peso--;
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };
    const base = cpf.slice(0, 9);
    const digito1 = validarDigito(base, 10);
    const digito2 = validarDigito(base + digito1, 11);
    return parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2;
}

function configurarFormularioCadastro() {
    const formCadastro = document.querySelector('form[aria-describedby="descricao-cadastro"]');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();

            const form = event.target;
            const cpfInput = document.getElementById("CPF");
            const submitButton = form.querySelector('button[type="submit"]');

            if (!isCpfValido(cpfInput.value)) {
                alert("CPF inválido.");
                return;
            }

            const data = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                data_nascimento: document.getElementById('data-nascimento').value,
                cpf: cpfInput.value,
                time_id: document.getElementById('time').value
            };

            submitButton.disabled = true;
            submitButton.textContent = 'Cadastrando...';

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                alert("Cadastro realizado com sucesso! Agora você pode fazer o login.");
                form.reset();
                window.location.href = '/login';

            } catch (error) {
                console.error("Falha no cadastro:", error);
                alert(`❌ Falha no cadastro: ${error.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Cadastrar';
            }
        });
    }
}

// Função para exibir notificações toast
function mostrarToast(mensagem, tipo = 'gol') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    let icone = '⚽';
    if (tipo === 'curtida') icone = '👍';
    if (tipo === 'comentario') icone = '💬';
    toast.innerHTML = `<span class="toast-icon">${icone}</span> ${mensagem}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => container.removeChild(toast), 400);
    }, 3500);
}

// Modal de comentário
let comentarioNoticiaId = null;
function abrirModalComentario(noticiaId) {
    comentarioNoticiaId = noticiaId;
    const modal = new bootstrap.Modal(document.getElementById('modalComentario'));
    document.getElementById('comentarioTexto').value = '';
    modal.show();
}

// Evento de envio do comentário
const btnEnviarComentario = document.getElementById('btnEnviarComentario');
if (btnEnviarComentario) {
    btnEnviarComentario.addEventListener('click', async () => {
        const texto = document.getElementById('comentarioTexto').value.trim();
        if (!texto) {
            mostrarToast('Digite um comentário antes de enviar.', 'comentario');
            return;
        }
        const token = localStorage.getItem('sensacionalismo_fc_token');
        if (!token || !comentarioNoticiaId) {
            mostrarToast('Erro ao enviar comentário.', 'comentario');
            return;
        }
        try {
            const response = await fetch(`/api/news/${comentarioNoticiaId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto })
            });
            if (!response.ok) throw new Error('Erro ao enviar comentário');
            mostrarToast('Comentário enviado!', 'comentario');
            // Atualiza comentários da notícia correta
            renderizarComentarios(comentarioNoticiaId);
        } catch (e) {
            mostrarToast('Erro ao enviar comentário.', 'comentario');
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalComentario'));
        if (modal) modal.hide();
    });
}

// Função para buscar e renderizar comentários de uma notícia
async function renderizarComentarios(noticiaId) {
    const token = localStorage.getItem('sensacionalismo_fc_token');
    if (!token) return;
    try {
        const response = await fetch(`/api/news/${noticiaId}/comentarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        const comentarios = await response.json();
        // Atualiza todos os containers de comentários dessa notícia (carrossel e notícias do time)
        const containers = document.querySelectorAll(`[data-comentarios-noticia="${noticiaId}"]`);
        containers.forEach(container => {
            if (comentarios.length === 0) {
                container.innerHTML = '<p class="comentario-vazio">Nenhum comentário ainda.</p>';
            } else {
                container.innerHTML = comentarios.map(c => `
                    <div class="comentario-item">
                        <span class="comentario-autor">${c.usuario_nome}</span>
                        <span class="comentario-data">${new Date(c.data_comentario).toLocaleString('pt-BR')}</span>
                        <p class="comentario-texto">${c.texto}</p>
                    </div>
                `).join('');
            }
        });
    } catch (e) {
        // Silencia erro
    }
}

// Função para buscar e exibir curtidas
async function renderizarCurtidas(noticiaId, btn) {
    const token = localStorage.getItem('sensacionalismo_fc_token');
    if (!token) return;
    try {
        const response = await fetch(`/api/news/${noticiaId}/curtidas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erro ao buscar curtidas');
        const { total } = await response.json();
        btn.querySelector('.curtidas-count').textContent = total;
    } catch (e) {
        btn.querySelector('.curtidas-count').textContent = '0';
    }
}

// Função para curtir/descurtir
async function toggleCurtir(noticiaId, btn) {
    const token = localStorage.getItem('sensacionalismo_fc_token');
    if (!token) return;
    try {
        const response = await fetch(`/api/news/${noticiaId}/curtidas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erro ao curtir');
        renderizarCurtidas(noticiaId, btn);
        mostrarToast('Ação registrada!', 'curtida');
    } catch (e) {
        mostrarToast('Erro ao curtir.', 'curtida');
    }
}

// Perfil: abrir modal ao clicar no avatar
const btnProfile = document.getElementById('btnProfile');
// Carregar dados do perfil ao abrir o modal
if (btnProfile) {
    btnProfile.addEventListener('click', async () => {
        const token = localStorage.getItem('sensacionalismo_fc_token');
        if (!token) return;
        try {
            const res = await fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.status === 401) {
                // Token inválido ou expirado
                localStorage.removeItem('sensacionalismo_fc_token');
                alert('Sua sessão expirou. Faça login novamente.');
                window.location.href = '/login';
                return;
            }
            if (!res.ok) throw new Error('Erro ao buscar perfil');
            const user = await res.json();
            document.getElementById('perfilNome').value = user.nome || '';
            document.getElementById('perfilEmail').value = user.email || '';
            // Carregar times no select
            const selectTime = document.getElementById('perfilTime');
            if (selectTime) {
                const timesRes = await fetch('/api/auth/teams');
                const times = await timesRes.json();
                selectTime.innerHTML = '';
                times.forEach(time => {
                    const opt = document.createElement('option');
                    opt.value = time.id;
                    opt.textContent = time.nome;
                    if (user.time_id == time.id) opt.selected = true;
                    selectTime.appendChild(opt);
                });
            }
            // Avatar
            const fotoUrl = (user.foto_url && user.foto_url !== 'null') ? user.foto_url : '/img/avatar-default.svg';
            document.getElementById('perfilAvatarPreview').src = fotoUrl;
            document.getElementById('userAvatar').src = fotoUrl;
        } catch (e) {
            // Em caso de erro, limpa campos e mostra avatar padrão
            document.getElementById('perfilNome').value = '';
            document.getElementById('perfilEmail').value = '';
            document.getElementById('perfilAvatarPreview').src = '/img/avatar-default.svg';
            document.getElementById('userAvatar').src = '/img/avatar-default.svg';
            mostrarToast('Erro ao carregar perfil.', 'comentario');
        }
        const modal = new bootstrap.Modal(document.getElementById('modalPerfil'));
        modal.show();
    });
}

// Salvar alterações do perfil
const formPerfil = document.getElementById('formPerfil');
if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('sensacionalismo_fc_token');
        if (!token) return;
        const nome = document.getElementById('perfilNome').value;
        const time_id = document.getElementById('perfilTime').value;
        let foto_url = document.getElementById('perfilAvatarPreview').src;
        // Se for o avatar padrão, salva como null
        if (foto_url.includes('avatar-default.svg')) foto_url = null;
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ nome, time_id, foto_url })
            });
            if (!res.ok) throw new Error('Erro ao atualizar perfil');
            mostrarToast('Perfil atualizado!', 'gol');
            // Atualiza avatar do header
            document.getElementById('userAvatar').src = foto_url || '/img/avatar-default.svg';
            // Fecha modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalPerfil'));
            if (modal) modal.hide();
        } catch (e) {
            mostrarToast('Erro ao atualizar perfil.', 'comentario');
        }
    });
}

// Cropper.js integração e feedback visual
let cropper = null;
const cropperModalOverlay = document.getElementById('cropperModalOverlay');
const cropperModal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const btnCropConfirm = document.getElementById('btnCropConfirm');
const btnCropCancel = document.getElementById('btnCropCancel');
const avatarLoadingOverlay = document.getElementById('avatarLoadingOverlay');

// Trocar avatar (upload real)
const btnTrocarAvatar = document.getElementById('btnTrocarAvatar');
const inputAvatar = document.getElementById('inputAvatar');
const perfilAvatarPreview = document.getElementById('perfilAvatarPreview');
if (btnTrocarAvatar && inputAvatar && perfilAvatarPreview) {
    btnTrocarAvatar.addEventListener('click', () => inputAvatar.click());
    inputAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                cropperImage.src = ev.target.result;
                cropperModalOverlay.style.display = 'flex';
                if (cropper) cropper.destroy();
                cropper = new Cropper(cropperImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    background: false,
                    autoCropArea: 1,
                    movable: true,
                    zoomable: true,
                    rotatable: false,
                    scalable: false,
                    cropBoxResizable: true,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100
                });
            };
            reader.readAsDataURL(file);
        }
    });
}
if (btnCropCancel) {
    btnCropCancel.addEventListener('click', () => {
        cropperModalOverlay.style.display = 'none';
        if (cropper) cropper.destroy();
    });
}
if (btnCropConfirm) {
    btnCropConfirm.addEventListener('click', async () => {
        if (!cropper) return;
        avatarLoadingOverlay.style.display = 'flex';
        cropper.getCroppedCanvas({ width: 256, height: 256, imageSmoothingQuality: 'high' }).toBlob(async (blob) => {
            const token = localStorage.getItem('sensacionalismo_fc_token');
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.png');
            try {
                const res = await fetch('/api/upload/avatar', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (!res.ok) throw new Error('Erro ao enviar avatar');
                const data = await res.json();
                perfilAvatarPreview.src = data.url;
                cropperModalOverlay.style.display = 'none';
                if (cropper) cropper.destroy();
            } catch (err) {
                mostrarToast('Erro ao enviar foto de perfil.', 'comentario');
            } finally {
                avatarLoadingOverlay.style.display = 'none';
            }
        }, 'image/png', 0.95);
    });
}

// Exemplo: simular notificação de gol ao entrar na página
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        mostrarToast('Gol do Corinthians! Yuri Alberto marca aos 37 do 2ºT', 'gol');
    }, 2000);
});

// Ao carregar a página, garantir que o avatar do header sempre comece com o SVG padrão
const userAvatar = document.getElementById('userAvatar');
if (userAvatar) userAvatar.src = '/img/avatar-default.svg';