
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
 });
 
 var transformRequest = (url, resourceType) => {
   var isMapboxRequest =
     url.slice(8, 22) === "api.mapbox.com" ||
     url.slice(10, 26) === "tiles.mapbox.com";
   return {
     url: isMapboxRequest
       ? url.replace("?", "?pluginName=sheetMapper&")
       : url
   };
 };
   
 mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWxnYyIsImEiOiJja2NjbTAyczkwNXA3Mnlscm5nbjN5OHZiIn0.yNcJkPBSugRlIeGkXDRlZw'; //Mapbox token 
 /*const bounds = [
     [-43.5, -20],  // sudoeste coordinates     -20.0549/-43.8534
     [-44.1, -19.5] // nordeste coordinates     -19.7188/-44.0452   
 ];*/

 /*
 AJUSTES DAS VARIAVEIS PARA CELULAR
 https://gis.stackexchange.com/questions/387372/mapbox-gl-js-is-there-a-way-to-specify-a-different-zoom-level-for-mobile-devic
 
 var mq = window.matchMedia( "(min-width: 420px)" );

 if (mq.matches){
     map.setZoom(14.34); //set map zoom level for desktop size
 } else {
     map.setZoom(11); //set map zoom level for mobile size
 };
 */

 var map = new mapboxgl.Map({
   container: 'map', // container id
   style: 'mapbox://styles/saralgc/clhkcc2vc01lp01qy8fmi7wmn',
   center: [-43.95857, -19.87472], // starting position
   zoom: 11.3,// starting zoom
   minZoom: 10,
   maxZoom: 13.5,  
   pitch: 0, // pitc3 in degrees
   bearing: -92, // bearing in degrees
   transformRequest: transformRequest,
   //maxBounds: bounds // Set the map's geographical boundaries.
 });

 var mq = window.matchMedia( "(min-width: 700px)" );
 if (mq.matches){
     map.setBearing(-92); //set map zoom level for desktop size
 } else {
     map.setBearing(0); //set map zoom level for mobile size
     map.setZoom(10.8);
 };
     
 $(document).ready(function () {

   $.ajax({
     type: "GET",
     //url: 'https://docs.google.com/spreadsheets/d/1AbjMeyFH1DJFPLmaZhIlE98_KqAEJAfxgeZnqBLMNf0/gviz/tq?tqx=out:csv&sheet=VIDEOS',
     url: 'assets/VIDEOS.csv',
     dataType: "text",
     success: function (csvData) { makeGeoJSON(csvData); }
   });
   
   $.ajax({
     type: "GET",
     //url: 'https://docs.google.com/spreadsheets/d/1AbjMeyFH1DJFPLmaZhIlE98_KqAEJAfxgeZnqBLMNf0/gviz/tq?tqx=out:csv&sheet=FOTOS',
     url: 'assets/FOTOS.csv',
     dataType: "text",
     success: function (csvData) { makeGeoJSON2(csvData); }
   });

   $.ajax({
     type: "GET",
     //url: 'https://docs.google.com/spreadsheets/d/1AbjMeyFH1DJFPLmaZhIlE98_KqAEJAfxgeZnqBLMNf0/gviz/tq?tqx=out:csv&sheet=SONS',
     url: 'assets/SONS.csv',
     dataType: "text",
     success: function (csvData) { makeGeoJSON3(csvData); }
   });

   $.ajax({
     type: "GET",
     //url: 'https://docs.google.com/spreadsheets/d/1AbjMeyFH1DJFPLmaZhIlE98_KqAEJAfxgeZnqBLMNf0/gviz/tq?tqx=out:csv&sheet=RECEITAS',
     url: 'assets/RECEITAS.csv',
     dataType: "text",
     success: function (csvData) { makeGeoJSON4(csvData); }
   });


   // RECEITAS

   function makeGeoJSON4(csvData) {
     csv2geojson.csv2geojson(csvData, {
       latfield: 'Latitude',
       lonfield: 'Longitude',
       delimiter: ','
     }, function (err, data) {
       
       map.on('load', function () {
                   
         map.loadImage(
          'assets/receita.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r1', image);
         });
           
         map.loadImage(
          'assets/receita2.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r2', image);
         });  
           
         map.loadImage(
          'assets/receita3.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r3', image);
         });
           
         map.loadImage(
          'assets/receita4.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r4', image);
         });
           
         map.loadImage(
          'assets/receita5.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r5', image);
         });    
            
         map.loadImage(
          'assets/receita6.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r6', image);
         });  

         map.loadImage(
          'assets/receita7.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r7', image);
         }); 

         map.loadImage(
          'assets/receita8.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('r8', image);
         }); 


         // LAYER
         map.addLayer({
           'id': 'Receitas',
           'type': 'symbol',
           'source': {
             'type': 'geojson',
             'data': data
           },

           'layout': {
             'visibility': 'visible',
             'icon-image': '{Icon}',
             'icon-anchor': 'bottom',
             "icon-allow-overlap": true,
           }
         });        

         map.on('click', 'Receitas', function (e) {
             var coordinates = e.features[0].geometry.coordinates.slice();

             var description = `<h2>`+e.features[0].properties.Titulo +`</h2><p>INGREDIENTES</p><p>`+e.features[0].properties.Ingredientes +`</p><br><p>PREPARO</p><p>`+e.features[0].properties.Receita +`</p>`;
             
             closeNav();

             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
             }
             
             //only one popup once 
             e.originalEvent.cancelBubble = true;

             if (e.originalEvent.cancelBubble2 || e.originalEvent.cancelBubble3 || e.originalEvent.cancelBubble4) {
                 return;
             }

             new mapboxgl.Popup({className: 'popupReceitas'})
               .setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);

         });

         map.on('mouseenter', 'Receitas', function () {
           map.getCanvas().style.cursor = 'pointer';
         });

         map.on('mouseleave', 'Receitas', function () {
           map.getCanvas().style.cursor = '';
         });

          map.setLayoutProperty('Receitas', 'icon-size', 
         ['interpolate', ['linear'], ['zoom'],11,0.1,14,0.65]);
         
       });

     });
   };     

   // SONS

   function makeGeoJSON3(csvData) {
     csv2geojson.csv2geojson(csvData, {
       latfield: 'Latitude',
       lonfield: 'Longitude',
       delimiter: ','
     }, function (err, data) {
       
       map.on('load', function () {
                   
         map.loadImage(
          'assets/som.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s1', image);
         });
         
         map.loadImage(
          'assets/som2.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s2', image);
         });
           
         map.loadImage(
          'assets/som3.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s3', image);
         });
           
         map.loadImage(
          'assets/som4.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s4', image);
         });
           
         map.loadImage(
          'assets/som5.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s5', image);
         });
           
         map.loadImage(
          'assets/som6.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s6', image);
         });
           
         map.loadImage(
          'assets/som7.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s7', image);
         });
           
         map.loadImage(
          'assets/som8.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('s8', image);
         });


         // LAYER
         map.addLayer({
           'id': 'Sons',
           'type': 'symbol',
           'source': {
             'type': 'geojson',
             'data': data
           },

           'layout': {
             'visibility': 'visible',
             'icon-image': '{Icon}',
             'icon-anchor': 'bottom',
             "icon-allow-overlap": true,
           }

         });        

         map.on('click', 'Sons', function (e) {
             var coordinates = e.features[0].geometry.coordinates.slice();

             //var description = `<iframe width="100%" height="20" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/`+e.features[0].properties.Embed +`&color=%23F6AE2D&inverse=false&auto_play=false&show_user=false"></iframe>`;
             var description = '<audio controls style="width:100%;" controlsList="nodownload" autoplay><source src="../assets/sounds/' + e.features[0].properties.Som + '.mp3" type="audio/mpeg"></audio>';
             //var description = `<h2>`+e.features[0].properties.Som +`</h2>`;

             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
             }

             /* rosa(); */

             //only one popup once 
             e.originalEvent.cancelBubble2 = true;
             
             if (e.originalEvent.cancelBubble || e.originalEvent.cancelBubble3 || e.originalEvent.cancelBubble4) {
                 return;
             }

             new mapboxgl.Popup({className: 'popupSom'})
               .setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);
         });

         map.on('mouseenter', 'Sons', function () {
           map.getCanvas().style.cursor = 'pointer';
         });

         map.on('mouseleave', 'Sons', function () {
           map.getCanvas().style.cursor = '';
         });

          map.setLayoutProperty('Sons', 'icon-size', 
         ['interpolate', ['linear'], ['zoom'],11,0.1,14,0.65]);
         
       });

     });
   };     
   
   // FOTOS

   function makeGeoJSON2(csvData) {
     csv2geojson.csv2geojson(csvData, {
       latfield: 'Latitude',
       lonfield: 'Longitude',
       delimiter: ','
     }, function (err, data) {
       
       map.on('load', function () {
                   
         map.loadImage(
          'assets/fotos.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('f1', image);
         });
         
         map.loadImage(
          'assets/fotos2.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('f2', image);
         });
           
         map.loadImage(
          'assets/fotos3.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('f3', image);
         });
           
         map.loadImage(
          'assets/fotos4.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('f4', image);
         });

         // LAYER
         map.addLayer({
           'id': 'Fotos',
           'type': 'symbol',
           'source': {
             'type': 'geojson',
             'data': data
           },

           'layout': {
             'visibility': 'visible',
             'icon-image': '{Icon}',
             'icon-anchor': 'bottom',
             "icon-allow-overlap": true,
           }
         });        

         map.on('click', 'Fotos', function (e) {
             var coordinates = e.features[0].geometry.coordinates.slice();

             //var description = `<img src="./assets/fotos/foto` + e.features[0].properties.Galeria + `.png" style="width:80%;">`;
             var description = '<a href="../assets/fotos/foto' + e.features[0].properties.Galeria + '_4.png"><img src="../assets/fotos/foto' + e.features[0].properties.Galeria + '_4.png"></a>';
             
             var images =  [
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_1.png'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_2.png'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_3.png'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_4.png']
                   ]
             
             var slideshowContent = ""
             
             for (var i = 0; i < images.length; i++) {
               var img = images[i];

               slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                 '<img src="' + img[0] + '" />' +
                 '</div>';
             }
             
             var popupContent = '<div class="popup">' + 
               '<div class="slideshow">' +
               slideshowContent +
               '</div>' +
               '<div class="cycle">' +
               '<a href="#" class="prev">‹</a>' +
               '<a href="#" class="next">›</a>' +
               '</div>'
             '</div>';
             

             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
             }

            /* mostarda();*/

             //only one popup once 
             e.originalEvent.cancelBubble3 = true;
             if (e.originalEvent.cancelBubble || e.originalEvent.cancelBubble2 || e.originalEvent.cancelBubble4) {
                 return;
             }

              // create the popup
             /*                
             new mapboxgl.Popup({className: 'popupFotos'})
               .setLngLat(coordinates)
               .setPopup(description)
               .addTo(map); */

             
             new mapboxgl.Popup({className: 'popupFotos'})
               .setLngLat(coordinates)
               .setHTML(popupContent)
               .addTo(map); 
         });


         $('#map').on('click', '.popup .cycle a', function () {
         var $slideshow = $('.slideshow'),
           $newSlide;

         if ($(this).hasClass('prev')) {
           $newSlide = $slideshow.find('.active').prev();
           if ($newSlide.index() < 0) {
             $newSlide = $('.image').last();
           }
         } else {
           $newSlide = $slideshow.find('.active').next();
           if ($newSlide.index() < 0) {
             $newSlide = $('.image').first();
           }
         }

         $slideshow.find('.active').removeClass('active').hide();
         $newSlide.addClass('active').show();
         return false;
       }); 

       

         map.on('mouseenter', 'Fotos', function () {
           map.getCanvas().style.cursor = 'pointer';
         });

         map.on('mouseleave', 'Fotos', function () {
           map.getCanvas().style.cursor = '';
         });

          map.setLayoutProperty('Fotos', 'icon-size', 
         ['interpolate', ['linear'], ['zoom'],11,0.1,14,0.65]);
         
       });

     });
   };      
   
   
   function makeGeoJSON(csvData) {
     csv2geojson.csv2geojson(csvData, {
       latfield: 'Latitude',
       lonfield: 'Longitude',
       delimiter: ','
     }, function (err, data) {
     
                     
       map.on('load', function () {
         map.loadImage(
          'assets/video1.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('v1', image);
         });
           
         map.loadImage(
          'assets/video2.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('v2', image);
         });
           
         map.loadImage(
          'assets/video3.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('v3', image);
         });
           
         map.loadImage(
          'assets/video4.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('v4', image);
         });

         // LAYER
         map.addLayer({
           'id': 'Videos',
           'type': 'symbol',
           'source': {
             'type': 'geojson',
             'data': data
           },

           'layout': {
             'visibility': 'visible',
             'icon-image': '{Icon}',
             'icon-anchor': 'bottom',
             "icon-allow-overlap": true,
           }
         });        

         map.on('click', 'Videos', function (e) {
             var coordinates = e.features[0].geometry.coordinates.slice();

             var description = `<iframe src="https://player.vimeo.com/video/`+e.features[0].properties.Link +`?portrait=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;


             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
             }

             /*agua();*/

             //only one popup once 
             e.originalEvent.cancelBubble4 = true;
             if (e.originalEvent.cancelBubble || e.originalEvent.cancelBubble2 || e.originalEvent.cancelBubble3) {
                 return;
             }

             new mapboxgl.Popup({className: 'popupVideo'})
               .setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);
         });

         map.on('mouseenter', 'Videos', function () {
           map.getCanvas().style.cursor = 'pointer';
         });

         map.on('mouseleave', 'Videos', function () {
           map.getCanvas().style.cursor = 'default';
         });

          map.setLayoutProperty('Videos', 'icon-size', 
         ['interpolate', ['linear'], ['zoom'],11,0.1,14,0.65]);
           
       });

     });
   };
   
 });
  
// TOGGLEABLE LAYERS 
// https://stackoverflow.com/questions/61514972/mapbox-visibility-none-for-all-layers-when-one-is-visible

 // enumerate ids of the layers
 var toggleableLayerIds = ['Sons', 'Videos', 'Fotos', 'Receitas', 'O Cheiro do Gosto'];

 // set up the corresponding toggle button for each layer
 for (var i = 0; i < toggleableLayerIds.length; i++) {
     var id = toggleableLayerIds[i];
       var link = document.createElement('a');
       link.href = '#';
       link.className = '';
       if (i === 4) {
         link.className = 'title';
       }
       link.textContent = id;
/*
       if (i === 0) { ficha("var(--rosa)"); }
       if (i === 1) { ficha("var(--agua)"); }
       if (j === 2) { ficha("var(--mostarda)"); }
       if (i === 3) { ficha("var(--marrom)"); }
       creme(); 
*/
     link.onclick = function(e) {
         var clickedLayer = this.textContent;
         e.preventDefault();
         e.stopPropagation(); 
         for (var j = 0; j < toggleableLayerIds.length; j++) {
             if (clickedLayer === toggleableLayerIds[j]) {
                 //layers.children[j].className = 'active';
                 map.setLayoutProperty(toggleableLayerIds[j], 'visibility', 'visible');
                    if (j == 0) { ficha("var(--rosa)"); }
                    if (j == 1) { ficha("var(--agua)"); }
                    if (j == 2) { ficha("var(--mostarda)"); }
                    if (j == 3) { ficha("var(--marrom)"); }
               if (j == 4) { 
                   creme(); 
                   map.setLayoutProperty(toggleableLayerIds[0], 'visibility', 'visible');
                   map.setLayoutProperty(toggleableLayerIds[1], 'visibility', 'visible');
                   map.setLayoutProperty(toggleableLayerIds[2], 'visibility', 'visible');
                   map.setLayoutProperty(toggleableLayerIds[3], 'visibility', 'visible');
               }
             }	
             else {
               if (j != 4) {
                 //layers.children[j].className = '';
                 map.setLayoutProperty(toggleableLayerIds[j], 'visibility', 'none');
               }
             }
         }
     };

     var layers = document.getElementById('menu');
     layers.appendChild(link);
     }


   // SANTA TEREZA
    
     map.on('load', () => {
         map.addSource('radar', {
             'type': 'image',
             'url': 'assets/santa_tereza.png',
             'coordinates': [
                 
                 [-43.927630, -19.9], //noroeste [oeste, norte]
                 [-43.9, -19.9], //nordeste [leste, norte]
                 [-43.9, -19.921], //sudeste  [leste, sul]
                 [-43.927630, -19.921] //sudoeste  [oeste, sul]             
             ]
             })
             map.addLayer({
                 id: 'radar-layer',
                 'type': 'raster',
                 'source': 'radar',
                 'paint': {
                 'raster-fade-duration': 0
             }
         });
         
         
     }); 
   
         
   // CONCORDIA
    
     map.on('load', () => {
         map.addSource('concordia', {
             'type': 'image',
             'url': 'assets/concordia.png',
             'coordinates': [
                 [-43.945709, -19.88],
                 [-43.925, -19.88], 
                 [-43.925, -19.905], 
                 [-43.945709, -19.905] 
               
             ]
             })
             map.addLayer({
                 id: 'represa-layer',
                 'type': 'raster',
                 'source': 'concordia',
                 'paint': {
                 'raster-fade-duration': 0
             }
         });
         
         
     }); 

        // PAPAGAIO
    
        map.on('load', () => {
         map.addSource('papagaio', {
             'type': 'image',
             'url': 'assets/papagaio.png',
             'coordinates': [
                 [-43.96, -19.9476],
                 [-43.94033, -19.9476], 
                 [-43.94033, -19.98], 
                 [-43.96, -19.98] 
               
             ]
             })
             map.addLayer({
                 id: 'papagaio-layer',
                 'type': 'raster',
                 'source': 'papagaio',
                 'paint': {
                 'raster-fade-duration': 0
             }
         });
         
         
     }); 

        // AREIAS
    
        map.on('load', () => {
         map.addSource('areias', {
             'type': 'image',
             'url': 'assets/areias.png',
             'coordinates': [
                 [-44.018, -19.748],
                 [-43.978, -19.748], 
                 [-43.978, -19.777], 
                 [-44.018, -19.777] 
               
             ]
             })
             map.addLayer({
                 id: 'areias-layer',
                 'type': 'raster',
                 'source': 'areias',
                 'paint': {
                 'raster-fade-duration': 0
             }
         });
         
         
     });      
   
// ZOOM
   map.addControl(new mapboxgl.NavigationControl(), 'top-right'); // disable map zoom when using scroll
 //  map.scrollZoom.disable(); 
 
   
   //IMAGENS      
   //seta papagaio
   map.on('load', () => {
     // Load an image from an external URL.
     map.loadImage(
     'assets/seta_papagaio.png',
         (error, image) => {
             if (error) throw error;

             // Add the image to the map style.
             map.addImage('seta_papagaio', image);

             // Add a data source containing one point feature.
             map.addSource('point', {
                 'type': 'geojson',
                 'data': {
                     'type': 'FeatureCollection',
                     'features': [
                     {
                         'type': 'Feature',
                         'geometry': {
                         'type': 'Point',
                         'coordinates': [-43.956, -19.973]
                         }
                     }]
                 }
             });

             // Add a layer to use the image to represent the data.
             map.addLayer({
                 'id': 'seta_papagaio',
                 'type': 'symbol',
                 'source': 'point', 
                 'layout': {
                     'icon-anchor': 'bottom', 
                     "icon-allow-overlap": true,
                     'icon-image': 'seta_papagaio',
                     'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.2, 18, 1.2]
                 }
             });
         }
     );

 });

  // seta santa tereza
  map.on('load', () => {
     // Load an image from an external URL.
     map.loadImage(
     'assets/seta_santa_tereza.png',
         (error, image) => {
             if (error) throw error;

             // Add the image to the map style.
             map.addImage('seta_santa_tereza', image);

             // Add a data source containing one point feature.
             map.addSource('point2', {
                 'type': 'geojson',
                 'data': {
                     'type': 'FeatureCollection',
                     'features': [
                     {
                         'type': 'Feature',
                         'geometry': {
                         'type': 'Point',
                         'coordinates': [-43.921211, -19.916446]
                         }
                     }]
                 }
             });

             // Add a layer to use the image to represent the data.
             map.addLayer({
                 'id': 'seta_santa_tereza',
                 'type': 'symbol',
                 'source': 'point2', 
                 'layout': {
                     'icon-anchor': 'top-right', 
                     "icon-allow-overlap": true,
                     'icon-image': 'seta_santa_tereza',
                     'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.1, 18, 1.2]
                 }
             });
         }
     );

 });


  // seta concordia
  map.on('load', () => {
     // Load an image from an external URL.
     map.loadImage(
     'assets/seta_concordia.png',
         (error, image) => {
             if (error) throw error;

             // Add the image to the map style.
             map.addImage('seta_concordia', image);

             // Add a data source containing one point feature.
             map.addSource('point3', {
                 'type': 'geojson',
                 'data': {
                     'type': 'FeatureCollection',
                     'features': [
                     {
                         'type': 'Feature',
                         'geometry': {
                         'type': 'Point',
                         'coordinates': [-43.941908, -19.890846]
                         }
                     }]
                 }
             });

             // Add a layer to use the image to represent the data.
             map.addLayer({
                 'id': 'seta_concordia',
                 'type': 'symbol',
                 'source': 'point3', 
                 'layout': {
                     'icon-anchor': 'bottom-left', 
                     "icon-allow-overlap": true,
                     'icon-image': 'seta_concordia',
                     'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.22, 18, 1.1]
                 }
             });
         }
     );

 });

  // seta areias
  map.on('load', () => {
     // Load an image from an external URL.
     map.loadImage(
     'assets/seta_areias.png',
         (error, image) => {
             if (error) throw error;

             // Add the image to the map style.
             map.addImage('seta_areias', image);

             // Add a data source containing one point feature.
             map.addSource('point4', {
                 'type': 'geojson',
                 'data': {
                     'type': 'FeatureCollection',
                     'features': [
                     {
                         'type': 'Feature',
                         'geometry': {
                         'type': 'Point',
                         'coordinates': [-43.984135, -19.770205]
                         }
                     }]
                 }
             });

             // Add a layer to use the image to represent the data.
             map.addLayer({
                 'id': 'seta_areias',
                 'type': 'symbol',
                 'source': 'point4', 
                 'layout': {
                     'icon-anchor': 'top-right', 
                     "icon-allow-overlap": true,
                     'icon-image': 'seta_areias',
                     'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.22, 18, 1.1]
                 }
             });
         }
     );

 });

 // map.scrollZoom.disable(); 

/*
function marrom() {
document.getElementById("ficha").style.backgroundColor = "var(--marrom)";
document.getElementById("mySidebar").style.backgroundColor = "var(--marrom)";
document.getElementById("mySidebar").style.color = "var(--creme)";
document.getElementById("closebtn").style.color = "var(--creme)";
}

function mostarda() {
document.getElementById("ficha").style.backgroundColor = "var(--mostarda)";
document.getElementById("mySidebar").style.backgroundColor = "var(--mostarda)";
document.getElementById("mySidebar").style.color = "var(--creme)";
document.getElementById("closebtn").style.color = "var(--creme)";
}

function agua() {
document.getElementById("ficha").style.backgroundColor = "var(--agua)";
document.getElementById("mySidebar").style.backgroundColor = "var(--agua)";
document.getElementById("mySidebar").style.color = "var(--creme)";
document.getElementById("closebtn").style.color = "var(--creme)";
}

function rosa() {
document.getElementById("ficha").style.backgroundColor = "var(--rosa)";
document.getElementById("mySidebar").style.backgroundColor = "var(--rosa)";
document.getElementById("mySidebar").style.color = "var(--creme)";
document.getElementById("closebtn").style.color = "var(--creme)";
}*/

/*
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
coll[i].addEventListener("click", function() {
 this.classList.toggle("active");
 var content = this.nextElementSibling;
 if (content.style.display === "block") {
   content.style.display = "none";
 } else {
   content.style.display = "block";
 }
});
}*/