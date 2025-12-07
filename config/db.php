<?php
// db.php - configuración de conexión PDO a MariaDB (XAMPP)
$DB_HOST = '127.0.0.1';
$DB_NAME = 'clinicaagenda';
$DB_USER = 'root'; // en XAMPP por defecto root
$DB_PASS = '';     // en XAMPP por defecto vacío

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}