<?php
// router.php para servidor integrado de PHP
// Estructura asumida: servidor arrancado desde /public, router en ../config/router.php

// Ruta física de la public (document root)
$publicDir = __DIR__ . '/../public';

// Extrae la URL solicitada
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$filePath = $publicDir . $uri;

// 1. Si la ruta es un archivo físico (EXISTE y no es directorio), que el servidor lo sirva directamente
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

// 2. Acceso directo a un endpoint PHP en /api:
if (preg_match('#^/api/(.+\.php)$#', $uri, $matches)) {
    $endpoint = $publicDir . '/api/' . $matches[1];
    if (file_exists($endpoint)) {
        require $endpoint;
        exit;
    }
    // No existe el endpoint solicitado, error 404 JSON
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found', 'endpoint' => $endpoint]);
    exit;
}

// 3. Si la ruta es una página HTML existe en /public, sirve ese archivo
if (preg_match('#^/.+\.html$#', $uri) && file_exists($filePath)) {
    require $filePath;
    exit;
}

// 4. Si la petición es raíz, muestra página de inicio
if ($uri === '/' || $uri === '/inicio') {
    require $publicDir . '/inicio/html/html_inicio.html';
    exit;
}

// 5. Para cualquier otra ruta: error 404 genérico
if (!file_exists($filePath)) {
    if (preg_match('#\.js$|\.css$|\.png$|\.jpg$|\.jpeg$|\.gif$|\.svg$#', $uri)) {
        // Si intentan acceder a un recurso estático inexistente, responde error 404
        header("HTTP/1.0 404 Not Found");
        echo "// Archivo no encontrado: $uri";
        exit;
    }
    // Para rutas de app no encontradas, muestra 404 amigable HTML
    header("HTTP/1.0 404 Not Found");
    echo "<!doctype html><html lang='es'><head><title>404 — No encontrado</title></head>
    <body><h2>404: Página o recurso no encontrado</h2>
    <p>No existe la ruta solicitada: <code>$uri</code></p></body></html>";
    exit;
}

// Si la ruta es directorio (por si acaso)
header("HTTP/1.0 403 Forbidden");
echo "Directorio prohibido.";