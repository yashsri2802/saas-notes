export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container-page navbar-inner style={{paddingTop:0,paddingBottom:0}}">
        <a href="/" className="brand">
          <span className="brand-badge">SaaS Notes App</span>
        </a>
        <nav style={{ display: "flex", gap: "12px" }}>
          <a href="/notes" className="btn btn-outline">
            Notes
          </a>
          <a href="/login" className="btn btn-primary">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
