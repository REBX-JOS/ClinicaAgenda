<?php
// Lee tus agendados actuales de la BD y los devuelve en JSON
header('Content-Type: application/json; charset=utf-8');
$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['error' => 'ID requerido']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM appointments WHERE id = ?');
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
    exit;
}


// JOIN con users y services para mostrar nombres
$stmt = $pdo->query(
  'SELECT a.id, u.fullname AS cliente, s.name AS servicio, a.price, a.scheduled_at AS horario, a.status 
  FROM appointments a
  JOIN users u ON a.user_id = u.id
  JOIN services s ON a.service_id = s.id
  ORDER BY a.scheduled_at DESC
  LIMIT 50'
);

$datos = $stmt->fetchAll();
echo json_encode(['data' => $datos], JSON_UNESCAPED_UNICODE);