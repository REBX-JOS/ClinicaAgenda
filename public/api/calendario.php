<?php
header('Content-Type: application/json; charset=utf-8');
$hora = $_GET['hora'] ?? '';
$dia = $_GET['dia'] ?? '';
// Calcula fecha real si es por días de la semana y día actual
// Consulta cita en base de datos
$stmt = $pdo->prepare('SELECT c.id, u.fullname AS cliente, s.name AS servicio, c.scheduled_at AS hora, c.description
  FROM appointments c
  JOIN users u ON c.user_id = u.id
  JOIN services s ON c.service_id = s.id
  WHERE TIME(c.scheduled_at) = ? AND DAYOFWEEK(c.scheduled_at) = ?');
$stmt->execute([$hora, $dia]);
$data = $stmt->fetch();
echo json_encode($data ?: []);