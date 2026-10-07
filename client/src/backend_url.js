const backend_url =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:5001");
export default backend_url;
