<?php
header('Content-Type: application/json; charset=utf-8');

$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

// ========================
// GET: Lista servicios
// ========================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && (!isset($_GET['action']))) {
    try {
        $stmt = $pdo->prepare("SELECT id, name, slug, description, price, thumbnail_path FROM services WHERE active = 1 ORDER BY name ASC");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['data'=>$data]);
    } catch (Exception $e) {
        echo json_encode(['data'=>[], 'error'=>$e->getMessage()]);
    }
    exit;
}

// ========================
// GET: Fechas disponibles
// /api/agendar_cita.php?action=dates&service_id=1
// ========================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'dates') {
    $service_id = intval($_GET['service_id'] ?? 0);

    // Demo: los próximos 7 días, puedes ajustar según tu lógica
    $fechas = [];
    for ($i = 0; $i < 7; $i++) {
        $date = date('Y-m-d', strtotime("+$i day"));
        $label = strftime('%d %b %Y', strtotime($date));
        $fechas[] = [ 'label' => $label, 'value' => $date ];
    }
    echo json_encode(['data' => $fechas]);
    exit;
}

// ========================
// GET: Horarios disponibles para fecha/servicio
// /api/agendar_cita.php?action=hours&service_id=1&date=2025-12-10
// ========================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'hours') {
    $service_id = intval($_GET['service_id'] ?? 0);
    $date = $_GET['date'] ?? '';

    // Define rango de atención (ejemplo: 09:00-18:00 cada 30 min)
    $start = 9 * 60; // 9:00
    $end = 18 * 60;   // 18:00
    $interval = 30;   // minutos
    $horas = [];
    for ($m = $start; $m <= $end; $m += $interval) {
        $hh = str_pad(floor($m / 60), 2, '0', STR_PAD_LEFT);
        $mm = str_pad($m % 60, 2, '0', STR_PAD_LEFT);
        $time = "$hh:$mm";
        // Comprueba si ya está ocupada (consulta appointmens para ese servicio/fecha/hora)
        $dt = "$date $time:00";
        $ocupada = false;
        $q = $pdo->prepare(
            "SELECT 1 FROM appointments WHERE service_id=? AND scheduled_at=? LIMIT 1"
        );
        $q->execute([$service_id, $dt]);
        if ($q->fetch()) $ocupada = true;
        if (!$ocupada) $horas[] = $time;
    }
    echo json_encode(['data'=>$horas]);
    exit;
}

// ========================
// POST: Insertar cita (como ya estaba)
// ========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $service_id = isset($data['service_id']) ? intval($data['service_id']) : 0;
    $scheduled_at = isset($data['scheduled_at']) ? trim($data['scheduled_at']) : '';
    $notes = isset($data['notes']) ? trim($data['notes']) : '';
    if (!$service_id || !$scheduled_at) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
        exit;
    }
    $user_id = 1; // Demo: reemplazar por sesión real.
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO appointments (user_id, service_id, scheduled_at, notes)
            VALUES (?, ?, ?, ?)"
        );
        $res = $stmt->execute([$user_id, $service_id, $scheduled_at, $notes]);
        if ($res) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar la cita']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['error'=>'Método HTTP no soportado']);