const baseurl = '/google-maps-sf-crime-vis/assets/sf_crime_icons/';
const icons = [ {'name': "STOLEN VEHICLE", 'icon': baseurl+'/car.png', 'inactive_icon':baseurl+'car-inactive.png'},
                     {'name': "ATTEMPTED STOLEN VEHICLE", 'icon': baseurl+'car-attempted.png', 'inactive_icon':baseurl+'car-inactive.png'},
                     {'name': "STOLEN AND RECOVERED VEHICLE", 'icon':  baseurl+'car-recovered.png', 'inactive_icon':baseurl+'car-inactive.png'},
                     {'name': "STOLEN MOTORCYCLE", 'icon': baseurl+'motorcycle2.png', 'inactive_icon':baseurl+'motorcycle-inactive.png'},
                     {'name': "STOLEN TRUCK", 'icon': baseurl+'truck2.png','inactive_icon':baseurl+'truck-inactive.png'}]

function getUniqueIcon(description){
  let foundIcon = icons.find( (marker) => {
    return marker.name === description;
  });
  return (foundIcon.icon || icons[0].icon); //default stolen automobile icon
}

module.exports = {
  icons : icons,
  getUniqueIcon : getUniqueIcon
}