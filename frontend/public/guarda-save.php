<?php
header('Content-Type: application/json');

// Capturar datos del frontend
$json_data = file_get_contents('php://input');

if (!$json_data) {
    echo json_encode(["success" => false, "message" => "No se recibieron datos"]);
    exit;
}

// Ruta relativa desde donde está este archivo PHP
$file_path = 'data/guides/guides.json';
$dir_path = 'data/guides/';

// Crear directorio si no existe
if (!file_exists($dir_path)) {
    mkdir($dir_path, 0777, true);
}

// Guardar archivo
if (file_put_contents($file_path, $json_data)) {
    echo json_encode(["success" => true, "message" => "Guardado exitosamente"]);
} else {
    // Si falla, el servidor suele ser por permisos de carpeta
    echo json_encode(["success" => false, "message" => "Error de permisos al escribir el archivo"]);
}
?>