let markerIcon = require('./markerIcons.js');

var unique_markers = []; //array of marker objects grouped by description ex 'STOLEN VEHICLE'

function addUniqueData(map,infowindow,jsonData,heatmapData){
  //constants for indices of vehicle theft date data element fields
  const DATE_DATA = {'DAY':0,'DATE':1,'TIME':2,'DESC':3,'ADDR':4,'ISAM':5};
  let normal_size = new google.maps.Size(28, 33);
  let scaled_size = new google.maps.Size(32,37);
  let normal_anchor = new google.maps.Point(16, 33);
  let scaled_anchor = new google.maps.Point(16, 37);

  let current_marker;

  google.maps.InfoWindow.prototype.isOpen = function(){
    let map = infowindow.getMap();
    return (map !== null && typeof map !== "undefined");
  }

  var updateIcon = function(marker,icon,size,anchor){
    icon.scaledSize = size;
    icon.size = size;
    icon.anchor = anchor;
    marker.setIcon(icon);
  } 

  jsonData.forEach( (data,i) => {
    let loc  = heatmapData[i];
    let time = data[DATE_DATA.TIME];
    let isAM = data[DATE_DATA.ISAM];
    let date = data[DATE_DATA.DATE];
    let day  = data[DATE_DATA.DAY];
    let address   = data[DATE_DATA.ADDR];
    let description = data[DATE_DATA.DESC];
    let content = `<div class='infowindow'>
                      <h3>${description}</h3>
                      <div><span>address:</span>${address}</div>
                      <div><span>date: </span> ${date} ${day} ${time} ${isAM}</div>
                    </div>`
    
    var marker_array = unique_markers[description]
    if(marker_array == undefined)
      return false; //skip this datapoint because it has an abnormal description not handled by legend
    let icon = {
      url: markerIcon.getUniqueIcon(description),
      size: normal_size,
      scaledSize : normal_size,
      origin: new google.maps.Point(0,0),
      anchor: normal_anchor
    };
    let marker = new google.maps.Marker({
      position: loc,
      map: map,
      title: description,
      icon: icon, 
      visible: false
    });
    
    marker_array.push(marker);
    var scaleIcon = () => {updateIcon(marker,icon,scaled_size,scaled_anchor);}
    var normalizeIcon = () => {updateIcon(marker,icon,normal_size,normal_anchor);}
    google.maps.event.addListener(marker,'mouseover',scaleIcon);

    google.maps.event.addListener(marker,'mouseout',function(){
      if(current_marker != marker)
        normalizeIcon();
    });

    google.maps.event.addListener(marker, 'click', function() {
      var is_next_marker = current_marker != marker;
      if(infowindow.isOpen()){
        google.maps.event.trigger(infowindow,'closeclick'); //we always want to close infowindow on second click and reset
      }
      if(is_next_marker){
        current_marker = marker;
        infowindow.setContent(content);
        infowindow.open(map,marker);
        google.maps.event.addListenerOnce(infowindow,'closeclick',function(){
          normalizeIcon();
          current_marker = undefined;
          infowindow.close();
      });
      }
    });
 
  }
);
};

module.exports = {
  uniqueMarkers : unique_markers,
  addUniqueData : addUniqueData
};