<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

$user_id = $_SESSION['user_id'] ?? null;
$role_id = $_SESSION['role_id'] ?? 1; // 1: paciente

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    if (!$id) {
        echo json_encode(['error' => 'ID requerido']);
        exit;
    }
    // Solo puede borrar admins o el dueño
    $stmt = $role_id >= 2
        ? $pdo->prepare('DELETE FROM appointments WHERE id = ?')
        : $pdo->prepare('DELETE FROM appointments WHERE id = ? AND user_id = ?');
    $ok = $role_id >= 2
        ? $stmt->execute([$id])
        : $stmt->execute([$id, $user_id]);
    echo json_encode(['success' => $ok]);
    exit;
}

// JOIN con users y services para mostrar nombres y FILTRO
if ($role_id >= 2) {
  $sql = 'SELECT a.id, u.fullname AS cliente, s.name AS servicio, a.price, a.scheduled_at AS horario, a.status
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN services s ON a.service_id = s.id
    ORDER BY a.scheduled_at DESC
    LIMIT 50';
  $stmt = $pdo->query($sql);
} else {
  $stmt = $pdo->prepare(
      'SELECT a.id, u.fullname AS cliente, s.name AS servicio, a.price, a.scheduled_at AS horario, a.status
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.scheduled_at DESC
      LIMIT 50'
  );
  $stmt->execute([$user_id]);
}
$datos = $stmt->fetchAll();
echo json_encode(['data' => $datos], JSON_UNESCAPED_UNICODE);