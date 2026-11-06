// Vehicle information
const vehicles = [
    { id: "TRUCK-101", x: 10, y: 15, dx: 1, dy: 0.5 },
    { id: "TRUCK-102", x: 20, y: 75, dx: 0.8, dy: -0.4 },
    { id: "TRUCK-103", x: 75, y: 20, dx: -0.5, dy: 0.7 },
    { id: "TRUCK-104", x: 85, y: 80, dx: -0.7, dy: -0.5 },
    { id: "TRUCK-105", x: 15, y: 45, dx: 1.1, dy: 0.3 }
];

let tracking = false;
let timer = null;
let alertCount = 0;

const map = document.getElementById("map");

// Create vehicle icons
vehicles.forEach(vehicle => {
    let icon = document.createElement("div");
    icon.className = "vehicle";
    icon.id = vehicle.id;
    icon.textContent = "🚚";
    map.appendChild(icon);
});

// Check restricted zone
function isInsideZone(vehicle) {
    return (
        vehicle.x >= 40 &&
        vehicle.x <= 65 &&
        vehicle.y >= 30 &&
        vehicle.y <= 65
    );
}

// Update vehicle positions
function updateVehicles() {
    vehicles.forEach(vehicle => {
        vehicle.x += vehicle.dx;
        vehicle.y += vehicle.dy;

        // Keep vehicles inside map
        if (vehicle.x > 95 || vehicle.x < 5) {
            vehicle.dx *= -1;
        }

        if (vehicle.y > 90 || vehicle.y < 5) {
            vehicle.dy *= -1;
        }

        // Display vehicle position
        let icon = document.getElementById(vehicle.id);
        icon.style.left = vehicle.x + "%";
        icon.style.top = vehicle.y + "%";

        // Detect geofence entry
        if (isInsideZone(vehicle)) {
            icon.textContent = "⚠️";

            if (!vehicle.alerted) {
                vehicle.alerted = true;
                alertCount++;
                addAlert(vehicle.id);
            }
        } else {
            icon.textContent = "🚚";
            vehicle.alerted = false;
        }
    });

    updateDetails();
    document.getElementById("alertCount").textContent = alertCount;
}

// Display vehicle information
function updateDetails() {
    let html = "";

    vehicles.forEach(vehicle => {
        let status = isInsideZone(vehicle)
            ? "Inside Restricted Zone"
            : "Safe";

        html += `
            <div class="vehicle-row">
                <b>${vehicle.id}</b> -
                Position: ${vehicle.x.toFixed(1)}, ${vehicle.y.toFixed(1)}
                <span class="${isInsideZone(vehicle) ? 'danger' : 'safe'}">
                    ${status}
                </span>
            </div>
        `;
    });

    document.getElementById("vehicleDetails").innerHTML = html;
}

// Display alert
function addAlert(vehicleId) {
    let alertArea = document.getElementById("alerts");

    if (alertArea.textContent.trim() === "No alerts detected.") {
        alertArea.innerHTML = "";
    }

    let message = document.createElement("div");
    message.className = "alert";
    message.textContent = "WARNING: " + vehicleId + " entered the restricted zone!";

    alertArea.prepend(message);
}

// Start vehicle tracking
function startTracking() {
    if (tracking) return;
    tracking = true;
    timer = setInterval(updateVehicles, 200);
}

// Stop vehicle tracking
function stopTracking() {
    tracking = false;
    clearInterval(timer);
}

// Initial display
updateDetails();
