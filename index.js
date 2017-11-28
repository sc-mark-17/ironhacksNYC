// //--------------------------Google maps--------------------------------------
var map;
function initMap() {
    central = {lat: 40.7291, lng:-73.9965};
/*	central = new google.maps.LatLng(40.7291, -73.9965);*/
        map = new google.maps.Map(document.getElementById('map'), {
        	zoom: 12,
        	center: central,
			mapTypeControl: false
        }); 
		/*establece tipo de mapa satellite, roadmap, hybrid, terrain*/
		// map.setMapTypeId('satellite');
		
		/*Marca para la coordenada dada*/
		var marker = new google.maps.Marker({
			position: central,
			map: map,
            icon: 'https://png.icons8.com/university-filled/ios7/60/332877'
			 });
    
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        var centerControl = new Zillow(centerControlDiv, map);
        centerControlDiv.index = 2;
        var museum = new Museum(centerControlDiv, map);
        centerControlDiv.index = 3;
        var fireDepartment = new FireDepartments(centerControlDiv, map);
        centerControlDiv.index = 4;
        var artGallery = new ArtGallery(centerControlDiv, map);
        centerControlDiv.index = 5;
        var vaccinations = new Vaccinations(centerControlDiv, map);
        centerControlDiv.index = 6;
        var alternativeFuelStation  = new AlternativeFuelStation(centerControlDiv, map);
        centerControlDiv.index = 7;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
    
		//RUTA DE CICLA
		// var bikeLayer = new google.maps.BicyclingLayer();
		//   bikeLayer.setMap(map);
}
//--------------------------Fin Google maps---------------------------------

//---------------------------datasets---------------------
/*PENDIENTE POR PROGRAMAR OJOOOOOOOOOOOOOOOOOOOOOOOOOO
function getDataWeather() {
	var URLWeather = "https://www.ncdc.noaa.gov/cdo-web/api/v2/locations";
	var dataWeather = "FIPS:061&limit=10&offset=12000&sortfield=name";
	var tokenWeather = "VxJvyeGkrrpbwvtFRIqCxVHxfEvqUkcb";
	getDataFromURL(URLWeather, dataWeather, tokenWeather, "json");
    
    
    OBTENER DATOS DE UNA URL
function getDataFromURL(URL, dataU, tokenU, typeU){
	var data = $.ajax({
			type:"GET",
			url: URL,
			data: dataU,
			headers: {token: tokenU},
			dataType: typeU
		})

	.done(function(){
		if (typeU === "xml") {
			data = xmlToJson($.parseXML(data.responseText));
		}
		console.log(data);
        return data;
		// si sale bien
	})

	.fail(function(error){
		console.log(error);
		// si sale mal
	})
    
    .always(function(){
        console.log("Hecho.....Procesado");
    })
}

}
*/

var AZillow = [];
function getDataZillow() {
	var xZillow = $.get("http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz18wmjk4ti4r_728x4&address=NewYork&citystatezip=NY/NYC/100")
        .done(function(){
            var jZillow = xmlToJson($.parseXML(xZillow.responseText));
            for(var i = 0; i < (jZillow["SearchResults:searchresults"].response.results.result).length; i++){
                var latitud = jZillow["SearchResults:searchresults"].response.results.result[i].address.latitude;
                var longitud = jZillow["SearchResults:searchresults"].response.results.result[i].address.longitude;
                var lalg = new google.maps.LatLng(latitud, longitud);
                var marker = new google.maps.Marker({
                    position: lalg,
                    map: map,
                    icon: 'https://png.icons8.com/bed-filled/ios7/22/8b4513'
                     });
                AZillow.push(marker);
                
            } /*console.log(jZillow["SearchResults:searchresults"].response.results.result);*///.result[0].address);
            // si sale bien
        })

        .fail(function(error){
            console.log(error);
            // si sale mal
        })
}
function remZillow(){
    for (var i = 0; i < AZillow.length; i++) {
          AZillow[i].setMap(null);
        }
}

var AMuseums = [];
function getDataMuseum() {
	var JMuseums = $.get("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD")
        .done(function(){
            for(var i = 0; i < (JMuseums.responseJSON.data).length; i++){
                var pS = JMuseums.responseJSON.data[i][8];
                var pos = pS.split("(")[1].split(")")[0].split(" ");
                var lalg = new google.maps.LatLng(pos[1], pos[0]);
                var marker = new google.maps.Marker({
                    position: lalg,
                    map: map,
                    icon: 'https://png.icons8.com/museum/color/22/000000'
                     });
                AMuseums.push(marker);
            }
        })
        
        .fail(function(error){
              console.log(error);
              });
}
function remMuseums(){
    for (var i = 0; i < AMuseums.length; i++) {
          AMuseums[i].setMap(null);
        }
}

var AFireDepartments = [];
function getFireDepartments() {
	var JFireDepartments = $.get("https://data.ny.gov/api/views/qfsu-zcpv/rows.json?accessType=DOWNLOAD")
        .done(function(){
            for(var i = 0; i < (JFireDepartments.responseJSON.data).length; i++){
                if(JFireDepartments.responseJSON.data[i][8].includes("NEW YORK CITY")){
                    var latitude = JFireDepartments.responseJSON.data[i][17];
                    var longitude = JFireDepartments.responseJSON.data[i][18];
                    var lalg = new google.maps.LatLng(latitude, longitude);
                    var marker = new google.maps.Marker({
                        position: lalg,
                        map: map,
                        icon: 'https://png.icons8.com/firefighter-filled/ios7/40/c0392b'
                         });
                    AFireDepartments.push(marker);
                }
            }

            console.log(JFireDepartments.responseJSON.data);
        })
        
        .fail(function(error){
              console.log(error);
              });
}
function remFireDepartments(){
    for (var i = 0; i < AFireDepartments.length; i++) {
          AFireDepartments[i].setMap(null);
        }
}

var markersArtGallery = [];
var markerClusterArtGallery;
function getArtGallery() {
	var JArtGallery = $.get("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD")
        .done(function(){
           for(var i = 0; i < (JArtGallery.responseJSON.data).length; i++){
                var pS = JArtGallery.responseJSON.data[i][9];
                var pos = pS.split("(")[1].split(")")[0].split(" ");
                var lalg = new google.maps.LatLng(pos[1], pos[0]);
                var marker = new google.maps.Marker({'position': lalg,
                                                    icon: 'https://png.icons8.com/art-prices-filled/ios7/40/551a8b'});
                markersArtGallery.push(marker);
              }
                      
            markerClusterArtGallery = new MarkerClusterer(map, markersArtGallery,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            /*console.log(JArtGallery.responseJSON.data[0]);*/
        })
        
        .fail(function(error){
              console.log(error);
              });
}
function remArtGallery(){
            markerClusterArtGallery.clearMarkers();
            markersArtGallery = [];
}

var markersVaccinations = [];
var markerClusterVaccinations;
function getVaccinations() {
	var JVaccinations = $.get("https://data.cityofnewyork.us/api/views/w9ei-idxz/rows.json?accessType=DOWNLOAD")
        .done(function(){
            for(var i = 0; i < (JVaccinations.responseJSON.data).length; i++){
                var latitude = JVaccinations.responseJSON.data[i][19];
                var longitude = JVaccinations.responseJSON.data[i][20];
                var lalg = new google.maps.LatLng(latitude, longitude);
                var marker = new google.maps.Marker({'position': lalg,
                                                icon: 'https://png.icons8.com/syringe-filled/ios7/40/9b0000'});
                markersVaccinations.push(marker);
            }

            markerClusterVaccinations = new MarkerClusterer(map, markersVaccinations,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            //console.log(JVaccinations.responseJSON.data[0]);
        })
        
        .fail(function(error){
              console.log(error);
              });
}
function remVaccinations(){
            markerClusterVaccinations.clearMarkers();
            markersVaccinations = [];
}

var markersAlternativeFuelStation = [];
var markerClusterAlternativeFuelStation;
function getAlternativeFuelStation() {
	var JAlternativeFuelStation = $.get("https://data.ny.gov/api/views/bpkx-gmh7/rows.json?accessType=DOWNLOAD")
        .done(function(){
            for(var i = 0; i < (JAlternativeFuelStation.responseJSON.data).length; i++){
                 var latitude = JAlternativeFuelStation.responseJSON.data[i][32];
                    var longitude = JAlternativeFuelStation.responseJSON.data[i][33];
                    var lalg = new google.maps.LatLng(latitude, longitude);
                var marker = new google.maps.Marker({'position': lalg,
                                                icon: 'https://png.icons8.com/gas-station-filled/ios7/53/2ecc71'});
                markersAlternativeFuelStation.push(marker);
            }

            markerClusterAlternativeFuelStation = new MarkerClusterer(map, markersAlternativeFuelStation,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                
           // console.log(JAlternativeFuelStation.responseJSON.data);
        })
        
        .fail(function(error){
              console.log(error);
              });
}
function remAlternativeFuelStation(){
     markerClusterAlternativeFuelStation.clearMarkers();
            markersAlternativeFuelStation = [];
}

//---------------------Cargar del DOM primero-----------------
$(document).ready( function(){
    $('.carousel').carousel({
      interval: 5000
    })
});
//------------------------Fin datasets----------------------

//---------------------------funciones dentro del mapa--------------------
function styleControlUI(title){
        var d = document.createElement('div');
        d.style.backgroundColor = '#00BFFF';
        d.style.borderRadius = '30px';
        d.style.cursor = 'pointer';
        d.style.marginBottom = '2px';
        d.style.textAlign = 'center';
        d.title = title;
    return d;
}

function styleControlText(label){
        var cT = document.createElement('div');
        cT.style.color = 'white';
        cT.style.fontFamily = 'Roboto,Arial,sans-serif';
        cT.style.fontSize = '15px';
        cT.style.lineHeight = '25px';
        cT.style.paddingLeft = '5px';
        cT.style.paddingRight = '5px';
        cT.innerHTML = label;
    return cT;
}

function CenterControl(controlDiv, map) {
        var controlUI = new styleControlUI('Click to recenter the map');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Center Map');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
          map.setCenter(central);
        });
      }

function Zillow(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Lodging');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Lodging');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(AZillow.length > 0){
                remZillow();
                AZillow = [];
            }else{
                getDataZillow();
            }
        });
      }

function Museum(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Museums');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Museums');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(AMuseums.length > 0){
                remMuseums();
                AMuseums = [];
            }else{
                getDataMuseum();
            }
        });
      }

function FireDepartments(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Fire Departments');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Fire Departments');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(AFireDepartments.length > 0){
                remFireDepartments();
                AFireDepartments = [];
            }else{
                getFireDepartments();
            }
        });
}

function ArtGallery(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Art Gallery');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Art Gallery');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(markersArtGallery.length > 0){
                remArtGallery();
            }else{
                getArtGallery();
            }
        });
      }

function Vaccinations(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Vaccinations');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Vaccinations');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(markersVaccinations.length > 0){
                remVaccinations();
            }else{
                getVaccinations();
            }
        });
}

function AlternativeFuelStation(controlDiv, map) {
        var controlUI = new styleControlUI('Click to Alternative Fuel Station');
        controlDiv.appendChild(controlUI);
        var controlText = new styleControlText('Alternative Fuel Station');
        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', function() {
            if(markersAlternativeFuelStation.length > 0){
                remAlternativeFuelStation();
            }else{
                getAlternativeFuelStation();
            }
        });
      }
//---------------------------FIN funciones dentro del mapa--------------------

//---------------------------------  D3.JS  ---------------------------------------

//--------------------------------- FIN D3.JS  ---------------------------------------