import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-layout">
      <section className="home-wireframe-card">
        <div className="home-wireframe-header">
          <div className="home-brand-chip">
            <span className="home-brand-icon" aria-hidden="true">
              $
            </span>
            <strong>POCKET GUARD</strong>
          </div>
        </div>

        <div className="home-wireframe-stage">
          <div className="home-wireframe-art home-wireframe-art-left" aria-hidden="true" />
          <div className="home-wireframe-art home-wireframe-art-right" aria-hidden="true" />

          <div className="home-wireframe-copy">
            <h1>
              Track Your Spending,
              <br />
              Take Back Your Financial Control.
            </h1>

            <div className="hero-actions hero-actions-centered">
              <Link className="primary-button hero-cta" to="/register">
                Register
              </Link>
              <Link className="ghost-button hero-cta ghost-cta-strong" to="/login">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
