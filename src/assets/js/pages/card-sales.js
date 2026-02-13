document.getElementById("searchSales").addEventListener("input", loadSalesCards);
document.getElementById("filterDate").addEventListener("change", loadSalesCards);
async function loadSalesCards() {
    const sales_name=document.getElementById("searchSales").value.toLowerCase();
    const filter_date=document.getElementById("filterDate").value;
    fetch(`${__API_URL__}/maps/get_sales_area`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const container = document.getElementById("card-sales");
            container.innerHTML = ""; // clear sebelum render ulang

            data.data.forEach(async p => {
                // const locationName = await getLocationName(p.lat, p.lng);
                const created = formatTanggalIndo(p.check_in_at);
                const statusColor =
                p.visit_status_label === 'SELESAI'
                    ? 'red'
                    : p.visit_status_label === 'SEDANG_CHECK_IN'
                    ? 'green'
                    : 'gray';
                const card = `
                    <div class="flex pb-3 mb-3 border-b dark:border-darkborder cursor-pointer" onclick="openSalesDetail('${p.latitude}', '${p.longitude}')">
                        <img src="${p.sales_photo_url}" 
                             class="size-24" 
                             alt="${p.sales_name}">
                        
                        <div class="w-full ms-4">
                            <div class="flex justify-between">
                                <h5 class="mb-2 font-semibold">${p.sales_name}</h5><br>
                                <i class="ri-more-2-line"></i>
                            </div>
                            <div class="flex justify-between">
                                <h5 class="mb-2 font-semibold">${p.target_name}</h5>
                                <i class="ri-more-2-line"></i>
                            </div>
                            <div class="mb-2">
                                <i class="ri-arrow-right-down-line"></i>
                                <span class="text-muted">${p.gps_snapshot}</span><br/>
                                <span class="text-muted">${created}</span>
                               <span style="color:${statusColor}; font-weight:600;">
                                    ${p.visit_status_label}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        })
        .catch(err => console.error("ERROR:", err));
}
// async function getLocationName(lat, lng) {
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

//     try {
//         const res = await fetch(url, { 
//             headers: { 'User-Agent': 'YourAppName/1.0' } 
//         });
//         const data = await res.json();
//         return data.display_name || "Lokasi tidak diketahui";
//     } catch (e) {
//         console.error("Reverse geocoding error:", e);
//         return "Lokasi tidak diketahui";
//     }
// }

// Panggil pertama kali
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("filterDate").value =
        new Date().toISOString().split("T")[0];
    loadSalesCards();
});
const socket=new WebSocket("ws://localhost:3000");
socket.onmessage=(msg)=>{
    console.log(msg.data);
    if(msg.data==="updated"){
        loadSalesCards();
    }
}
function openSalesDetail(lat,lng) {
    if (window.zoomToLocation) {
        window.zoomToLocation(lat, lng);
    } else {
        console.error("zoomToLocation() tidak ditemukan!");
    }
}
function formatTanggalIndo(dateString) {
    const date = new Date(dateString);

    const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
    const tgl = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const jam = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });

    return `${hari}, ${tgl} - ${jam}`;
}

loadSalesCards();