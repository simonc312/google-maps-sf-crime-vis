const DISTRICT_CIRCLE = {
  'COLOR': {
    'ON':'red',
    'OFF':'transparent'
  },
  'OPACITY': {
    'ON':0.4,
    'OFF':0
  }
};

function getCircle(magnitude, isOn){
  return getPrivateCircle(
      magnitude,
      isOn ? DISTRICT_CIRCLE.COLOR.ON : DISTRICT_CIRCLE.COLOR.OFF,
      isOn ? DISTRICT_CIRCLE.OPACITY.ON : DISTRICT_CIRCLE.OPACITY.OFF 
    );
}

function getPrivateCircle(magnitude,fColor,fOpacity) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: fColor,
    fillOpacity: fOpacity,
    scale: 0.25*magnitude,
    strokeColor: 'white',
    strokeWeight: 0
  };
}

module.exports = getCircle;