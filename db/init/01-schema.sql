SET NAMES utf8mb4;

CREATE TABLE proyectos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(120) NOT NULL UNIQUE,
  titulo       VARCHAR(150) NOT NULL,
  resumen      VARCHAR(280) NOT NULL,
  descripcion  TEXT NOT NULL,
  url          VARCHAR(255) NULL,
  github       VARCHAR(255) NULL,
  tipo         ENUM('propio', 'cliente') NOT NULL DEFAULT 'propio',
  destacado    BOOLEAN NOT NULL DEFAULT FALSE,
  publicado    BOOLEAN NOT NULL DEFAULT FALSE,
  orden        INT NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE proyecto_imagenes (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proyecto_id  INT UNSIGNED NOT NULL,
  numero       TINYINT UNSIGNED NOT NULL,
  archivo      VARCHAR(160) NOT NULL,
  alt          VARCHAR(200) NULL,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_imagen_proyecto_numero UNIQUE (proyecto_id, numero),
  CONSTRAINT chk_imagen_numero CHECK (numero BETWEEN 1 AND 5),
  CONSTRAINT fk_imagen_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tecnologias (
  id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE proyecto_tecnologias (
  proyecto_id    INT UNSIGNED NOT NULL,
  tecnologia_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (proyecto_id, tecnologia_id),
  CONSTRAINT fk_pt_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_tecnologia FOREIGN KEY (tecnologia_id)
    REFERENCES tecnologias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mensajes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  email       VARCHAR(180) NOT NULL,
  mensaje     TEXT NOT NULL,
  leido       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
