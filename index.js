// //--------------------------Google maps--------------------------------------
var map;
var central;
function initMap() {
    "use strict";
    //2 formas de establecer las coordenadas
    central = {lat: 40.7291, lng: -73.9965};
    /*central = new google.maps.LatLng(40.7291, -73.9965);*/
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: central,
        mapTypeControl: false
            });
    /*Marca para la coordenada dada*/
    new google.maps.Marker({
        position: central,
        map: map,
        icon: "https://png.icons8.com/university-filled/ios7/60/332877"//se usa iconos
    });

    //Se crea un div para colocar los botones
    var centerControlDiv = document.createElement("div");
    //se llaman las funciones que crean los botones, se les pasa el div padre
    // y el mapa al cual se vana ha agregar
    CenterControl(centerControlDiv, map);
    Zillow(centerControlDiv, map);
    Museum(centerControlDiv, map);
    FireDepartments(centerControlDiv, map);
    ArtGallery(centerControlDiv, map);
    Vaccinations(centerControlDiv, map);
    AlternativeFuelStation(centerControlDiv, map);
    //se push el div padre a los controles del mapa y se posiciona arriba derecha
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    //RUTA DE CICLA
    // var bikeLayer = new google.maps.BicyclingLayer();
    //bikeLayer.setMap(map);
}
//--------------------------Fin Google maps---------------------------------

//---------------------------datasets---------------------
//PENDIENTE POR PROGRAMAR OJOOOOOOOOOOOOOOOOOOOOOOOOOO
/*function getDataWeather() {
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
//infromacion de viviendas en arriendo
var AZillow = [];
function getDataZillow() {
    var xZillow = $.get("http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz18wmjk4ti4r_728x4&address=NewYork&citystatezip=NY/NYC/100")
    .done(function(){
        var jZillow = xmlToJson($.parseXML(xZillow.responseText));
        jZillow["SearchResults:searchresults"].response.results.result.forEach(function(value){
            var latitud = value.address.latitude;
            var longitud = value.address.longitude;
            var lalg = new google.maps.LatLng(latitud, longitud);
            var marker = new google.maps.Marker({
                position: lalg,
                map: map,
                icon: "https://png.icons8.com/bed-filled/ios7/22/8b4513"
            });
            AZillow.push(marker);
        });
    })

    .fail(function(error){
        console.log(error);
    });
}
//borra iconoc
function remZillow() {
    AZillow.forEach(function(value){
      value.setMap(null);
  });
}

var AMuseums = [];
function getDataMuseum() {
    var JMuseums = $.get("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD")
    .done(function(){
        JMuseums.responseJSON.data.forEach(function(value){
            var pS = value[8];
            var pos = pS.split("(")[1].split(")")[0].split(" ");
            var lalg = new google.maps.LatLng(pos[1], pos[0]);
            var marker = new google.maps.Marker({
                position: lalg,
                map: map,
                icon: "https://png.icons8.com/museum/color/22/000000"
            });
            AMuseums.push(marker);
        });
    })

    .fail(function(error){
      console.log(error);
  });
}

function remMuseums(){
    AMuseums.forEach(function(value){
     value.setMap(null);
 });
}

var AFireDepartments = [];
function getFireDepartments() {
    var JFireDepartments = $.get("https://data.ny.gov/api/views/qfsu-zcpv/rows.json?accessType=DOWNLOAD")
    .done(function(){
        JFireDepartments.responseJSON.data.forEach(function(value){
            if(value[8].includes("NEW YORK CITY")){
                var latitude = value[17];
                var longitude = value[18];
                var lalg = new google.maps.LatLng(latitude, longitude);
                var marker = new google.maps.Marker({
                    position: lalg,
                    map: map,
                    icon: "https://png.icons8.com/firefighter-filled/ios7/40/c0392b"
                });
                AFireDepartments.push(marker);
            }
        });
    })

    .fail(function(error){
      console.log(error);
  });
}

function remFireDepartments(){
    AFireDepartments.forEach(function(value){
        value.setMap(null);
    });
}

var markersArtGallery = [];
var markerClusterArtGallery;
function getArtGallery() {
    var JArtGallery = $.get("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD")
    .done(function(){
        JArtGallery.responseJSON.data.forEach(function(value){
            var pS = value[9];
            var pos = pS.split("(")[1].split(")")[0].split(" ");
            var lalg = new google.maps.LatLng(pos[1], pos[0]);
            var marker = new google.maps.Marker({"position": lalg,
                icon: "https://png.icons8.com/art-prices-filled/ios7/40/551a8b"});
            markersArtGallery.push(marker);
        });
        markerClusterArtGallery = new MarkerClusterer(map, markersArtGallery,
            {imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"});
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
        JVaccinations.responseJSON.data.forEach(function(value){
            var latitude = value[19];
            var longitude = value[20];
            var lalg = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({"position": lalg,
                icon: "https://png.icons8.com/syringe-filled/ios7/40/9b0000"});
            markersVaccinations.push(marker);
        });
        markerClusterVaccinations = new MarkerClusterer(map, markersVaccinations,
            {imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"});
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
        JAlternativeFuelStation.responseJSON.data.forEach(function(value){
            var latitude = value[32];
            var longitude = value[33];
            var lalg = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({"position": lalg,
                icon: "https://png.icons8.com/gas-station-filled/ios7/53/2ecc71"});
            markersAlternativeFuelStation.push(marker);
        });
        markerClusterAlternativeFuelStation = new MarkerClusterer(map, markersAlternativeFuelStation,
            {imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"});
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
    $(".carousel").carousel({
      interval: 5000
  });
});
//------------------------Fin datasets----------------------

//---------------------------funciones dentro del mapa--------------------

//estilo de los botones
function styleControlUI(title){
    var d = document.createElement("div");
    d.style.backgroundColor = "#00BFFF";
    d.style.borderRadius = "30px";
    d.style.cursor = "pointer";
    d.style.marginBottom = "2px";
    d.style.textAlign = "center";
    d.title = title;
    return d;
}
//estilo del texto
function styleControlText(label){
    var cT = document.createElement("div");
    cT.style.color = "white";
    cT.style.fontFamily = "Roboto,Arial,sans-serif";
    cT.style.fontSize = "15px";
    cT.style.lineHeight = "25px";
    cT.style.paddingLeft = "5px";
    cT.style.paddingRight = "5px";
    cT.innerHTML = label;
    return cT;
}
//
function CenterControl(controlDiv, map) {
    var controlUI = new styleControlUI("Click to recenter the map");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Center Map");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
      map.setCenter(central);
  });
}

function Zillow(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Lodging");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Lodging");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
        if(AZillow.length > 0){
            remZillow();
            AZillow = [];
        }else{
            getDataZillow();
        }
    });
}

function Museum(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Museums");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Museums");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
        if(AMuseums.length > 0){
            remMuseums();
            AMuseums = [];
        }else{
            getDataMuseum();
        }
    });
}

function FireDepartments(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Fire Departments");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Fire Departments");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
        if(AFireDepartments.length > 0){
            remFireDepartments();
            AFireDepartments = [];
        }else{
            getFireDepartments();
        }
    });
}

function ArtGallery(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Art Gallery");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Art Gallery");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
        if(markersArtGallery.length > 0){
            remArtGallery();
        }else{
            getArtGallery();
        }
    });
}

function Vaccinations(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Vaccinations");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Vaccinations");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
        if(markersVaccinations.length > 0){
            remVaccinations();
        }else{
            getVaccinations();
        }
    });
}

function AlternativeFuelStation(controlDiv, map) {
    var controlUI = new styleControlUI("Click to Alternative Fuel Station");
    controlDiv.appendChild(controlUI);
    var controlText = new styleControlText("Alternative Fuel Station");
    controlUI.appendChild(controlText);
    controlUI.addEventListener("click", function() {
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