-- ================================================================
-- ESQUEMA SQL PARA SUPABASE - PLATAFORMA DE VOLUNTARIADO JUVENIL
-- ================================================================

-- Habilitar extensión UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- TABLA: organizaciones
-- Descripción: Organizaciones que crean proyectos de voluntariado
-- ================================================================
CREATE TABLE IF NOT EXISTS organizaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    logo VARCHAR(500),
    sitio_web VARCHAR(500),
    correo VARCHAR(200),
    telefono VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para organizaciones
CREATE INDEX idx_organizaciones_nombre ON organizaciones(nombre);

-- ================================================================
-- TABLA: proyectos
-- Descripción: Proyectos de voluntariado creados por organizaciones
-- ================================================================
CREATE TABLE IF NOT EXISTS proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('social', 'educativo', 'ambiental')),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    cupo_maximo INTEGER NOT NULL CHECK (cupo_maximo > 0),
    id_organizacion VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'completado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: fecha_fin debe ser posterior a fecha_inicio
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio)
);

-- Índices para proyectos
CREATE INDEX idx_proyectos_categoria ON proyectos(categoria);
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_proyectos_fecha_inicio ON proyectos(fecha_inicio);
CREATE INDEX idx_proyectos_id_organizacion ON proyectos(id_organizacion);

-- ================================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a organizaciones
CREATE TRIGGER update_organizaciones_updated_at
    BEFORE UPDATE ON organizaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a proyectos
CREATE TRIGGER update_proyectos_updated_at
    BEFORE UPDATE ON proyectos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- ROW LEVEL SECURITY (RLS) - OPCIONAL
-- Descomenta si necesitas seguridad a nivel de fila
-- ================================================================

-- Habilitar RLS en proyectos
-- ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública de proyectos activos
-- CREATE POLICY "Proyectos activos son visibles públicamente"
--     ON proyectos FOR SELECT
--     USING (estado = 'activo');

-- Política: Solo usuarios autenticados pueden crear proyectos
-- CREATE POLICY "Usuarios autenticados pueden crear proyectos"
--     ON proyectos FOR INSERT
--     WITH CHECK (auth.role() = 'authenticated');

-- ================================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ================================================================

-- Insertar organizaciones de ejemplo
INSERT INTO organizaciones (nombre, descripcion, correo) VALUES
    ('Eco Warriors', 'Organización dedicada a la conservación ambiental', 'info@ecowarriors.org'),
    ('Educación para Todos', 'Promovemos la educación inclusiva', 'contacto@educacionparatodos.org'),
    ('Juntos Podemos', 'Ayuda social comunitaria', 'juntos@podemos.org')
ON CONFLICT DO NOTHING;

-- Insertar proyectos de ejemplo
INSERT INTO proyectos (nombre, descripcion, categoria, fecha_inicio, fecha_fin, cupo_maximo, id_organizacion) VALUES
    (
        'Urban Beekeeping Project',
        'A community initiative to establish urban beehives and promote biodiversity in the city.',
        'ambiental',
        '2024-09-01',
        '2025-03-31',
        50,
        'ORG-12345'
    ),
    (
        'Eco Warriors Initiative',
        'Proyecto de limpieza de playas y concientización ambiental',
        'ambiental',
        '2024-08-15',
        '2025-02-15',
        100,
        'ORG-54321'
    ),
    (
        'Biblioteca Comunitaria',
        'Creación de espacios de lectura para niños en zonas vulnerables',
        'educativo',
        '2024-10-01',
        '2025-06-30',
        30,
        'ORG-98765'
    ),
    (
        'Comedores Solidarios',
        'Preparación y distribución de alimentos para personas en situación de calle',
        'social',
        '2024-07-01',
        '2025-12-31',
        75,
        'ORG-11111'
    )
ON CONFLICT DO NOTHING;

-- ================================================================
-- VISTAS ÚTILES (OPCIONAL)
-- ================================================================

-- Vista: Proyectos activos con información resumida
CREATE OR REPLACE VIEW vista_proyectos_activos AS
SELECT 
    id,
    nombre,
    categoria,
    fecha_inicio,
    fecha_fin,
    cupo_maximo,
    EXTRACT(DAY FROM (fecha_fin - fecha_inicio)) AS duracion_dias,
    CASE 
        WHEN fecha_fin < CURRENT_DATE THEN 'finalizado'
        WHEN fecha_inicio > CURRENT_DATE THEN 'próximo'
        ELSE 'en_curso'
    END AS estado_temporal
FROM proyectos
WHERE estado = 'activo'
ORDER BY fecha_inicio DESC;

-- ================================================================
-- FUNCIONES ÚTILES (OPCIONAL)
-- ================================================================

-- Función: Contar proyectos por categoría
CREATE OR REPLACE FUNCTION contar_proyectos_por_categoria()
RETURNS TABLE(categoria VARCHAR, total BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.categoria,
        COUNT(*) as total
    FROM proyectos p
    WHERE p.estado = 'activo'
    GROUP BY p.categoria
    ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ================================================================

COMMENT ON TABLE proyectos IS 'Tabla principal que almacena todos los proyectos de voluntariado';
COMMENT ON COLUMN proyectos.categoria IS 'Categoría del proyecto: social, educativo o ambiental';
COMMENT ON COLUMN proyectos.estado IS 'Estado actual del proyecto: activo, inactivo o completado';
COMMENT ON COLUMN proyectos.cupo_maximo IS 'Número máximo de voluntarios que pueden participar';

-- ================================================================
-- PERMISOS (PARA API REST DE SUPABASE)
-- ================================================================

-- Estos permisos son necesarios para que la API REST de Supabase funcione
-- Ajusta según tus necesidades de seguridad

-- Permisos para la tabla proyectos (anónimos y autenticados)
GRANT SELECT, INSERT, UPDATE, DELETE ON proyectos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON proyectos TO authenticated;

-- Permisos para la tabla organizaciones
GRANT SELECT ON organizaciones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON organizaciones TO authenticated;

-- ================================================================
-- INSTRUCCIONES DE USO
-- ================================================================

/*
1. Copia todo este contenido
2. Ve a tu proyecto en Supabase (https://app.supabase.com)
3. Navega a SQL Editor
4. Pega este código
5. Click en "Run" o presiona Ctrl+Enter
6. Verifica que las tablas se crearon correctamente en "Table Editor"

NOTA: Si ya tienes datos en producción, revisa cuidadosamente
antes de ejecutar comandos DROP o INSERT.
*/

-- ================================================================
-- FIN DEL ESQUEMA
-- ================================================================
