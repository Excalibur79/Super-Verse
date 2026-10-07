const backend_url =
  process.env.NODE_ENV === "production"
    ? "https://excalibur-superverse.herokuapp.com"
    : "http://localhost:5001";
export default backend_url;
