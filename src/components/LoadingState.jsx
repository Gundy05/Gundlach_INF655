function LoadingState({ label = "Loading...", fullScreen = false }) {
  return (
    <div className={`loading-state${fullScreen ? " loading-state-full" : ""}`}>
      <div className="loading-dot" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingState;

