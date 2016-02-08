
function getCircle(magnitude,fColor,fOpacity) {
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