<?php
header('Content-Type: application/json; charset=utf-8');
// Conexión DB
$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['register'])) {
    // Registro de usuario
    $fullname = trim($data['fullname'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    if (!$fullname || !$email || !$password) {
        echo json_encode(['success'=>false, 'error'=>'Completa todos los campos.']); exit;
    }
    // Validar no duplicados
    $q = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $q->execute([$email]);
    if ($q->fetch()) {
        echo json_encode(['success'=>false,'error'=>'El correo ya está registrado.']); exit;
    }
    // Guardar user
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (fullname, email, password_hash, role_id, is_active, created_at, updated_at) VALUES (?,?,?,?,1,NOW(),NOW())");
    $ok = $stmt->execute([$fullname, $email, $hash, 1]);
    echo json_encode(['success'=>$ok]); exit;
}

if (isset($data['recover'])) {
    // Recuperación simple (solo para MVP, NO seguro; cambiar por email si fuera real)
    $fullname = trim($data['fullname'] ?? '');
    $email = trim($data['email'] ?? '');
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE fullname=? AND email=? LIMIT 1");
    $stmt->execute([$fullname, $email]);
    $row = $stmt->fetch();
    if (!$row) { echo json_encode(['success'=>false, 'error'=>'Datos incorrectos.']); exit; }
    // DEMO: retorna password plano si corresponde a un demo hash
    if (strpos($row['password_hash'],'demohash') !== false) {
        echo json_encode(['success'=>true,'password'=>'demopass']); exit;
    }
    // Si no, no hay forma de recuperar hash, solo para el MVP usuario test
    echo json_encode(['success'=>false,'error'=>'No se puede recuperar por seguridad (usar email real en producción).']); exit;
}

if (isset($data['email']) && isset($data['password'])) {
    // Login
    $email = trim($data['email']);
    $password = trim($data['password']);
    $stmt = $pdo->prepare("SELECT id, fullname, email, password_hash FROM users WHERE email=? AND is_active=1 LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) { echo json_encode(['success'=>false,'error'=>'Usuario/contraseña no válidos.']); exit; }
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(['success'=>false,'error'=>'Usuario/contraseña no válidos.']); exit;
    }
    // Inicia sesión (solo marca éxito para el MVP)
    echo json_encode(['success'=>true,'user'=>['id'=>$user['id'],'fullname'=>$user['fullname'],'email'=>$user['email']]]); exit;
}

echo json_encode(['success'=>false,'error'=>'Solicitud inválida.']);