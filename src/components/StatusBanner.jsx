function StatusBanner({ kind = "info", title, message, onClose }) {
  return (
    <div className={`status-banner status-${kind}`}>
      <div>
        {title ? <strong>{title}</strong> : null}
        <p>{message}</p>
      </div>
      {onClose ? (
        <button
          aria-label="Dismiss message"
          className="banner-close"
          onClick={onClose}
          type="button"
        >
          x
        </button>
      ) : null}
    </div>
  );
}

export default StatusBanner;

