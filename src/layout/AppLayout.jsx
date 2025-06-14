// src/layout/AppLayout.jsx
const AppLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f0f4f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "1rem",
          backgroundColor: "#469C9C",
          color: "#fff",
          borderBottomLeftRadius: "50%",
          borderBottomRightRadius: "50%",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
      </header>

      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

export default AppLayout;
