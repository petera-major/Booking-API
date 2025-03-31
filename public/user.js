document.addEventListener("DOMContentLoaded", () => {
    fetchFlights();

    document.getElementById("search-form").addEventListener("submit", function (e) {
        e.preventDefault();
        searchFlights();
    });
});

function fetchFlights() {
    fetch("/flights")
        .then(response => response.json())
        .then(displayFlights)
        .catch(error => console.error("Error fetching flights:", error));
}

function searchFlights() {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const date = document.getElementById("date").value;

    let query = `/search-flights?`;
    if (origin) query += `origin=${encodeURIComponent(origin)}&`;
    if (destination) query += `destination=${encodeURIComponent(destination)}&`;
    if (date) query += `date=${encodeURIComponent(date)}`;

    fetch(query)
        .then(response => response.json())
        .then(displayFlights)
        .catch(error => console.error("Error searching flights:", error));
}

function displayFlights(flights) {
    const flightsList = document.getElementById("flights-list");
    flightsList.innerHTML = "";

    if (!flights || flights.length === 0) {
        flightsList.innerHTML = "<tr><td colspan='7'>No flights found.</td></tr>";
        return;
    }

    flights.forEach(flight => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${flight.airline}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>${flight.departure_time}</td>
            <td>${flight.available_seats}</td>
            <td>$${flight.price}</td>
            <td><button onclick="bookFlight(${flight.id})">Book</button></td>
        `;
        flightsList.appendChild(row);
    });
}


document.getElementById("origin").addEventListener("input", async function () {
    const query = this.value.trim();
    const suggestionBox = document.getElementById("origin-suggestions");

    if (query.length === 0) {
        suggestionBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/search-flights?origin=${encodeURIComponent(query)}`);
        const flights = await res.json();

        const origins = [...new Set(flights.map(f => f.origin))];

        suggestionBox.innerHTML = origins.map(o => `<div>${o}</div>`).join("");

        suggestionBox.querySelectorAll("div").forEach(div => {
            div.addEventListener("click", () => {
                document.getElementById("origin").value = div.textContent;
                suggestionBox.innerHTML = "";
            });
        });
    } catch (err) {
        console.error("Origin autocomplete failed:", err);
    }
});

document.getElementById("destination").addEventListener("input", async function () {
    const query = this.value.trim();
    const suggestionBox = document.getElementById("destination-suggestions");

    if (query.length === 0) {
        suggestionBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/search-flights?destination=${encodeURIComponent(query)}`);
        const flights = await res.json();

        const destinations = [...new Set(flights.map(f => f.destination))];

        suggestionBox.innerHTML = destinations.map(d => `<div>${d}</div>`).join("");

        suggestionBox.querySelectorAll("div").forEach(div => {
            div.addEventListener("click", () => {
                document.getElementById("destination").value = div.textContent;
                suggestionBox.innerHTML = "";
            });
        });
    } catch (err) {
        console.error("Destination autocomplete failed:", err);
    }
});
