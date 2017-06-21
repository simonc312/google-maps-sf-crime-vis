let heatmap = []; //dictionary of heatmaps per district
let heatmapData = []; //array of heat map pts grouped by district ex 'TARAVAL'
let heatmapAll;
let heatmapDataAll = []; //used for toggling heatmap display mode from district view or individual markers
let gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)',
      ];

function finalizeMaps () {
  heatmap.forEach( (district,i) => {
    heatmap[i] = new google.maps.visualization.HeatmapLayer({
      data: heatmapData[district],
      gradient: gradient
    });
    heatmap[i].setMap(null);
  });

  heatmapAll = new google.maps.visualization.HeatmapLayer({
      data: heatmapDataAll
    });
  hide();
}

function hide(){
  heatmapAll.setMap(null);
}

function setVisible(map){
  heatmapAll.setMap(map);
}

function isVisible(){
  return heatmapAll.getMap() !== null;
}

module.exports = {
  //props
  districtDict : heatmap,
  districtArray : heatmapData,
  allArray : heatmapDataAll,
  //functions
  finalizeMaps : finalizeMaps,
  hide : hide,
  setVisible : setVisible,
  isVisible : isVisible
}