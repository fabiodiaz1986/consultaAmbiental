<?php
	 $municipio = array();
	 $vereda = array();
	 $pomca = array();
	 $uaof = array();
	 $ee_ap = array();
	 $ley2 = array();
	 $dist = array();
	 $rios = array();
	 $paramo = array();
	 $sinap = array();
	 $corriente = array();
	 $transformar = array();
	 $geometri = array();
	 $zonifsog = array();
	 $zonifadrlm = array();
	 $zonifsuarez = array();
	 $zonifopon = array();
	 $zonifcarare = array();
	 $zonifmgd = array();
	 $zonifap = array();
	 $zonifpomca = array();
	 $catpgof = array();
	 $cobpgof = array();
	 $corriente = array();
	 $corrienteDoble = array();
	 $SRID = $_POST['datum'];
	 $zvida = array();
	 $contar = 0;
	 $TipoCons = $_POST['hdTipoCons'];

	 

	 //$_POST['hdTipoCons'];
	 //$nomuser = $_POST['nomUser'];
	 //$apellido = $_POST['apellido'];
	 
	 

	if (strlen($_POST['the_geom']) > 0)  
	{
	$conn=pg_connect("host=44.210.170.146 port=5432 user=admincas password=sigcas1962 dbname=sigcas");
	if ($conn) 
	{	

		$validar = "SELECT ST_IsValid(ST_GeomFromText('SRID=" .$SRID . "; ". $_POST['the_geom'] ."')) AS is_valid;";
		
		//$validar = "SELECT ST_IsValid(ST_SetSRID(ST_GeomFromText('" . $_POST['the_geom'] . "'), " . $SRID . ")) AS is_valid;";

		$resulta = pg_query($conn, $validar);
		$row = pg_fetch_assoc($resulta);
		$is_valid = $row['is_valid'];


		if ($is_valid=='f') { // "f" indica que la geometría es inválida en PostgreSQL
			if($TipoCons=='Publico'){
				echo '<script>alert("¡La geometría es inválida!");window.location.href="../consultaAmbiental";</script>';
			}else{
				echo '<script>alert("¡La geometría es inválida!");window.location.href="../consultaAmbiental?valBancoAgrario=1345";</script>';
			}
			
		}else{/*aca colocar el resto de las consulta */
			if($TipoCons != 'Publico' && is_numeric($_POST['selectDestino'])){				 //Valida que se haya seleccionado area destino para opción del Banco Agrario
				echo '<script>alert("Para generar un Certificado, debe seleccionar una actividad destino válida");window.location.href="../consultaAmbiental?valBancoAgrario=1345";</script>';
			}


		
				
		if ($SRID == "4326")
		{
			//transformar sistema de referencia
			
			$transformar = "select ST_AsText(ST_Transform(ST_GeomFromText('" .$_POST['the_geom'] ."',4326),3116))As the_geom, ST_SRID(ST_Transform(ST_GeomFromText('" .$_POST['the_geom'] ."', 4326), 3116)) AS srid_final;";
			$resulta = pg_query($conn, $transformar);
			$rowi = pg_fetch_assoc($resulta);
			array_push($geometri, $rowi);
			$geom = $rowi['the_geom'];
			$SRID = $rowi['srid_final'];
		} elseif ($SRID == "3116")
		{
			$geom = $_POST['the_geom'];
		}elseif ($SRID == "9377")
		{
			//transformar sistema de referencia
			$transformar = "select ST_AsText(ST_Transform(ST_GeomFromText('" .$_POST['the_geom'] ."',9377),3116))As the_geom, ST_SRID(ST_Transform(ST_GeomFromText('" .$_POST['the_geom'] ."', 9377), 3116)) AS srid_final;";
			$resulta = pg_query($conn, $transformar);
			$rowi = pg_fetch_assoc($resulta);
			array_push($geometri, $rowi);
			$geom = $rowi['the_geom'];
			$SRID = $rowi['srid_final'];
		}

		
      	//Consulta del Municipio
		$query  = "SELECT * FROM municipios WHERE ST_Intersects(the_geom, 'SRID=" .$SRID . "; ". $geom ."');";
		$result = pg_query($conn, $query);
		if ($result) {
		while ($row = pg_fetch_assoc($result)) {
			array_push($municipio, $row);
			}
		}
		
		//Consulta de veredas
		$query  = "SELECT cod_barrio, nom_barrio, geom FROM veredas WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
		$result = pg_query($conn, $query);
		if ($result) {
		while ($row = pg_fetch_assoc($result)) {
			array_push($vereda, $row);
			}
		}

		//Consultar ley 2da
		$query  = "SELECT * , CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
					CASE
			        	WHEN ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			            ELSE CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Area(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2))
			        END AS porcentaje_traslape,

                 		CAST(ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion,

				CASE
			          WHEN ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			          ELSE CAST(ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Length(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2)) 
			        END AS porce_lon_inter,

			        EXISTS (
                                 SELECT 1 
                                 FROM zonifley2da 
                                 WHERE ST_Intersects(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
                                ) AS intersection_exists

		FROM zonifley2da WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";

		$result = pg_query($conn, $query);
		if ($result) {
		while ($row = pg_fetch_assoc($result)) {
			array_push($ley2, $row);
			$area_interseccion = $row['area_interseccion'];
			$porcentaje = $row['porcentaje_traslape'];
			$longi = $row['longitud_interseccion'];
			$porce_long = $row['porce_lon_inter'];
			$intersection_exists = $row['intersection_exists'];
			}
		}


		//Tipo de geometría
		  $query  = "SELECT GeometryType(ST_GeomFromText('" . $geom . "')) AS gt;";
		      $result = pg_query($conn, $query);
		      if ($result) {
		        while ($row = pg_fetch_assoc($result)) {
		          $geomtype = $row['gt'];
		        }
		      } 

		//Consultar SINAP
		  $query  = "SELECT * , CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
						CASE
			        		WHEN ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			            	ELSE CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Area(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2))
			        	END AS porcentaje_traslape,

			        	CAST(ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion,

						CASE
				        	WHEN ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
				        	ELSE CAST(ST_Length(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Length(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2))
				        END AS porce_lon_inter,			        

			        	EXISTS (
                			SELECT 1 
                			FROM areas_protegidas_runap 
                			WHERE ST_Intersects(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
            			) AS intersection_exists

			FROM areas_protegidas_runap 

			WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";

			$result = pg_query($conn, $query);
			if ($result) {
			while ($row = pg_fetch_assoc($result)) {
				array_push($sinap, $row);
				 "AREA: " . $area_interseccion = $row['area_interseccion'];
				 "PORCENAJE: " . $porcentaje = $row['porcentaje_traslape'];
				 "lONGITUD: " . $longi = $row['longitud_interseccion'];
				 " %: " . $porce_long = $row['porce_lon_inter'];
				 "INTERSECTA: " . $intersection_exists = $row['intersection_exists'];
				}
			}


		//Consulta Areas protegidas

		$query = "WITH subquery AS (
			    SELECT id_pnn, categoria, nombre, zonificacion,
			    	CAST(ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
			    	
			    	CASE
			            WHEN ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			            ELSE CAST(ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Area(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2))
			        END AS porcentaje_traslape,

			        CAST(ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion,

			        CASE
			        	WHEN ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			        	ELSE CAST(ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Length(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2)) 
			        END AS porce_lon_inter

			    FROM public.vista_areas_protegidas
			    WHERE ST_Intersects(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
			  )			
			 /*--Consulta principal utilizando la subconsulta*/
			SELECT id_pnn, categoria, nombre, zonificacion,
			    SUM(area_interseccion) AS total_area_interseccion,
			    SUM(porcentaje_traslape) AS porcentaje_traslape,	    
			    SUM(longitud_interseccion) AS total_longitud_interseccion
			FROM subquery
			GROUP BY id_pnn, categoria, nombre, zonificacion;";

			/*--Preparar y ejecutar la consulta con valores parametrizados--*/
			$result = pg_query($conn, $query);
			if ($result) {
				 while ($row = pg_fetch_assoc($result)) {
				   array_push($zonifap, $row);
				 }
			}

			//Consultar Paramos
			$query  = "SELECT * , CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
						CASE
			            	WHEN ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) = 0 THEN 0
			            	ELSE CAST(ST_Area(ST_Intersection(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / ST_Area(ST_GeomFromText('" . $geom . "', " . $SRID . ")) * 100 AS numeric(10, 2))
			        	END AS porcentaje_traslape
			FROM paramos WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
			$result = pg_query($conn, $query);
			if ($result) {
			while ($row = pg_fetch_assoc($result)) {
				array_push($paramo, $row);
				$area_interseccion = $row['area_interseccion'];
				$porcentaje = $row['porcentaje_traslape'];
				}
			}

			//Consulta POMCAS

		$query = "WITH subquery AS (
			    SELECT cod_pomca, pomcas, cat_ord, zo_us_ma, szo_us_m,
			    	CAST(ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
			        CAST(ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion			        
			    FROM public.vista_zonif_amb_pomcas
			    WHERE ST_Intersects(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
			  )			
			/*-- Consulta principal utilizando la subconsulta*/
			SELECT cod_pomca, pomcas, cat_ord, zo_us_ma, szo_us_m,
			    SUM(area_interseccion) AS total_area_interseccion,			    
			    SUM(longitud_interseccion) AS total_longitud_interseccion
			FROM subquery
			GROUP BY cod_pomca, pomcas, cat_ord, zo_us_ma, szo_us_m;";

			/*-- Preparar y ejecutar la consulta con valores parametrizados*/
			$result = pg_query($conn, $query);
			if ($result) {
				 while ($row = pg_fetch_assoc($result)) {
				   array_push($zonifpomca, $row);
				 }
			}


		//Consulta PGOF

		$query = "WITH subquery AS (
			    SELECT cod_pgof, uaof, categoria,
			    	CAST(ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
			        CAST(ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion			        
			    FROM public.vista_categorias_pgof
			    WHERE ST_Intersects(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
			  )			
			/*-- Consulta principal utilizando la subconsulta*/
			SELECT cod_pgof, uaof, categoria,
			    SUM(area_interseccion) AS total_area_interseccion,			    
			    SUM(longitud_interseccion) AS total_longitud_interseccion
			FROM subquery
			GROUP BY cod_pgof, uaof, categoria;";

			/*-- Preparar y ejecutar la consulta con valores parametrizados*/
			$result = pg_query($conn, $query);
			if ($result) {
				 while ($row = pg_fetch_assoc($result)) {
				   array_push($catpgof, $row);
				 }
			}

		//Consulta Cobertura PGOF

		$query = "WITH subquery AS (
			    SELECT cod_pgof, uaof, n1_cober, n2_cober, n3_cober, n4_cober, n5_cober, n6_cober,
			    	CAST(ST_Area(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) / 10000 AS numeric(10,2)) AS area_interseccion,
			        CAST(ST_Length(ST_Intersection(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))) AS numeric(10,2)) AS longitud_interseccion			        
			    FROM public.vista_cobertura_pgof
			    WHERE ST_Intersects(the_geom, ST_GeomFromText('" . $geom . "', " . $SRID . "))
			  )			
			/*Consulta principal utilizando la subconsulta*/
			SELECT cod_pgof, uaof, n1_cober, n2_cober, n3_cober, n4_cober, n5_cober, n6_cober,
			    SUM(area_interseccion) AS total_area_interseccion,			    
			    SUM(longitud_interseccion) AS total_longitud_interseccion
			FROM subquery
			GROUP BY cod_pgof, uaof, n1_cober, n2_cober, n3_cober, n4_cober, n5_cober, n6_cober;";

			/*-- Preparar y ejecutar la consulta con valores parametrizados*/
			$result = pg_query($conn, $query);
			if ($result) {
				 while ($row = pg_fetch_assoc($result)) {
				   array_push($cobpgof, $row);
				 }
			}
					

		//Consulta de la corriente mas cercana o las intersecciones para drenajes sencillos
		     if ($geomtype == 'POINT') {
		      	$query  = "SELECT estado, plancha, fuente, anio, ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo, CAST(ST_distance('SRID=" . $SRID . "; " . $geom . "'::geometry, geom)AS numeric(10,2)) AS distancia FROM drenaje_sencillos_25k_consolidado_igac
		      		WHERE geom && ST_expand(ST_GeomFromText('" . $geom . "'), 10) ORDER BY distancia ASC LIMIT 1;";
		      } else {

		      if ($geomtype == 'LINESTRING') {
		        $query  = "SELECT estado, plancha, fuente, anio, ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM drenaje_sencillos_25k_consolidado_igac WHERE ST_Intersects(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "));";
		      } else {

		      	if ($geomtype == 'POLYGON') {
		        $query  = "SELECT estado, plancha, fuente, anio, ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM drenaje_sencillos_25k_consolidado_igac WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
		       } else {
		       	if ($geomtype == 'MULTIPOLYGON') {
		        $query  = "SELECT estado, plancha, fuente, anio, ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM drenaje_sencillos_25k_consolidado_igac WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
		       }
		       }
		      }
		  }
		  
		  $result = pg_query($conn, $query);
		      if ($result) {
		        while ($row = pg_fetch_assoc($result)) {
		          array_push($corriente, $row);
		        }
		      }

		 //Consulta de la corriente mas cercana o las intersecciones para drenajes dobles
		     if ($geomtype == 'POINT') {
		      	$query  = "SELECT ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo, CAST(ST_distance('SRID=" . $SRID . "; " . $geom . "'::geometry, geom)AS numeric(10,2)) AS distancia FROM capa_5101_drenaje_doble
		      		WHERE geom && ST_expand(ST_GeomFromText('" . $geom . "'), 10) ORDER BY distancia ASC LIMIT 1;";
		      } else {

		      if ($geomtype == 'LINESTRING') {
		        $query  = "SELECT ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM capa_5101_drenaje_doble WHERE ST_Intersects(geom, ST_GeomFromText('" . $geom . "', " . $SRID . "));";
		      } else {

		      	if ($geomtype == 'POLYGON') {
		        $query  = "SELECT ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM capa_5101_drenaje_doble WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
		       } else {
		       	if ($geomtype == 'MULTIPOLYGON') {
		        $query  = "SELECT ROW_NUMBER() OVER (ORDER BY nombre_geo) AS ID, COALESCE(nombre_geo, 'Innominado') AS nombre_geo FROM capa_5101_drenaje_doble WHERE ST_Intersects(geom, 'SRID=" .$SRID . "; ". $geom ."');";
		       }
		   	   }	
		      }
		  }
		  
		  $result = pg_query($conn, $query);
		      if ($result) {
		        while ($row = pg_fetch_assoc($result)) {
		          array_push($corrienteDoble, $row);
		        }
		      }

		//Area y perimetro de la geometría
	   $query  = "SELECT 
	    CAST(ST_Area(ST_GeomFromText('" . $geom . "', " . $SRID . ")) / 10000 AS numeric(10,2)) AS area,	     
	    CAST(ST_Perimeter(ST_GeomFromText('" . $geom . "', " . $SRID . ")) AS numeric(10,2)) AS perimetro, 
	    CAST(ST_Length(ST_GeomFromText('" . $geom . "', " . $SRID . ")) AS numeric(10,2)) AS longitudes";
	      $result = pg_query($conn, $query);
	      if ($result) {
	        while ($row = pg_fetch_assoc($result)) {
	          $area1 = $row['area'];
	          $perimetro1 = $row['perimetro'];
	          $longitud1 = $row['longitudes'];
	        }
	      }

		//Geometria en WGS4

	    $transformar = "select ST_AsText(ST_Transform(ST_GeomFromText('" . $geom ."',3116),4326))As the_geomw;";
		$resulta = pg_query($conn, $transformar);
		$rowi = pg_fetch_assoc($resulta);
		array_push($geometri, $rowi);
		$geomw = $rowi['the_geomw'];

		
		//Eliminar duplicados
		foreach ($municipio as $row) { 
		$Nom_municipio = $row['nom_munici'];
		}
		
		foreach ($vereda as $row) { 
		$Nom_vereda = $row['nom_barrio'];
		$cod_barrio = $row['cod_barrio'];
		}

		foreach ($zonifap as $row) {
			$id_pnn = $row['id_pnn'];
			$categoria = $row['categoria'];
			$nomap = $row['nombre'];
			$zonifi = $row['zonificacion'];
		}

		foreach ($zonifpomca as $row) {		
			$cod_pomca = $row['cod_pomca'];
			$nombre_pomcas = $row['pomcas'];
			$cat_ord = $row['cat_ord'];
			$zo_us_ma = $row['zo_us_ma'];
			$szo_us_m = $row['szo_us_m'];
		}

		foreach ($catpgof as $row) {
			$cod_pgof = $row['cod_pgof'];
			$uaof = $row['uaof'];
			$categoria = $row['categoria'];
		}

		foreach ($cobpgof as $row) {
			$cod_pgof = $row['cod_pgof'];
			$uaof = $row['uaof'];
			$n1_cober = $row['n1_cober'];
			$n2_cober = $row['n2_cober'];
			$n3_cober = $row['n3_cober'];
			$n4_cober = $row['n4_cober'];
			$n5_cober = $row['n5_cober'];
			$n6_cober = $row['n6_cober'];
		}	

		foreach ($corriente as $row) {			
			$nombre_geo = $row['nombre_geo'];
			$tipo = $row['estado'];
			$plancha = $row['plancha'];
			$fuente = $row['fuente'];
			$anio = $row['anio'];
			$id = $row['id'];
			if ($geomtype == 'POINT') {
			$distancia1 = $row['distancia'];}
		}

		foreach ($corrienteDoble as $row) {
			$nombre_geo = $row['nombre_geo'];
			$id = $row['id'];
			if ($geomtype == 'POINT') {
			$distancia2 = $row['distancia'];}
		}

		foreach ($ley2 as $row) { 
		$Tipo_zona = $row['tipo_zoni'];
		}

		foreach ($dist as $row) { 
		$distan = $row['dist'];
		}
		//Mostrar los resultados
		include 'resultados1.html';
	  }
	}
}
?>
