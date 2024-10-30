var vid = 0;

/**
 * Agrega celdas a la tabla de introducción de coordenadas.
 *
 */

function AddCells(tname, trows, tcells) {

    var mytable = document.getElementById(tname);
    var mytablebody = mytable.getElementsByTagName("tbody")[0];

    for (var j = 0; j < trows; j++) {
        mycurrent_row = document.createElement("tr");
        for (var i = 0; i < tcells; i++) {
            mycurrent_cell = document.createElement("td");
            if (i == 0) {
                currenttext = document.createTextNode("Este(" + vid + "):");
            } else if (i == 1) {
                currenttext = document.createElement("input");
                currenttext.type = 'text';
                currenttext.name = 'este' + vid;
                currenttext.title = 'este' + vid;
                currenttext.id = 'este' + vid;
                currenttext.size = 20;
                currenttext.maxlength = 50;
                currenttext.value = '';
            } else if (i == 2) {
                currenttext = document.createTextNode("Norte(" + vid + "):");
            } else {
                currenttext = document.createElement("input");
                currenttext.type = 'text';
                currenttext.name = 'norte' + vid;
                currenttext.title = 'norte' + vid;
                currenttext.id = 'norte' + vid;
                currenttext.size = 20;
                currenttext.maxlength = 50;
                currenttext.value = '';
            }
            mycurrent_cell.appendChild(currenttext);
            mycurrent_row.appendChild(mycurrent_cell);
        }
        mytablebody.appendChild(mycurrent_row);
    }

    vid = vid + 1;
}

function AddCells2(tname, trows, tcells) {
    var mytable = document.getElementById(tname);
    var mytablebody = mytable.getElementsByTagName("tbody")[0];

    for (var j = 0; j < trows; j++) {
        mycurrent_row = document.createElement("tr");
        for (var i = 0; i < tcells; i++) {
            mycurrent_cell = document.createElement("td");
                        if (i == 0) {
                /*currenttext = document.createElement("input");
                currenttext.type = 'checkbox';
                currenttext.name = 'Chk';
                currenttext.id = 'Chk';
                currenttext.value = '';*/
                currenttext = document.createTextNode("Longitud(" + vid + "):");
            } else if (i < 4) {
                currenttext = document.createElement("input");
                currenttext.type = 'text';
                if (i == 1) {
                    currenttext.name = 'oeste' + vid + 'g';
                    currenttext.title = 'oeste' + vid + 'g';
                    currenttext.id = 'oeste' + vid + 'g';
                } else if (i == 2) {
                    currenttext.name = 'oeste' + vid + 'm';
                    currenttext.title = 'oeste' + vid + 'm';
                    currenttext.id = 'oeste' + vid + 'm';
                } else {
                    currenttext.name = 'oeste' + vid + 's';
                    currenttext.title = 'oeste' + vid + 's';
                    currenttext.id = 'oeste' + vid + 's';
                }
                currenttext.size = 2;
                currenttext.maxlength = 5;
                currenttext.value = '';
            } else if (i == 4) {
                currenttext = document.createTextNode("Latitud(" + vid + "):");
            } else {
                currenttext = document.createElement("input");
                currenttext.type = 'text';
                if (i == 5) {
                    currenttext.name = 'norte' + vid + 'g';
                    currenttext.title = 'norte' + vid + 'g';
                    currenttext.id = 'norte' + vid + 'g';
                } else if (i == 6) {
                    currenttext.name = 'norte' + vid + 'm';
                    currenttext.title = 'norte' + vid + 'm';
                    currenttext.id = 'norte' + vid + 'm';
                } else {
                    currenttext.name = 'norte' + vid + 's';
                    currenttext.title = 'norte' + vid + 's';
                    currenttext.id = 'norte' + vid + 's';
                }
                currenttext.size = 2;
                currenttext.maxlength = 5;
                currenttext.value = '';
            }
            mycurrent_cell.appendChild(currenttext);
            mycurrent_row.appendChild(mycurrent_cell);
        }
        mytablebody.appendChild(mycurrent_row);
    }
    vid = vid + 1;
}


/**
 * Procesa y valida el texto WKT introducido y lo retorna
 *
 */

function RetGeomWKT(form_name) {

    wktext = document.forms['GeomWKT'].elements['wkt'].value;

    //TODO: valida el texto WKT antes de devolverlo

    window.opener.document.forms[form_name].elements['the_geom'].value = wktext;
    window.opener.document.forms[form_name].elements['the_geom2'].value = wktext;
    window.close();

}

/**
 * Procesa los valores introducidos y los retorna como texto WKT.
 *
 */

function RetGeomNodes(form_name) {

    //Validación del número de vértices
    if (document.forms['GeomNodes'].elements['geomtype'][0].checked && vid > 1) {
        alert('La geometria "Punto" solo puede tener un vertice');
        return;
    } else if (document.forms['GeomNodes'].elements['geomtype'][1].checked && vid < 2) {
        alert('La geometria "Linea" debe tener al menos dos vertices.');
        return;
    } else if (document.forms['GeomNodes'].elements['geomtype'][2].checked && vid < 3) {
        alert('La geometria "Poligono" debe tener al menos tres vertices.');
        return;
    }

    //Validación del cierre de polígonos
    if (document.forms['GeomNodes'].elements['geomtype'][2].checked && (
            (document.getElementsByName('este0')[0].value != document.getElementsByName('este' + (vid - 1))[0].value) ||
            (document.getElementsByName('norte0')[0].value != document.getElementsByName('norte' + (vid - 1))[0].value)
            )) {
        alert('El primer y ultimo punto de un poligono deben ser identicos. Verifique las coordenadas e intentelo nuevamente.');
        return;
    }

    var wktext = '';
    if (document.forms['GeomNodes'].elements['geomtype'][0].checked) {
        wktext += 'POINT(';
    } else if (document.forms['GeomNodes'].elements['geomtype'][1].checked) {
        wktext += 'LINESTRING(';
    } else {
        wktext += 'POLYGON((';
    }

    for (var i = 0; i < vid; i++) {

        wktext += document.getElementById('este' + i).value + ' ' + document.getElementById('norte' + i).value;

        if (i < vid - 1)
            wktext += ',';
    }

    if (document.forms['GeomNodes'].elements['geomtype'][2].checked) {
        wktext += '))';
    } else {
        wktext += ')';
    }

    window.opener.document.forms[form_name].elements['the_geom'].value = wktext;
    window.opener.document.forms[form_name].elements['the_geom2'].value = wktext;
    window.close();
}

function RetGeomNodes2(form_name) {
    //Validación del número de vértices
    if (document.forms['GeomNodes'].elements['geomtype'][0].checked && vid > 1) {
        alert('La geometria "Punto" solo puede tener un vertice');
        return;
    } else if (document.forms['GeomNodes'].elements['geomtype'][1].checked && vid < 2) {
        alert('La geometria "Linea" debe tener al menos dos vertices.');
        return;
    } else if (document.forms['GeomNodes'].elements['geomtype'][2].checked && vid < 3) {
        alert('La geometria "Poligono" debe tener al menos tres vertices.');
        return;
    }

    //Validación del cierre de polígonos
    if (document.forms['GeomNodes'].elements['geomtype'][2].checked && (
            (document.getElementsByName('oeste0g')[0].value != document.getElementsByName('oeste' + (vid - 1) + 'g')[0].value) ||
            (document.getElementsByName('norte0g')[0].value != document.getElementsByName('norte' + (vid - 1) + 'g')[0].value) ||
            (document.getElementsByName('oeste0m')[0].value != document.getElementsByName('oeste' + (vid - 1) + 'm')[0].value) ||
            (document.getElementsByName('norte0m')[0].value != document.getElementsByName('norte' + (vid - 1) + 'm')[0].value) ||
            (document.getElementsByName('oeste0s')[0].value != document.getElementsByName('oeste' + (vid - 1) + 's')[0].value) ||
            (document.getElementsByName('norte0s')[0].value != document.getElementsByName('norte' + (vid - 1) + 's')[0].value)
            )) {
        alert('El primer y ultimo punto de un poligono deben ser identicos. Verifique las coordenadas e intentelo nuevamente.');
        return;
    }

    var wktext = '';
    if (document.forms['GeomNodes'].elements['geomtype'][0].checked) {
        wktext += 'POINT(';
    } else if (document.forms['GeomNodes'].elements['geomtype'][1].checked) {
        wktext += 'LINESTRING(';
    } else {
        wktext += 'POLYGON((';
    }

    for (var i = 0; i < vid; i++) {
        var oeste = (parseFloat(document.getElementById('oeste' + i + 'g').value) + (parseFloat(document.getElementById('oeste' + i + 'm').value) / 60) + (parseFloat(document.getElementById('oeste' + i + 's').value) / 3600)) * -1;
        var norte = parseFloat(document.getElementById('norte' + i + 'g').value) + (parseFloat(document.getElementById('norte' + i + 'm').value) / 60) + (parseFloat(document.getElementById('norte' + i + 's').value) / 3600);
        wktext += oeste.toString() + ' ' + norte.toString();

        if (i < vid - 1)
            wktext += ',';
    }

    if (document.forms['GeomNodes'].elements['geomtype'][2].checked) {
        wktext += '))';
    } else {
        wktext += ')';
    }

    window.opener.document.forms[form_name].elements['the_geom'].value = wktext;
    window.opener.document.forms[form_name].elements['the_geom2'].value = wktext;
    window.close();
}

