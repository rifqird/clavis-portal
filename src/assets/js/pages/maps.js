
const map = L.map('map').setView([-6.200000, 106.816666], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

// ======== LAYER UNTUK MENYIMPAN MARKER ========
let markerLayer = L.layerGroup().addTo(map);
let isFirstLoad = true;
document.getElementById("searchSales").addEventListener("input", loadMarkers);
document.getElementById("filterDate").addEventListener("change", () => {
    isFirstLoad = true; // paksa zoom ulang
    loadMarkers();
});
async function loadMarkers() {
    const sales_name=document.getElementById("searchSales").value.toLowerCase();
    const filter_date=document.getElementById("filterDate").value;
    
    let bounds = [];
    try{
        const response = await axios.get(`${__API_URL__}/maps/get_sales_area`);
        const data=response.data.data;
        markerLayer.clearLayers();
        data.forEach(p => {
            const wrapperClass =
                p.visit_status_label === 'SELESAI'
                    ? 'pin-wrapper-close'
                    : 'pin-wrapper';

            const photoIcon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="${wrapperClass}">
                        <img src="${p.sales_photo_url}" />
                    </div>
                `,
                iconSize: [60, 70],
                iconAnchor: [30, 60],
                popupAnchor: [0, -60]
            });


            const marker = L.marker([p.latitude, p.longitude], { icon: photoIcon })
            .bindPopup(`
                <b>${p.sales_name}</b><br>
                <img src="${p.sales_photo_url}" width="100" style="border-radius:6px;margin-top:6px;" />
            `);

            markerLayer.addLayer(marker);

            bounds.push([p.latitude, p.longitude]);
        });
        if (bounds.length > 0) {
            map.flyToBounds(bounds, {
                padding: [50, 50],
                animate: true,
                duration: 1.5
            });
        }
    } catch (err) {
        console.error("Gagal fetch:", err);
    }
}
// === Fungsi global untuk zoom ke lokasi tertentu ===
window.zoomToLocation = function(lat, lng) {
    map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.5  // durasi animasi dalam detik
    });
};
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("filterDate").value =
        new Date().toISOString().split("T")[0];
    loadMarkers();
});
const socketeu = new WebSocket("ws://localhost:3000");

socketeu.onmessage = (msg) => {
    if (msg.data === "updated") {
        loadMarkers();  // Update marker otomatis
    }
};

loadMarkers();

