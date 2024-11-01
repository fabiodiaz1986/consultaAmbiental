function convertToWKT(theform) {
    const options = "location=0,menubar=0,status=0,scrollbars=1,left=50,resizable=0,directories=0";
    const GeomWindow = window.open("", "GeomWindow", options);

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <title>Cargue de archivo JSON</title>
        <script type="text/javascript" src="geometry_window_functions.js" defer="defer"></script>
        
        <style>
        body {
            text-align: center;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }

        .container {
            margin: 0 auto;
            padding: 20px;
            max-width: 700px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            font-weight: bold;
        }

        .btn-container {
            text-align: center;
            margin: 10px;
        }

        /* Oculta el input de tipo file */
        #fileInput {
            display: none;
        }

        /* Estilo para el botón del archivo */
        .custom-file-upload {
            display: inline-block;
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #898e8b;
            color: white;
            position: relative;
            overflow: hidden;
            text-align: left; /* Alinear el texto a la izquierda */
        }

        /* Cambiar el color del botón al pasar el mouse */
        .custom-file-upload:hover {
            background-color: #00801d;
        }

        /* Estilo para mostrar el nombre del archivo */
        #fileName {
            margin-left: 10px;
            font-weight: bold;
        }

      
        /* Estilo del ícono */
        .upload-icon {
            margin-right: 8px; /* Espacio entre ícono y texto */
            font-size: 16px;
            color: white; /* Cambiar el color del ícono a blanco */
        }

        </style>
    </head>
    <body>
        <div class="container p-5 my-5 mt-5 border">
            <h2 class="text-center">Cargue de archivo JSON</h2>
            <form id="uploadForm" enctype="multipart/form-data" class="mb-3">
                <div class="form-group">
                    <div class="d-flex justify-content-center align-items-center">
                        <label class="custom-file-upload">
                            <i class="bi bi-cloud-upload upload-icon"></i> Seleccionar archivo
                            <input type="file" class="form-control-file" name="jsonFile" accept=".json" required id="fileInput">
                        </label>
                        <span id="fileName">No hay archivo seleccionado</span>
                    </div>
                </div>
                <div class="btn-container">
                    <button type="button" class="btn btn-success" style="background-color:#00801d;" onclick="convertToWKT()">Convertir</button>
                </div>
            </form>

            <div class="row">
                <div class="col">
                    <table class="table">
                        <tbody>
                            <tr>
                                <td>
                                    <form name="GeomWKT" method="post" action="">
                                        <div class="form-group">
                                            <textarea id="wktOutput" class="form-control" name="wkt" rows="4" placeholder="Ingrese el texto aquí"></textarea>
                                        </div>
                                        <div class="btn-container">
                                            <input type="button" class="btn btn-success" style="background-color:#00801d;" name="BRtGeomWKT" value="Aceptar" onclick="RetGeomWKT('${theform.name}')">
                                            <input type="button" class="btn btn-success" style="background-color:#00801d;" name="Cerrar" value="Cerrar" onclick="window.close()">
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <script>
            // Actualiza el nombre del archivo seleccionado
            document.getElementById('fileInput').addEventListener('change', function() {
                const fileName = this.files.length > 0 ? this.files[0].name : 'No hay archivo seleccionado';
                document.getElementById('fileName').textContent = fileName;
            });

            function convertToWKT() {
                const formData = new FormData(document.getElementById('uploadForm'));

                fetch('procesar.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la red');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('wktOutput').textContent = data.wkt || 'Error al convertir a WKT';
                })
                .catch(error => console.error('Error:', error));
            }        
        </script>
    </body>
    </html>
    `;

    GeomWindow.document.write(html);

    GeomWindow.addEventListener("load", function () {
        const acceptButton = GeomWindow.document.querySelector("input[name='BReturnGeom']");
        acceptButton.addEventListener("click", function () {
            RetGeomNodes(theform.name);
        });

        const closeButton = GeomWindow.document.querySelector("input[name='Cerrar']");
        closeButton.addEventListener("click", function () {
            window.close();
        });
    });

    GeomWindow.document.close();
}
