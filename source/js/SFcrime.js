require('babel-polyfill');
let styles = require('./styles.js');
let addMarkers = require('./addMarkers.js');
let getCircle = require('./getCircle.js');
let markerIcon = require('./markerIcons.js');
let heatmaps = require('./heatmaps.js');
//constants for indices of vehicle_theft_data element fields 
const DATA = {'LONGITUDE':0,'LATITUDE':1,'DISTRICT':2};
const LEVEL = {'DISTRICT':13,'HEAT_MAP':14,'UNIQUE_MARKER':15}
const baseurl = '/google-maps-sf-crime-vis';
var vehicle_theft_data;
var vehicle_theft_date_data;
var vehicle_theft_district_data;
var sf_district_bios;
var lastValidCenter;
var curZoomLevel = 13;
var district_markers = [];
var map;
// bounds of the desired area
const allowedBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(37.590059187414685, -122.63448208007815),
    new google.maps.LatLng(37.80174049420249, -122.3091720214844)
);

//only one infowindow needed to avoid clutter
var infowindow = new google.maps.InfoWindow(
    {
      maxWidth: 340
    });

function addDistrictData(map){
  $.each( vehicle_theft_district_data.PdDistrict, function( i, district){
      var loc = new google.maps.LatLng(vehicle_theft_district_data.Y[i], vehicle_theft_district_data.X[i]);
      var magnitude = vehicle_theft_district_data.Total[i];
      var marker = new MarkerWithLabel({
        position: loc,
        map: map,
        title: district,
        animation: google.maps.Animation.DROP,
        icon: getCircle(magnitude,true),
        labelContent: "<div class='district_font_size'>"+district+"<div class='district_total'>"+magnitude+"</div></div>",
        labelAnchor: new google.maps.Point(50, 10),
        labelClass: "district_labels", 
        labelStyle: {opacity: 0.9},
        labelInBackground: false
      });

      district_markers[i] = marker;

      google.maps.event.addListener(marker, 'dblclick', function() {
          marker.setVisible(false);
          map.setCenter(marker.position);
          map.setZoom(LEVEL.UNIQUE_MARKER);
      });

      google.maps.event.addListener(marker, 'click', function() {
        var district_bio = $('#district_bio');
        if(heatmaps.districtDict[i].getMap() != null){
          heatmaps.districtDict[i].setMap(null);
          marker.setIcon(getCircle(magnitude,true));
          var data = district_bio.data('current_district');
          if(data != undefined && data === district)
            district_bio.addClass('hide');
        }
        else{
          marker.setIcon(getCircle(magnitude,false));
          heatmaps.districtDict[i].setMap(map);
          district_bio.data('current_district',district);
          district_bio.html(getDistrictBio(district));
          district_bio.removeClass('hide');
        }
      });
    }
  );
}

function initializeHeatMapArray(){
  $.each(vehicle_theft_district_data.PdDistrict, function(i, district){
    heatmaps.districtArray[district] = [];
    heatmaps.districtDict[i] = district;
  });
}

function addHeatMapData(){
  vehicle_theft_data.forEach( (data) =>{
      const lat = data[DATA.LATITUDE];
      const lng = data[DATA.LONGITUDE];
      const district = data[DATA.DISTRICT];
      const location = new google.maps.LatLng(lat, lng); 
      heatmaps.districtArray[district].push(location);
      heatmaps.allArray.push(location);
  });

  heatmaps.finalizeMaps();
  
}

function getDistrictBio(district){
  let foundDistrict = sf_district_bios.find( (obj,i) => {
    if(obj.district === district){
      return true;
    }
  });

  if(foundDistrict){
    let content = document.createElement('div');
      content.className = "bio-window min-width";
      content.innerHTML = `<h3>${district} District Bio<h3>`;
      foundDistrict.neighborhoods.forEach((neighborhood) => {
        let innerDiv = document.createElement('div');
        innerDiv.className = "border-row";
        innerDiv.innerHTML =  `<h4 class="spacing">${neighborhood.name}</h4>
                              <div><p>${neighborhood.description}</p></div>
                              <a href="${neighborhood.url}" target="_blank">Read more</a>`;
                              
        content.appendChild(innerDiv);
      });
      return content;
  }
  
}

function setMarkersVisible(markers, state){
   markers.forEach( (marker) => {
      marker.setVisible(state);
    });
}

function setHeatmapVisible(state){
  heatmaps.setVisible(state ? map : null);
}

function toggleMapStyle(){
  map.setOptions(styles.toggle());
}

function toggleHeatmap() {
  let showMarker = heatmaps.isVisible();
  let showHeatmap = !showMarker;
  setHeatmapVisible(showHeatmap);
  setMarkersVisible(district_markers,showMarker);
}

function toggleMarkers(markers){
  if(markers[0].getVisible())
    setMarkersVisible(markers,false);
  else
    setMarkersVisible(markers,true);
}

function toggleUniqueMarkers(turnOn){
    $('.active-icon').each( (i,icon) => {
      setMarkersVisible(addMarkers.uniqueMarkers[icon.name],turnOn);
    });
}

function toggleDistrictMarkers(){
  toggleMarkers(district_markers);
}

function centerChangedEventHandler(map) {
  if (allowedBounds.contains(map.getCenter())) {
    // still within valid bounds, so save the last valid position
    lastValidCenter = map.getCenter();
  } else{
    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
  }
  }

function zoomChangeEventHandler(map) {
    let zoomLevel = map.getZoom();
    const legend = $('#legend');
    setZoomLevel(zoomLevel);

    //conditions to turn on district view
    if(zoomLevel <= LEVEL.DISTRICT){
      if(zoomLevel < curZoomLevel){
        if(heatmaps.isVisible())
          toggleHeatmap(); //turn off
          toggleUniqueMarkers(false); //turn off
      } 
      else if(!district_markers[0].getVisible())
        toggleDistrictMarkers(); //turn on
    }
    //conditions to turn on heat map view
    if(zoomLevel == LEVEL.HEAT_MAP){
      if(zoomLevel < curZoomLevel)
        toggleUniqueMarkers(false); //turn off
      if(!heatmaps.isVisible()) //if off turn on
        toggleHeatmap();
    }
    //conditions to turn on unique markers view
    if(zoomLevel >= LEVEL.UNIQUE_MARKER){
      legend.removeClass('hide');
      if(heatmaps.isVisible()) //turn off heat map view
        setHeatmapVisible(false);
      toggleUniqueMarkers(true);
      //turn on based on active legend symbols
    }else{
      if(legend.hasClass('hide') === false)
        legend.addClass('hide');
    }

  //infowindow only relevant when zoom is high enough to see symbols
    if(zoomLevel < LEVEL.UNIQUE_MARKER){
      infowindow.close();
    }
    curZoomLevel = zoomLevel;
  }

function setUpLegend(){
  let legend = document.getElementById('legend');
  let container = document.createElement('div');
  container.innerHTML = "<div><h3>Interactive Legend</h3><div>";
  container.className = 'bio-window slide';
  container.id = 'inner_legend';
  markerIcon.icons.forEach( 
    (marker,i) => {
      var name = marker.name;
      var icon = marker.icon;
      var symbolDiv = document.createElement('div');
      var image = document.createElement('img');

      addMarkers.uniqueMarkers[name] = []; //setup uniquemarkers array of arrays
      image.setAttribute('src',icon);
      image.setAttribute('id','legend_icon'+i);
      image.className = 'active-icon'; //all icons start active
      image.name = name; //stored name in image to reference later when toggling unique marker visibility
      symbolDiv.appendChild(image);
      symbolDiv.innerHTML += name;
      container.appendChild(symbolDiv);
    }
  );
  legend.appendChild(container);
  legend.innerHTML += "<a id='legend_arrow' class='arrow sprite-up-arrow' href='javascript:void(0)'></a>";
  $('#legend_arrow').click((e) => {
    let updateArrow = () => {$(e.target).toggleClass("sprite-up-arrow sprite-down-arrow");};
    $('#inner_legend').slideToggle("linear",updateArrow);
  });
  // after dynamic markers added to dom add click handlers 
  markerIcon.icons.forEach(
    (marker,i) => {
    const icon = marker.icon;
    const inactive_icon = marker.inactive_icon;
    $('#legend_icon'+i).click((e) => {
      let target = $(e.target);
      let isActive = target.hasClass('inactive-icon'); 
      target.attr('src',isActive ? icon : inactive_icon);
      target.toggleClass("active-icon inactive-icon");
      setMarkersVisible(addMarkers.uniqueMarkers[marker.name],isActive);
    });
  });
}

function setZoomLevel(level){
  $('#zoom_level').text(`Zoom Level: ${level}`);
}

function initialize() {
  let sanFrancisco = new google.maps.LatLng(37.78763688993816, -122.42317685292451);
  let mapOptions = {
    center: sanFrancisco,
    zoom: curZoomLevel,
    minZoom: 12,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROAD
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('panel'));
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('zoom_level'));
  map.setOptions(styles.default);
  
  setZoomLevel(curZoomLevel);
  lastValidCenter = map.getCenter();
  google.maps.event.addListener(map, 'center_changed', () => {centerChangedEventHandler(map)});
  google.maps.event.addListener(map, 'zoom_changed', zoomChangeEventHandler.bind(this,map));

  $('#toggle_heatmap_btn').click(toggleHeatmap.bind());
  $('#toggle_map_style_btn').click(toggleMapStyle.bind());
  
  return map;
}

$.when(
  //  Get all the data points for vehicle thefts
  $.getJSON(baseurl+'/assets/vehicle.theft.json', function(json) {
    vehicle_theft_data =  json;
  }),
  //  Get the PdDistrict mean locations and numbers
  $.getJSON(baseurl+"/assets/vehicle.theft.location.json", function(json) {
    vehicle_theft_district_data = json;
  }),
  $.getJSON(baseurl+"/assets/vehicle.theft.date.json", function(json) {
    vehicle_theft_date_data = json;
  }),
  //  Get text descriptions of districts and url links to read more
  $.getJSON(baseurl+"/assets/sf_district_bios.json", function(json) {
    sf_district_bios = json;
  })

).then(() => {// consider adding on fail or on progress function handling
  //  All is ready now
  const map = initialize();
  addDistrictData(map);
  initializeHeatMapArray();
  addHeatMapData();
  setUpLegend();
  addMarkers.addUniqueData(map, infowindow, vehicle_theft_date_data, heatmaps.allArray);
});
