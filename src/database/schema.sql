-- Tabela para os times
CREATE TABLE IF NOT EXISTS times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    logo_url TEXT
);

-- Tabela para os usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_nascimento TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    time_id INTEGER,
    foto_url TEXT,
    FOREIGN KEY (time_id) REFERENCES times(id)
);

-- Tabela para as notícias
CREATE TABLE IF NOT EXISTS noticias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    imagem_url TEXT,
    time_id INTEGER,
    FOREIGN KEY (time_id) REFERENCES times(id)
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    noticia_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    texto TEXT NOT NULL,
    data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (noticia_id) REFERENCES noticias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de curtidas
CREATE TABLE IF NOT EXISTS curtidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    noticia_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    data_curtida DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(noticia_id, usuario_id),
    FOREIGN KEY (noticia_id) REFERENCES noticias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserindo alguns times como exemplo inicial
INSERT OR IGNORE INTO times (nome) VALUES ('Corinthians'), ('Palmeiras'), ('São Paulo'), ('Santos'), ('Flamengo'), ('Vasco da Gama');

-- Limpa notícias existentes para evitar duplicatas
DELETE FROM noticias;

-- Inserindo algumas notícias de exemplo (sempre limpa primeiro)
INSERT INTO noticias (titulo, conteudo, imagem_url, time_id) VALUES
('Freguesia instaurada', 'Mais uma vez o timão atropela os Enzos da barra funda', 'img/comemoracao.png', 1),
('Mais um pênalti pro Varmeiras!', 'Rafael Veiga espirra dentro da grande área, cai no chão e um pênalti é marcado a favor do Palmeiras.', 'img/juiz.png', 2),
('Surpreendente', 'Nigéria bate a seleção da França por 3 a 0 com três gols contras de Mbappe', 'img/selecoes.png', NULL),
('Desfalque para o Bayern', 'Harry Kane já coleciona mais lesões do que títulos', 'img/falta.png', NULL),
('Tricolor soberano!', 'São Paulo vence o rival alviverde com show de Calleri no Morumbi.', 'img/falta.png', 3);