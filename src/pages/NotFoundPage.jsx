import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="content-card stack-md">
      <p className="eyebrow">404</p>
      <h1>That page does not exist.</h1>
      <p>The route may be broken or the page may have moved. Use the button below to get back on track.</p>
      <Link className="primary-button" to="/">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
