-- Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'patient', 'Paciente o usuario general'),
(2, 'staff', 'Personal o staff'),
(3, 'admin', 'Administrador');

-- Users
INSERT INTO users (id, username, fullname, email, password_hash, phone, address, birth_date, avatar_path, role_id, is_active, created_at, updated_at) VALUES
(1, 'jdoe', 'Juan Perez', 'jperez@email.com', '$2y$10$demohash', '3311223344', 'Calle Uno 123', '1990-01-01', NULL, 1, 1, NOW(), NOW()),
(2, 'mlopez', 'Maria Lopez', 'mlopez@email.com', '$2y$10$demohash', '3322334455', 'Calle Dos 234', '1985-02-10', NULL, 1, 1, NOW(), NOW()),
(3, 'cvaldez', 'Carlos Valdez', 'cvaldez@email.com', '$2y$10$demohash', '3333445566', 'Privada Tres 56', '1992-03-15', NULL, 1, 1, NOW(), NOW()),
(4, 'pcastro', 'Patricia Castro', 'pcastro@email.com', '$2y$10$demohash', '3344556677', 'Av. Cuatro 77', '1988-04-20', NULL, 1, 1, NOW(), NOW()),
(5, 'lsantos', 'Luis Santos', 'lsantos@email.com', '$2y$10$demohash', '3355667788', 'Esquina Cinco 102', '1993-05-25', NULL, 1, 1, NOW(), NOW()),
(6, 'rgarcia', 'Rosa Garcia', 'rgarcia@email.com', '$2y$10$demohash', '3366778899', 'Col. Seis 200', '1979-06-30', NULL, 1, 1, NOW(), NOW()),
(7, 'amartinez', 'Ana Martinez', 'amartinez@email.com', '$2y$10$demohash', '3377889900', 'Cerrada Siete 21', '1994-07-07', NULL, 1, 1, NOW(), NOW()),
(8, 'hrodriguez', 'Hugo Rodriguez', 'hrodriguez@email.com', '$2y$10$demohash', '3388990011', 'Bosques Ocho 123', '1991-08-22', NULL, 1, 1, NOW(), NOW()),
(9, 'emendoza', 'Elena Mendoza', 'emendoza@email.com', '$2y$10$demohash', '3399001122', 'Puerta Nueve 45', '1987-09-09', NULL, 1, 1, NOW(), NOW()),
(10, 'javila', 'Javier Avila', 'javila@email.com', '$2y$10$demohash', '3300112233', 'Fracc Diez 56', '1995-10-12', NULL, 1, 1, NOW(), NOW()),
(11, 'psuarez', 'Paula Suarez', 'psuarez@email.com', '$2y$10$demohash', '3310234056', 'Calle Once 98', '1986-11-14', NULL, 1, 1, NOW(), NOW()),
(12, 'dhernandez', 'David Hernandez', 'dhernandez@email.com', '$2y$10$demohash', '3320340567', 'Paseo Doce 20', '1978-12-05', NULL, 1, 1, NOW(), NOW()),
(13, 'lfernandez', 'Lorena Fernandez', 'lfernandez@email.com', '$2y$10$demohash', '3330450678', 'Av Trece 123', '1996-01-19', NULL, 1, 1, NOW(), NOW()),
(14, 'mbarrera', 'Miguel Barrera', 'mbarrera@email.com', '$2y$10$demohash', '3340560789', 'Unidad Catorce 5', '1997-02-21', NULL, 1, 1, NOW(), NOW()),
(15, 'smorales', 'Sofia Morales', 'smorales@email.com', '$2y$10$demohash', '3350670890', 'Privada Quince 88', '1984-03-13', NULL, 1, 1, NOW(), NOW());

-- Services
INSERT INTO services (id, name, slug, description, duration_minutes, price, thumbnail_path, active, created_at, updated_at) VALUES
(1, 'Toma de sangre', 'toma-de-sangre', 'Extraccion y analisis basico de sangre', 30, 15.00, NULL, 1, NOW(), NOW()),
(2, 'Ecografia abdominal', 'ecografia-abdominal', 'Ecografia para diagnostico abdominal', 45, 45.00, NULL, 1, NOW(), NOW()),
(3, 'Consulta medica general', 'consulta-general', 'Consulta con medico general', 30, 25.00, NULL, 1, NOW(), NOW()),
(4, 'Control pediatrico', 'control-pediatrico', 'Revision y control de nino o nina', 30, 20.00, NULL, 1, NOW(), NOW()),
(5, 'Vacunacion', 'vacunacion', 'Administracion de vacunas segun calendario', 15, 10.00, NULL, 1, NOW(), NOW()),
(6, 'Electrocardiograma', 'ecg', 'Registro de actividad cardiaca', 20, 30.00, NULL, 1, NOW(), NOW()),
(7, 'Fisioterapia sesion', 'fisioterapia', 'Sesion de fisioterapia personalizada', 60, 35.00, NULL, 1, NOW(), NOW()),
(8, 'Radiografia', 'radiografia', 'Radiografia simple', 20, 40.00, NULL, 1, NOW(), NOW()),
(9, 'Consulta especialista', 'consulta-especialista', 'Consulta con especialista ej cardiologia', 40, 60.00, NULL, 1, NOW(), NOW()),
(10, 'Prueba rapida COVID', 'prueba-covid', 'Test rapido de antigenos', 15, 12.00, NULL, 1, NOW(), NOW()),
(11, 'Dermatologia consulta', 'dermatologia', 'Consulta con dermatologo', 30, 50.00, NULL, 1, NOW(), NOW()),
(12, 'Psicologia sesion', 'psicologia', 'Terapia psicologica breve', 50, 45.00, NULL, 1, NOW(), NOW()),
(13, 'Peso y talla', 'peso-talla', 'Medicion antropometrica y consejos', 15, 8.00, NULL, 1, NOW(), NOW()),
(14, 'Analitica completa', 'analitica-completa', 'Panel completo de laboratorio', 60, 80.00, NULL, 1, NOW(), NOW()),
(15, 'Nutricion consulta', 'nutricion', 'Consulta con nutricionista', 40, 35.00, NULL, 1, NOW(), NOW());

-- Appointments
INSERT INTO appointments (id, user_id, service_id, scheduled_at, duration_minutes, price, status, notes, created_by, canceled_at, canceled_by, created_at, updated_at) VALUES
(1, 1, 1, '2025-12-08 09:00:00', 30, 15.00, 'scheduled', 'Paciente puntual.', NULL, NULL, NULL, NOW(), NOW()),
(2, 2, 2, '2025-12-08 10:00:00', 45, 45.00, 'scheduled', 'Ecografia abdominal.', NULL, NULL, NULL, NOW(), NOW()),
(3, 3, 3, '2025-12-09 09:30:00', 30, 25.00, 'scheduled', 'Consulta por malestar general.', NULL, NULL, NULL, NOW(), NOW()),
(4, 4, 4, '2025-12-09 11:00:00', 30, 20.00, 'scheduled', 'Control pediatrico.', NULL, NULL, NULL, NOW(), NOW()),
(5, 5, 5, '2025-12-10 08:30:00', 15, 10.00, 'scheduled', 'Vacunacion programada.', NULL, NULL, NULL, NOW(), NOW()),
(6, 6, 6, '2025-12-10 10:00:00', 20, 30.00, 'canceled', 'ECG por seguimiento.', NULL, '2025-12-07 14:00:00', 8, NOW(), NOW()),
(7, 7, 7, '2025-12-11 09:00:00', 60, 35.00, 'scheduled', 'Sesion de fisioterapia 1.', NULL, NULL, NULL, NOW(), NOW()),
(8, 8, 8, '2025-12-11 12:00:00', 20, 40.00, 'scheduled', 'Radiografia toracica.', NULL, NULL, NULL, NOW(), NOW()),
(9, 9, 9, '2025-12-12 09:45:00', 40, 60.00, 'scheduled', 'Consulta especialista.', NULL, NULL, NULL, NOW(), NOW()),
(10, 10, 10, '2025-12-12 11:30:00', 15, 12.00, 'scheduled', 'Prueba rapida COVID.', NULL, NULL, NULL, NOW(), NOW()),
(11, 11, 11, '2025-12-13 09:00:00', 30, 50.00, 'scheduled', 'Consulta dermatologia.', NULL, NULL, NULL, NOW(), NOW()),
(12, 12, 12, '2025-12-13 10:30:00', 50, 45.00, 'scheduled', 'Sesion de psicologia.', NULL, NULL, NULL, NOW(), NOW()),
(13, 13, 13, '2025-12-14 08:45:00', 15, 8.00, 'scheduled', 'Medicion peso y talla.', NULL, NULL, NULL, NOW(), NOW()),
(14, 14, 14, '2025-12-14 10:15:00', 60, 80.00, 'scheduled', 'Analitica completa.', NULL, NULL, NULL, NOW(), NOW()),
(15, 15, 15, '2025-12-15 09:00:00', 40, 35.00, 'scheduled', 'Consulta de nutricion.', NULL, NULL, NULL, NOW(), NOW());

-- Entries (notas/reseñas)
INSERT INTO entries (id, appointment_id, service_id, user_id, title, content, rating, created_at, updated_at) VALUES
(1, 1, 1, 1, 'Primera visita', 'Atencion rapida y amable.', 5, NOW(), NOW()),
(2, 2, 2, 2, 'Ultrasonido', 'Servicio profesional.', 5, NOW(), NOW()),
(3, 3, 3, 3, 'Malestar', 'Doctor atento.', 4, NOW(), NOW()),
(4, 4, 4, 4, 'Control nino', 'Muy buen trato.', 5, NOW(), NOW()),
(5, 5, 5, 5, 'Vacunacion ninio', 'Sin dolor, rapido.', 5, NOW(), NOW()),
(6, 7, 7, 7, 'Fisioterapia', 'Muy recomendable.', 5, NOW(), NOW()),
(7, 8, 8, 8, 'Rayos X', 'Rapido el resultado.', 4, NOW(), NOW()),
(8, 9, 9, 9, 'Cardiologia', 'Explicacion clara.', 5, NOW(), NOW()),
(9, 10, 10, 10, 'Covid test', 'Atencion excelente.', 5, NOW(), NOW()),
(10, 11, 11, 11, 'Consulta dermato', 'Diagnostico preciso.', 5, NOW(), NOW()),
(11, 12, 12, 12, 'Terapia emociones', 'Muy satisfactorio.', 4, NOW(), NOW()),
(12, 13, 13, 13, 'Rutina peso', 'Buenos consejos.', 5, NOW(), NOW()),
(13, 14, 14, 14, 'Analisis lab', 'Resultado a tiempo.', 5, NOW(), NOW()),
(14, 15, 15, 15, 'Nutricion', 'Buen seguimiento.', 5, NOW(), NOW()),
(15, 3, 3, 1, 'Repetir consulta', 'Volveria sin dudar.', 4, NOW(), NOW());

-- Payments
INSERT INTO payments (id, appointment_id, amount, method, status, transaction_ref, paid_at, created_at) VALUES
(1, 1, 15.00, 'efectivo', 'paid', 'TX001', '2025-12-07 12:00:00', NOW()),
(2, 2, 45.00, 'tarjeta', 'paid', 'TX002', '2025-12-07 12:30:00', NOW()),
(3, 3, 25.00, 'transferencia', 'paid', 'TX003', '2025-12-07 12:45:00', NOW()),
(4, 4, 20.00, 'efectivo', 'paid', 'TX004', '2025-12-07 13:00:00', NOW()),
(5, 5, 10.00, 'tarjeta', 'paid', 'TX005', '2025-12-07 13:15:00', NOW()),
(6, 7, 35.00, 'efectivo', 'paid', 'TX006', '2025-12-07 13:30:00', NOW()),
(7, 8, 40.00, 'tarjeta', 'paid', 'TX007', '2025-12-07 14:00:00', NOW()),
(8, 9, 60.00, 'efectivo', 'paid', 'TX008', '2025-12-07 14:30:00', NOW()),
(9, 10, 12.00, 'tarjeta', 'paid', 'TX009', '2025-12-07 14:45:00', NOW()),
(10, 11, 50.00, 'efectivo', 'paid', 'TX010', '2025-12-07 15:00:00', NOW()),
(11, 12, 45.00, 'transferencia', 'paid', 'TX011', '2025-12-07 15:10:00', NOW()),
(12, 13, 8.00, 'efectivo', 'paid', 'TX012', '2025-12-07 15:20:00', NOW()),
(13, 14, 80.00, 'tarjeta', 'paid', 'TX013', '2025-12-07 15:30:00', NOW()),
(14, 15, 35.00, 'transferencia', 'paid', 'TX014', '2025-12-07 15:40:00', NOW()),
(15, 6, 30.00, 'transferencia', 'refunded', 'TX015', '2025-12-07 16:00:00', NOW());