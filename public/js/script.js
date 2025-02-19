const socket = io();

if(navigator.geolocation)
{
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude});
        }
        ,(error)=>
        {
            console.error('Unable to fetch location', error);
        },
        {
            maximumAge:0,
            timeout: 5000,
            enableHighAccuracy: true
        }
)
}

const map=L.map("map").setView([0,0],16)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);


const markers={}

socket.on('receive-location',(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else
    {
        markers[id]=L.marker([latitude,longitude]).addTo(map)
       .bindPopup(`User ${id}`)
    }
})

socket.on('disconnect',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})