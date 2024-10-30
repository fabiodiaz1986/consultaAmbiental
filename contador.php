<?php
$archivo_contador = "contador.txt";

// Leer el valor actual del contador
if (file_exists($archivo_contador)) {
    $contador = file_get_contents($archivo_contador);
} else {
    $contador = 0;
}

// Incrementar el contador
$contador++;

// Guardar el nuevo valor en el archivo
file_put_contents($archivo_contador, $contador);

// Devolver el contador como respuesta
echo $contador;
?>
