import { useState } from "react";
import { Link } from "react-router-dom";
// Update this path/filename to wherever your image actually lives
import rideHero from "../assets/images/ride-hero.svg";
import { searchLocation } from "../services/location";
import { getRoute } from "../services/route";
import { getFareEstimate } from "../services/fare";

const css = `
  .nr-page { min-height: 100vh; background: #000; color: #fff;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }
  .nr-nav { display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem; max-width: 1280px; margin: 0 auto; }
  .nr-nav-left, .nr-nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .nr-logo { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;
    color: #fff; text-decoration: none; margin-right: 0.5rem; }
  .nr-link { color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 500; }
  .nr-link:hover { opacity: 0.75; }
  .nr-pill { background: #fff; color: #000; text-decoration: none; font-weight: 600;
    font-size: 0.9rem; padding: 0.55rem 1rem; border-radius: 999px; }
  .nr-pill:hover { background: #e5e5e5; }
  .nr-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center;
    gap: 4rem; max-width: 1280px; margin: 0 auto; padding: 4rem 2rem 5rem; }
  .nr-h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.1;
    letter-spacing: -1px; margin: 0 0 1.5rem; }
  .nr-sub { font-size: 1rem; margin: 0 0 1.5rem; color: #fff; }
  .nr-fields { position: relative; max-width: 380px; display: flex;
    flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .nr-field { display: flex; align-items: center; gap: 0.9rem; background: #f3f3f3;
    border-radius: 8px; padding: 0 0.9rem; height: 48px; position: relative; z-index: 1; }
  .nr-field input { flex: 1; background: transparent; border: none; outline: none;
    font-size: 1rem; color: #000; font-family: inherit; }
  .nr-field input::placeholder { color: #545454; }
  .nr-field:focus-within { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000 inset; }
  .nr-dot { width: 8px; height: 8px; border-radius: 50%; background: #000; flex-shrink: 0; }
  .nr-square { width: 8px; height: 8px; background: #000; flex-shrink: 0; }
  .nr-line { position: absolute; left: 1.2rem; top: 40px; height: 24px; width: 2px;
    background: #000; z-index: 2; }
  .nr-btn { display: inline-block; background: #fff; color: #000; text-decoration: none;
    font-weight: 600; font-size: 1rem; padding: 0.85rem 1.4rem; border-radius: 8px;
    border: none; cursor: pointer; font-family: inherit; }
  .nr-btn:hover { background: #e5e5e5; }
  .nr-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .nr-price-row { display: flex; align-items: center; justify-content: space-between;
    background: #f3f3f3; border-radius: 8px; padding: 0 0.9rem; height: 48px; color: #000; }
  .nr-price-row span { font-size: 1rem; }
  .nr-price-row strong { font-size: 1rem; }
  .nr-more { margin-top: 2.5rem; display: flex; gap: 1.25rem; flex-wrap: wrap;
    font-size: 0.9rem; color: rgba(255,255,255,0.7); align-items: center; }
  .nr-more a { color: #fff; font-weight: 600; text-decoration: underline;
    text-underline-offset: 3px; }
  .nr-img-wrap { width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #111; }
  .nr-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .nr-foot { max-width: 1280px; margin: 0 auto; padding: 0 2rem 2rem;
    font-size: 0.75rem; color: rgba(255,255,255,0.4); }
  @media (max-width: 860px) {
    .nr-hero { grid-template-columns: 1fr; gap: 2.5rem; padding-top: 2rem; }
    .nr-nav { padding: 1rem; }
    .nr-nav-left .nr-link { display: none; }
    .nr-nav-left .nr-link.keep { display: inline; }
    .nr-fields { max-width: 100%; }
  }
`;

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSeePrices = async () => {
    if (!pickup.trim() || !destination.trim()) {
      return;
    }

    setLoading(true);
    setPrice(null);

    try {
      const [fromPlaces, toPlaces] = await Promise.all([
        searchLocation(pickup),
        searchLocation(destination),
      ]);

      const from = fromPlaces[0];
      const to = toPlaces[0];

      if (!from || !to) {
        setPrice("Unavailable");
        return;
      }

      const route = await getRoute(
        { lat: from.lat, lng: from.lng },
        { lat: to.lat, lng: to.lng }
      );

      const result = await getFareEstimate({
        distanceKm: route.distanceKm,
        durationMinutes: route.durationMinutes,
      });

      setPrice(`₹${result.fares.car}`);
    } catch {
      setPrice("Unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="nr-page">
      <style>{css}</style>

      {/* ── Top nav ── */}
      <header className="nr-nav">
        <nav className="nr-nav-left">
          <Link to="/" className="nr-logo">NovaRide</Link>
          <Link to="/users/signup" className="nr-link keep">Ride</Link>
          <Link id="captain-get-started" to="/captains/signup" className="nr-link keep">Drive</Link>
          <Link to="/" className="nr-link">About</Link>
        </nav>
        <nav className="nr-nav-right">
          <Link id="passenger-login" to="/login" className="nr-link">Log in</Link>
          <Link id="captain-login" to="/login" className="nr-link" style={{ display: "none" }}>
            Log in as Captain
          </Link>
          <Link to="/users/signup" className="nr-pill">Sign up</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="nr-hero">
        <div>
          <h1 className="nr-h1">Go anywhere with NovaRide</h1>
          <p className="nr-sub">Request a ride, hop in, and go.</p>

          <div className="nr-fields">
            <div className="nr-field">
              <span className="nr-dot" />
              <input
                type="text"
                placeholder="Enter location"
                aria-label="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            <span className="nr-line" />
            <div className="nr-field">
              <span className="nr-square" />
              <input
                type="text"
                placeholder="Enter destination"
                aria-label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            {price && (
              <div className="nr-price-row">
                <span>Nova Go</span>
                <strong>{price}</strong>
              </div>
            )}
          </div>

          <button
            id="passenger-get-started"
            type="button"
            className="nr-btn"
            onClick={handleSeePrices}
            disabled={loading}
          >
            {loading ? "Checking..." : "See prices"}
          </button>

          <div className="nr-more">
            <span>Want to earn on your schedule?</span>
            <Link to="/captains/signup">Become a Captain</Link>
          </div>
        </div>

        <div className="nr-img-wrap">
          <img src={rideHero} alt="NovaRide city ride illustration" />
        </div>
      </section>

      <p className="nr-foot">
        By continuing you agree to NovaRide's Terms of Service and Privacy Policy.
      </p>
    </main>
  );
}