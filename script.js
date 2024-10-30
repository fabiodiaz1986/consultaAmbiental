var map = new ol.Map({ 
    layers: [ 
        // Capa base OpenStreetMap
        new ol.layer.Tile({ 
        source: new ol.source.OSM() 
        }) ,

        // Capa WMS de GeoServer
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:municipios',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:veredas',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:capa_5101_drenaje_doble',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:drenaje_sencillos_25k_consolidado_igac',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:zonif_drmi_san_silvestre',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:zonif_drmi_serrania_de_los_yariguies',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:zonif_drmi_guantiva_la_rusia',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:zonif_drmi_del_rio_minero',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:zonifley2da',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            }),

        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://sigdatabase.cas.gov.co/geoserver/SIG-CAS/wms?',
                params: {
                    'LAYERS': 'SIG-CAS:paramos',
                    'TILED': true
                },
                serverType: 'geoserver'
                })
            })
        ],
        target: 'map', 
        view: new ol.View({ 
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2,
            layers: ['drawLayer']
        }) 
});
