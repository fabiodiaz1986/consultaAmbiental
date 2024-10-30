function ShowGeomWindow2(theform) {
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
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            padding: 20px;
            max-width: 700px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h3, h6 {
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
        }
    </style>
</head>

<body onload="AddCells2('PTable',1,8);">
    <div class="container p-3 my-3 border">
        <h3>Ingreso de Coordenadas geográficas</h3>
        <div><h6>Ingreso de vértices por tipo de geometría</h6></div>
        <form name="GeomNodes" method="post" action="">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-sm"><input name="geomtype" type="radio" value="point" checked/>Punto</div>
                    <div class="col-sm"><input name="geomtype" type="radio" value="line" checked/>Línea</div>
                    <div class="col-sm"><input name="geomtype" type="radio" value="polygon" checked/>Polígono</div>
                </div>
            </div>
        </form>
        <br>
        <table id="PTable">
            <tbody>
                <tr></tr>
            </tbody>
        </table>
        <br>
        <div class="btn-container">
            <button type="button" class="btn btn-success" name="BAddCells" onclick="AddCells2('PTable',1,8)">Más vértices</button>
            <input type="button" class="btn btn-success" name="BReturnGeom" value="Aceptar" onclick="RetGeomNodes2('${theform.name}')">
            <input type="button" class="btn btn-success" name="Cerrar" value="Cerrar" onclick="window.close();">
        </div>
    </div>
</body>

</html>
    `;

  GeomWindow.document.write(html);

  GeomWindow.addEventListener("load", function () {
    const acceptButton = GeomWindow.document.querySelector("input[name='BReturnGeom2']");
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