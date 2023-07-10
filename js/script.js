
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

 const bounds = [
     [-43.5, -20.5],  // sudoeste coordinates     -20.0549/-43.8534
     [-44.5, -19.5] // nordeste coordinates     -19.7188/-44.0452   
 ];
 var map = new mapboxgl.Map({
   container: 'map', // container id
   style: 'mapbox://styles/saralgc/clhkcc2vc01lp01qy8fmi7wmn',
   center: [-43.95857, -19.87472], // starting position
   zoom: 11.3, // starting zoom
   minZoom: 11.2,
   maxZoom: 13.5,  
   pitch: 0, // pitc3 in degrees
   bearing: -92, // bearing in degrees
   transformRequest: transformRequest
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
          'assets/receita_milho.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_milho', image);
         });
           
         map.loadImage(
          'assets/receita_chuchu.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_chuchu', image);
         });  
           
         map.loadImage(
          'assets/receita_banana.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_banana', image);
         });
           
         map.loadImage(
          'assets/receita_panela.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_panela', image);
         });
           
         map.loadImage(
          'assets/receita_jilo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_jilo', image);
         });    
            
         map.loadImage(
          'assets/receita_couve.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_couve', image);
         });  

         map.loadImage(
          'assets/receita_quiabo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_quiabo', image);
         }); 

         map.loadImage(
          'assets/receita_feijao.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('receita_feijao', image);
         }); 


         // LAYER
         map.addLayer({
           'id': 'Receitar',
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

         map.on('click', 'Receitar', function (e) {
             var coordinates = e.features[0].geometry.coordinates.slice();

             //var description = `<h2>`+e.features[0].properties.Titulo +`</h2><p>INGREDIENTES</p><p>`+e.features[0].properties.Ingredientes +`</p><br><p>PREPARO</p><p>`+e.features[0].properties.Receita +`</p>`;
             var description = `<p>` + e.features[0].properties.Texto + `</p>`;
             
             closeNav();

             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
             }
             
             //only one popup once 
             e.originalEvent.cancelBubble = true;

             if (e.originalEvent.cancelBubble2 || e.originalEvent.cancelBubble3 || e.originalEvent.cancelBubble4) {
                 return;
             }

             new mapboxgl.Popup({closeButton: true, className: 'popupReceitas'})
               .setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);

         });

         map.on('mouseenter', 'Receitar', function () {
           map.getCanvas().style.cursor = 'pointer';
         });

         map.on('mouseleave', 'Receitar', function () {
           map.getCanvas().style.cursor = '';
         });

          map.setLayoutProperty('Receitar', 'icon-size', 
         ['interpolate', ['linear'], ['zoom'],11,0.05,14,0.25]);
         
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
          'assets/som_frango.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_frango', image);
         });
         
         map.loadImage(
          'assets/som_faca.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_faca', image);
         });
           
         map.loadImage(
          'assets/som_bacalhau.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_bacalhau', image);
         });
           
         map.loadImage(
          'assets/som_ovo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_ovo', image);
         });
           
         map.loadImage(
          'assets/som_banana.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_banana', image);
         });
           
         map.loadImage(
          'assets/som_couve.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_couve', image);
         });
           
         map.loadImage(
          'assets/som_radio.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_radio', image);
         });
           
         map.loadImage(
          'assets/som_cara.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('som_cara', image);
         });
  
         map.loadImage(
            'assets/som_feijao.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_feijao', image);
           });

           map.loadImage(
            'assets/som_flor.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_flor', image);
           });

           map.loadImage(
            'assets/som_arroz.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_arroz', image);
           });

           map.loadImage(
            'assets/som_quiabo.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_quiabo', image);
           });

           map.loadImage(
            'assets/som_jilo.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_jilo', image);
           });

           map.loadImage(
            'assets/som_laranja.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_laranja', image);
           });

           map.loadImage(
            'assets/som_canela.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_canela', image);
           });

           map.loadImage(
            'assets/som_agriao.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_agriao', image);
           });

           map.loadImage(
            'assets/som_colher.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_colher', image);
           });

           map.loadImage(
            'assets/som_vaca.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_vaca', image);
           });

           map.loadImage(
            'assets/som_mamao.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_mamao', image);
           });

           map.loadImage(
            'assets/som_paudoce.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_paudoce', image);
           });

           map.loadImage(
            'assets/som_sol.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_sol', image);
           });

           map.loadImage(
            'assets/som_gengibre.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_gengibre', image);
           });

           map.loadImage(
            'assets/som_panela.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_panela', image);
           });

           map.loadImage(
            'assets/som_porco.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_porco', image);
           });

           map.loadImage(
            'assets/som_salsinha.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_salsinha', image);
           });


           map.loadImage(
            'assets/som_alho.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_alho', image);
           });

           map.loadImage(
            'assets/som_fogo.png',
             function(error, image) {
             if (error) throw error;
             map.addImage('som_fogo', image);
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

             new mapboxgl.Popup({closeButton: false, className: 'popupSom'})
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
         ['interpolate', ['linear'], ['zoom'],11,0.05,14,0.25]);
         
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
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_1.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_2.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_3.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_4.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_5.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_6.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_7.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_8.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_9.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_10.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_11.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_12.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_13.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_14.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_15.jpg'],
                   ['assets/fotos/foto' + e.features[0].properties.Galeria + '_16.jpg']
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
               '</div>' +
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

             
             new mapboxgl.Popup({closeButton: true, className: 'popupFotos'})
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
         ['interpolate', ['linear'], ['zoom'],11,0.08,14,0.4]);
         
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
          '../assets/video_panela.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_panela', image);
         });
           
         map.loadImage(
          'assets/video_feijao.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_feijao', image);
         });
           
         map.loadImage(
          'assets/video_tambor.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_tambor', image);
         });
           
         map.loadImage(
          '../assets/video_ovo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_ovo', image);
         });
   
         map.loadImage(
          '../assets/video_vaca.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_vaca', image);
         });

         map.loadImage(
          '../assets/video_banana.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_banana', image);
         });

         map.loadImage(
          '../assets/video_fogo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_fogo', image);
         });

         map.loadImage(
          '../assets/video_milho.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_milho', image);
         });

         map.loadImage(
          '../assets/video_quiabo.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_quiabo', image);
         });

         map.loadImage(
          '../assets/video_paudoce.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_paudoce', image);
         });

         map.loadImage(
          '../assets/video_porco.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_porco', image);
         });


         map.loadImage(
          '../assets/video_pimenta.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_pimenta', image);
         });


         map.loadImage(
          '../assets/video_arroz.png',
           function(error, image) {
           if (error) throw error;
           map.addImage('video_arroz', image);
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

             new mapboxgl.Popup({closeButton: false, className: 'popupVideo'})
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
         ['interpolate', ['linear'], ['zoom'],11,0.07,14,0.3]);
           
       });

     });
   };
   
 });
  
// TOGGLEABLE LAYERS 
// https://stackoverflow.com/questions/61514972/mapbox-visibility-none-for-all-layers-when-one-is-visible

 // enumerate ids of the layers
 var toggleableLayerIds = ['Sons', 'Videos', 'Fotos', 'Receitar', 'O Cheiro do Gosto'];

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
    map.addSource('papagaio_seta', {
        'type': 'image',
        'url': 'assets/seta_papagaio.png',
        'coordinates': [
            [-43.955, -19.96],
            [-43.98, -19.96], 
            [-43.98, -19.97], 
            [-43.955, -19.97] 
        ]
        })
        map.addLayer({
            id: 'papagaio-seta',
            'type': 'raster',
            'source': 'papagaio_seta',
            'paint': {
            'raster-fade-duration': 0
        }
    });
    
    
}); 

  // seta santa tereza
    
  map.on('load', () => {
    map.addSource('santa_tereza_seta', {
        'type': 'image',
        'url': 'assets/seta_santa_tereza.png',
        'coordinates': [
            [-43.92, -19.91],
            [-43.91, -19.91], 
            [-43.91, -19.935], 
            [-43.92, -19.935] 
        ]
        })
        map.addLayer({
            id: 'santa_tereza-seta',
            'type': 'raster',
            'source': 'santa_tereza_seta',
            'paint': {
            'raster-fade-duration': 0
        }
    });
    
    
}); 


  // seta concordia [-43.941908, -19.890846] || -19.85	-43.985
   
  map.on('load', () => {
    map.addSource('concordia_seta', {
        'type': 'image',
        'url': 'assets/seta_concordia.png',
        'coordinates': [
            [-43.98, -19.85],
            [-43.94, -19.85], 
            [-43.94, -19.89], 
            [-43.98, -19.89] 
        ]
        })
        map.addLayer({
            id: 'concordia-seta',
            'type': 'raster',
            'source': 'concordia_seta',
            'paint': {
            'raster-fade-duration': 0
        }
    });
    
    
}); 

  // seta areias -19.81	-43.92 || [-43.984135, -19.770205]
  map.on('load', () => {
    map.addSource('areias_seta', {
        'type': 'image',
        'url': 'assets/seta_areias.png',
        'coordinates': [
            [-43.999, -19.755],
            [-43.925, -19.755], 
            [-43.925, -19.795], 
            [-43.999, -19.795] 
        ]
        })
        map.addLayer({
            id: 'areias-seta',
            'type': 'raster',
            'source': 'areias_seta',
            'paint': {
            'raster-fade-duration': 0
        }
    });
    
    
}); 

 // map.scrollZoom.disable(); 