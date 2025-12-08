<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['register'])) {
    $fullname = trim($data['fullname'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    if (!$fullname || !$email || !$password) {
        echo json_encode(['success'=>false, 'error'=>'Completa todos los campos.']); exit;
    }
    $q = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $q->execute([$email]);
    if ($q->fetch()) {
        echo json_encode(['success'=>false,'error'=>'El correo ya está registrado.']); exit;
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (fullname, email, password_hash, role_id, is_active, created_at, updated_at) VALUES (?,?,?,?,1,NOW(),NOW())");
    $ok = $stmt->execute([$fullname, $email, $hash, 1]);
    echo json_encode(['success'=>$ok]); exit;
}

if (isset($data['recover'])) {
    $fullname = trim($data['fullname'] ?? '');
    $email = trim($data['email'] ?? '');
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE fullname=? AND email=? LIMIT 1");
    $stmt->execute([$fullname, $email]);
    $row = $stmt->fetch();
    if (!$row) { echo json_encode(['success'=>false, 'error'=>'Datos incorrectos.']); exit; }
    if (strpos($row['password_hash'],'demohash') !== false) {
        echo json_encode(['success'=>true,'password'=>'demopass']); exit;
    }
    echo json_encode(['success'=>false,'error'=>'No se puede recuperar por seguridad']); exit;
}

if (isset($data['email']) && isset($data['password'])) {
    $email = trim($data['email']);
    $password = trim($data['password']);
    $stmt = $pdo->prepare("SELECT id, fullname, email, password_hash, role_id, username FROM users WHERE email=? AND is_active=1 LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success'=>false,'error'=>'Usuario/contraseña no válidos.']); exit;
    }
    // Guardar datos mínimos en SESSION (para PHP backend) y en JS (con respuesta)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role_id'] = $user['role_id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['fullname'] = $user['fullname'];
    $_SESSION['email'] = $user['email'];
    echo json_encode(['success'=>true,'user'=>[
        'id'=>$user['id'],
        'fullname'=>$user['fullname'],
        'email'=>$user['email'],
        'role'=>$user['role_id'],
        'username'=>$user['username']
    ]]);
    exit;
}

// Comprobación de sesión activa ("ping" para frontend)
if (isset($data['session']) && $data['session'] === true) {
    $uid = $_SESSION['user_id'] ?? null;
    if (!$uid) {
        echo json_encode(['success'=>false]);
        exit;
    }
    $role = $_SESSION['role_id'] ?? 1;
    $username = $_SESSION['username'] ?? null;
    $fullname = $_SESSION['fullname'] ?? null;
    $email = $_SESSION['email'] ?? null;
    echo json_encode(['success'=>true, 'user'=>[
        'id'=>$uid,
        'role'=>$role,
        'username'=>$username,
        'fullname'=>$fullname,
        'email'=>$email
    ]]);
    exit;
}

if (isset($data['logout'])) {
    session_destroy();
    echo json_encode(['success'=>true]);
    exit;
}

echo json_encode(['success'=>false,'error'=>'Solicitud inválida.']);