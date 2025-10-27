var lat = 19.2860782;
var lon = -99.7459885;
    
var map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const ubicaciones = [
            { lat: 19.2860782, lon: -99.7459885, mensaje: "San Miguel Zinacantepec - Escasez de agua" },
            { lat: 19.299369, lon: -99.7305049, mensaje: "San Luis Mextepec - Escasez de agua" },
            { lat: 19.2769, lon: -99.7755827, mensaje: "San Antonio Acahualco - Escasez de agu" },
            { lat: 19.2661351, lon: -99.7595672, mensaje: "Col. Folores Magon - Escasez de agua" } 
        ];

        ubicaciones.forEach(ubicacion => {
            L.marker([ubicacion.lat, ubicacion.lon])
                .addTo(map)
                .bindPopup(`<strong>${ubicacion.mensaje}</strong>`);
        });
