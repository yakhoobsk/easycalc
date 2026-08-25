import logo from "../assests/logocomany12.png";

export default function BrandedLoader({ label = "Loading..." }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        background: "linear-gradient(135deg, #0F52BA, #185FA5)"
      }}
    >
      <img
        src={logo}
        alt="EasyStepin"
        width={170}
        style={{ height: "auto", borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}
      />

      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "branded-loader-spin 0.8s linear infinite"
        }}
      />

      <span style={{ color: "#DCEBFF", fontSize: 13 }}>{label}</span>

      <style>{"@keyframes branded-loader-spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
