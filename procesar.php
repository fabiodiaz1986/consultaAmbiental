<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['jsonFile'])) {
    $jsonFile = $_FILES['jsonFile']['tmp_name'];
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Error en el archivo JSON']);
        exit;
    }

    // Convertir JSON a WKT
    $wkt = '';
    if (isset($data['type']) && $data['type'] === 'FeatureCollection') {
        foreach ($data['features'] as $feature) {
            $geometry = $feature['geometry'];
            $type = strtoupper($geometry['type']);
            $coordinates = $geometry['coordinates'];

            switch ($type) {
                case 'POINT':
                    $wkt = "POINT(" . implode(' ', $coordinates) . ")";
                    break;
                case 'LINESTRING':
                    $wkt = "LINESTRING(" . implode(', ', array_map(fn($point) => implode(' ', $point), $coordinates)) . ")";
                    break;
                case 'POLYGON':
                    $wkt = "POLYGON((" . implode(', ', array_map(fn($point) => implode(' ', $point), $coordinates[0])) . "))";
                    break;
                default:
                    $wkt = 'Tipo de geometría no soportado';
                    break;
            }
        }
    }
    echo json_encode(['wkt' => $wkt]);
} else {
    echo json_encode(['error' => 'Archivo no recibido']);
}
?>