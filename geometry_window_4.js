function ShowGeomWindow(theform) {
  const options = "location=0,menubar=0,status=0,scrollbars=1,left=50,resizable=0,directories=0";
  const GeomWindow = window.open("", "GeomWindow", options, 1);

  const html = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ingreso Coordenadas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
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
            max-width:700px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h3, h5 {
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .btn-container {
            text-align: center;
            margin: 10px;
        }
    </style>
</head>
<body onload="AddCells('PTable',1,4);">
    <div class="container p-5 my-5 mt-5 border">
        <div class="col"></div>
        <div class="col">
            <h3>Ingreso de Coordenadas</h3>
            <br>
            <h5>Opción 1:</h5><br>
            <div><h6>Ingreso de vértices por tipo de geometría</h6></div>
            <br>
            <form name="GeomNodes" method="post" action="">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-sm">
                            <input name="geomtype" type="radio" value="point" checked/> Punto
                        </div>
                        <div class="col-sm">
                            <input name="geomtype" type="radio" value="line" checked/> Línea
                        </div>
                        <div class="col-sm">
                            <input name="geomtype" type="radio" value="polygon" checked/> Polígono
                        </div>
                    </div>
                </div>
                <br>
                <div>
                    <table id="PTable">
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
                <br>
                <div class="btn-container">
                    <button type="button" class="btn btn-success" name="BAddCells" onclick="AddCells('PTable',1,4)">Más vértices</button>
                    <input type="button" class="btn btn-success" name="BReturnGeom" value="Aceptar" onclick="RetGeomNodes('${theform.name}')">
                    <input type="button" class="btn btn-success" name="Cerrar" value="Cerrar" onclick="window.close()">
                </div>
            </form>
            <hr>
            <h5>Opción 2:</h5><br>
            <h6>Introducir el texto WKT directamente</h6>
            <div class="container">
                <div class="row align-items-center">
                    <div class="col">
                        <table id="WKTTable">
                            <form name="GeomWKT" method="post" action="">
                                <textarea name="wkt" cols="64" rows="4" placeholder="Ingrese el texto aquí"></textarea>
                                <br>
                                <br>
                                <div class="btn-container">
                                    <input type="button" class="btn btn-success" name="BRtGeomWKT" value="Aceptar" onclick="RetGeomWKT('${theform.name}')">
                                    <input type="button" class="btn btn-success" name="Cerrar" value="Cerrar" onclick="window.close()">
                                </div>
                            </form>
                        </table>
                    </div>
                    <div class="col"></div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

  GeomWindow.document.write(html);

  GeomWindow.addEventListener("load", function () {
    const addButton = GeomWindow.document.querySelector("button[name='BAddCells']");
    addButton.addEventListener("click", function () {
      AddCells('PTable', 1, 4);
    });

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