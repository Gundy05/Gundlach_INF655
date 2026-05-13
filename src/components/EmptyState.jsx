function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark">0</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

