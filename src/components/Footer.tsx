export default function Footer() {
  return (
    <footer style={{
      background: "var(--olive-700)",
      color: "white",
      marginTop: 24,
      borderTop: "2px solid var(--olive-900)"
    }}>
      <div className="container" style={{ paddingBlock: 20, textAlign: "center" }}>
        <small>© {new Date().getFullYear()} GoblinMaster — Proyecto Final UTN</small>
      </div>
    </footer>
  );
}
