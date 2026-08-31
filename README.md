<title>Trip Plan Showcase</title> <style> :root { --accent: #0284c7; --dark: #0f172a; --muted: #475569; --bg: #f8fafc; }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: system-ui, sans-serif;
    }

    body {
        background: var(--bg);
        color: var(--dark);
        line-height: 1.6;
    }

    .hero {
        background: linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), var(--hero-img, #1e293b) center/cover;
        color: white;
        padding: 80px 20px;
        text-align: center;
    }

    .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
    }

    .hero p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }

    .stats {
        display: flex;
        justify-content: space-around;
        max-width: 800px;
        margin: -30px auto 40px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }

    .stat-item {
        text-align: center;
    }

    .stat-item .num {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--accent);
    }

    .stat-item .label {
        font-size: 0.8rem;
        color: var(--muted);
        text-transform: uppercase;
    }

    .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
    }

    @media (max-width: 768px) {
        .container {
            grid-template-columns: 1fr;
        }
    }

    .section-title {
        font-size: 1.5rem;
        margin-bottom: 20px;
    }

    .timeline {
        border-left: 3px solid #cbd5e1;
        padding-left: 20px;
        margin-left: 10px;
    }

    .timeline-item {
        position: relative;
        margin-bottom: 30px;
    }

    .timeline-item::before {
        content: '';
        position: absolute;
        left: -28px;
        top: 5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--accent);
        border: 3px solid white;
    }

    .time {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--accent);
        text-transform: uppercase;
    }

    .timeline-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .timeline-card h4 {
        margin-bottom: 5px;
    }

    .timeline-card p {
        font-size: 0.9rem;
        color: var(--muted);
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .sidebar-panel {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    .sidebar-panel h3 {
        margin-bottom: 15px;
        font-size: 1.2rem;
    }

    .gallery {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .gallery img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        list-style: none;
    }

    .tag {
        background: #e0f2fe;
        color: var(--accent);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
</style>
<!-- Target elements populated by JavaScript -->
<header class="hero" id="heroSection">
    <h1 id="tripTitle"></h1>
    <p id="tripDesc"></p>
</header>

<section class="stats" id="statsDashboard"></section>

<main class="container">
    <section>
        <h2 class="section-title">📅 Itinerary</h2>
        <div class="timeline" id="itineraryTimeline"></div>
    </section>
</main>

<script>
    // EDIT YOUR TRIP DATA DIRECTLY IN THIS CONFIGURATION OBJECT BELOW:
    const TRIP_CONFIG = {
        title: "Channel Islands National Park Road Trip",
        description: "A 3-day adventure through the Channel Islands.",
        heroImage: "https://unsplash.com",
        accentColor: "#0d9488", // Teal hex code
        stats: [
            { label: "Duration", value: "4 Days" },
            { label: "Accommodation", value: "$1123.62" },
            { label: "Driving Distance", value: "~650 Miles" }
        ],
        itinerary: [
            { 
                time: "Day 1 · Afternoon", 
                title: "Drive", 
                desc: "Drive all the way to Pismo Beach, CA 93449." 
            },
            { 
                time: "Day 2 · Morning", 
                title: "Driving", 
                desc: "Drive all the way to Ventura, CA 93001." 
            },
            { 
                time: "Day 2 · Afternoon", 
                title: "Hiking", 
                desc: "Take the boat ride at Ventura Marina and hike on Santa Cruz Island at Scorpion Anchorage." 
            },
            { 
                time: "Day 3 · Morning & Partial Afternoon", 
                title: "Hiking", 
                desc: "Take the boat ride at Ventura Marina and hike on Santa Cruz Island at Prisoners Harbor. Return at 3PM." 
            },
            { 
                time: "Day 3 · Evening", 
                title: "Chilling", 
                desc: "Chill at the hotel or explore in downtown Ventura. The hotel has a fitness center as well as an outdoor swimming pool." 
            },
            { 
                time: "Day 4 · All Day", 
                title: "Driving", 
                desc: "Drive all the way back to San Jose, CA 95132." 
            }
        ]
    };

    // RENDER ENGINE (Do not modify unless you want to change layout mechanics)
    function renderTrip() {
        document.title = TRIP_CONFIG.title;
        document.documentElement.style.setProperty('--accent', TRIP_CONFIG.accentColor);
        document.getElementById('heroSection').style.setProperty('--hero-img', `url('${TRIP_CONFIG.heroImage}')`);
        document.getElementById('tripTitle').innerText = TRIP_CONFIG.title;
        document.getElementById('tripDesc').innerText = TRIP_CONFIG.description;

        // Render Stats
        document.getElementById('statsDashboard').innerHTML = TRIP_CONFIG.stats.map(s => `
            <div class="stat-item">
                <div class="num">${s.value}</div>
                <div class="label">${s.label}</div>
            </div>
        `).join('');

        // Render Itinerary
        document.getElementById('itineraryTimeline').innerHTML = TRIP_CONFIG.itinerary.map(item => `
            <div class="timeline-item">
                <span class="time">${item.time}</span>
                <div class="timeline-card">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');

        // Render Gallery
        // Render Tags
    }

    // Initialize application build on load
    window.addEventListener('DOMContentLoaded', renderTrip);
</script>
