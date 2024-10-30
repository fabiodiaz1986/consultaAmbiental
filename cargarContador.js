// Función para cargar y actualizar el contador
        function cargarContador() {
            var divContador = document.getElementById("contador");
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    divContador.textContent = "Documento No.: " + xhr.responseText;
                }
            };

            xhr.open("GET", "contador.php", true);
            xhr.send();
        }

        // Cargar el contador cuando se carga la página
        window.onload = cargarContador;