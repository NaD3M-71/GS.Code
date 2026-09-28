SET NAMES utf8mb4;

INSERT INTO tecnologias (nombre) VALUES
  ('Next.js'), ('React'), ('TypeScript'), ('Node.js'), ('Express'),
  ('PHP'), ('Laravel'), ('.NET'), ('MySQL'), ('PostgreSQL'),
  ('SQL Server'), ('MongoDB'), ('Tailwind CSS'), ('Docker');

INSERT INTO proyectos (slug, titulo, resumen, descripcion, url, github, tipo, destacado, publicado, orden)
VALUES (
  'gs-code-portfolio',
  'GS.Code Portfolio',
  'Mi portfolio profesional con panel de administración propio.',
  'Sitio personal desarrollado con Next.js y TypeScript. Incluye panel de administración para cargar proyectos e imágenes, formulario de contacto y despliegue con Docker en VPS.',
  NULL,
  'https://github.com/NaD3M-71',
  'propio', TRUE, TRUE, 1
);

INSERT INTO proyecto_tecnologias (proyecto_id, tecnologia_id)
SELECT p.id, t.id
FROM proyectos p
JOIN tecnologias t ON t.nombre IN ('Next.js', 'TypeScript', 'MySQL', 'Tailwind CSS', 'Docker')
WHERE p.slug = 'gs-code-portfolio';
