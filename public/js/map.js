    mapboxgl.accessToken = mapToken;
    console.log(mapToken);
    
    const map = new mapboxgl.Map({   
        container: 'map',                   
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates, // center the map on this longitude and latitude
     
    });

    map.addControl(new mapboxgl.NavigationControl()); // (+), (-) navigate the map mouse if they prefer.
    map.scrollZoom.disable(); // well mouse zoom

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style glob
    });
    
    


const marker1 = new mapboxgl.Marker({color : `red`})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset : 25}).setHTML(
        `<h4>${listing.location}</h4><p>Exact Location well be provided after booking</p>`
    ))
.addTo(map);
