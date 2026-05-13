function SummaryCard({
  eyebrow,
  title,
  value,
  detail,
  ringProgress = 0,
  variant = "default",
}) {
  return (
    <article
      className={`summary-card summary-card-${variant}`}
      style={{
        "--summary-progress": `${ringProgress}%`,
      }}
    >
      <p className="summary-eyebrow">{eyebrow}</p>

      {variant === "ring" ? (
        <div className="summary-ring-wrap">
          <div className="summary-ring">
            <div className="summary-ring-center">
              <strong>{value}</strong>
              <small>{detail}</small>
            </div>
          </div>
          <p className="summary-title">{title}</p>
        </div>
      ) : (
        <>
          <h3>{value}</h3>
          <p className="summary-title">{title}</p>
          <small>{detail}</small>
          {variant === "success" ? <div className="summary-sparkline" aria-hidden="true" /> : null}
        </>
      )}
    </article>
  );
}

export default SummaryCard;
