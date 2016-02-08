//lunar landing stype from snazzy maps 
const nightStyle = {
  styles: [
    {"stylers" : 
      [
        {"hue":"#ff1a00"},
        {"invert_lightness":true},
        {"saturation":-100},
        {"lightness":33},
        {"gamma":0.5}
      ]
    },
    {
      "featureType":"water",
      "elementType":"geometry",
      "stylers":
        [
          {"color":"#2D333C"}
        ]
    }
  ]
};
//pale dawn style from snazzy maps
const dayStyle = {
  styles: [
    {
      "featureType":"water",
      "stylers" : [
        {"visibility":"on"},
        {"color":"#acbcc9"}
      ]
    },
    {
      "featureType":"landscape",
      "stylers" : [
        {"color":"#f2e5d4"}
        ]
    },
    {
      "featureType":"road.highway",
      "elementType":"geometry",
      "stylers": [
        {"color":"#c5c6c6"}
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"geometry",
      "stylers": [
        {"color":"#e4d7c6"}
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"geometry",
      "stylers": [
        {"color":"#fbfaf7"}
      ]
    },
    {
      "featureType":"poi.park",
      "elementType":"geometry",
      "stylers":[
        {"color":"#c5dac6"}
        ]
    },
    {
      "featureType":"administrative",
      "stylers": [
        {"visibility":"on"},
        {"lightness":33}
      ]
    },
    {
      "featureType":"road"
    },
    {
      "featureType":"poi.park",
      "elementType":"labels",
      "stylers": [
        {"visibility":"on"},
        {"lightness":20}
      ]
    },
    {
      "featureType":"road",
      "stylers":[
        {"lightness":20}
      ]
    }
  ]
};

let currentStyle = dayStyle;

function toggle () {
  if(currentStyle === dayStyle){
    currentStyle = nightStyle;
  } else {
    currentStyle = dayStyle;
  }
  return currentStyle;
}

module.exports = {
  day : dayStyle,
  night : nightStyle,
  toggle : toggle,
  default : currentStyle
}