<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
$projectRoot = dirname(__DIR__, 2);
require_once $projectRoot . '/config/db.php';

// Session user_id ALWAYS prevails, no ?user_id param required for security
$user_id = $_SESSION['user_id'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (!$user_id) { echo json_encode(['success'=>false,'error'=>'No autenticado']); exit; }
  $stmt = $pdo->prepare("SELECT id, username, fullname, email, phone, address, birth_date, avatar_path FROM users WHERE id=?");
  $stmt->execute([$user_id]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($user) echo json_encode(['success'=>true, 'user'=>$user]);
  else echo json_encode(['success'=>false, 'error'=>'Usuario no encontrado']);
  exit;
}

// POST (foto subida)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['photo'])) {
  if (!$user_id || !isset($_FILES['photo'])) {
    echo json_encode(['success'=>false,'error'=>'Datos insuficientes']); exit;
  }
  $file = $_FILES['photo'];
  if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success'=>false,'error'=>'Error de subida']); exit;
  }
  $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
  $dest = '/uploads/avatars/user_' . $user_id . '_' . uniqid() . '.' . $ext;
  $abs_dest = $_SERVER['DOCUMENT_ROOT'] . $dest;
  if (!is_dir(dirname($abs_dest))) mkdir(dirname($abs_dest),0777,true);
  if (move_uploaded_file($file['tmp_name'], $abs_dest)) {
    $q = $pdo->prepare("UPDATE users SET avatar_path=? WHERE id=?");
    $q->execute([$dest, $user_id]);
    echo json_encode(['success'=>true, 'avatar_path'=>$dest]);
    exit;
  } else {
    echo json_encode(['success'=>false,'error'=>'No guardo foto']); exit;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER["CONTENT_TYPE"] === "application/json") {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$user_id) { echo json_encode(['success'=>false,'error'=>'Falta usuario']); exit; }
  if (isset($input['action']) && $input['action']=='update_general') {
    $username = trim($input['username'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $q = $pdo->prepare("UPDATE users SET username=?, email=?, phone=? WHERE id=?");
    $ok = $q->execute([$username,$email,$phone,$user_id]);
    echo json_encode(['success'=>$ok]); exit;
  }
  if (isset($input['action']) && $input['action']=='update_personal') {
    $fullname = trim($input['fullname'] ?? '');
    $address = trim($input['address'] ?? '');
    $birth_date = $input['birth_date'] ?? null;
    $q = $pdo->prepare("UPDATE users SET fullname=?, address=?, birth_date=? WHERE id=?");
    $ok = $q->execute([$fullname,$address,$birth_date,$user_id]);
    echo json_encode(['success'=>$ok]); exit;
  }
  echo json_encode(['success'=>false,'error'=>'Peticion no valida']); exit;
}
echo json_encode(['success'=>false,'error'=>'Metodo no soportado']);