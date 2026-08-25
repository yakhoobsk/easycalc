import logo from "../assests/logocomany12.png";

export default function WelcomeScreen() {
  return (
    <div style={styles.page}>
      <div style={styles.orbTopLeft} />
      <div style={styles.orbBottomRight} />
      <div style={styles.grid} />

      <div style={styles.content}>
        <div style={styles.logoCard}>
          <img src={logo} alt="EasyStepin" width={88} style={styles.logo} />
        </div>

        <h1 style={styles.title}>EasyStepin EasyCalc</h1>

        <p style={styles.subtitle}>
          Smarter project estimation — plan, calculate and deliver with confidence.
        </p>

        <div style={styles.progressTrack}>
          <div style={styles.progressFill} />
        </div>

        <span style={styles.statusText}>Preparing your workspace...</span>
      </div>

      <style>{`
        @keyframes ec-float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, -20px); }
        }
        @keyframes ec-float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 22px); }
        }
        @keyframes ec-pop-in {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ec-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ec-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0a2f6b 0%, #0F52BA 55%, #185FA5 100%)",
    padding: 24
  },
  orbTopLeft: {
    position: "absolute",
    top: "-12%",
    left: "-8%",
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(144,202,249,0.35), transparent 70%)",
    animation: "ec-float-1 7s ease-in-out infinite"
  },
  orbBottomRight: {
    position: "absolute",
    bottom: "-14%",
    right: "-8%",
    width: 380,
    height: 380,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)",
    animation: "ec-float-2 8s ease-in-out infinite"
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "36px 36px",
    maskImage: "radial-gradient(circle at 50% 40%, #000 0%, transparent 72%)",
    WebkitMaskImage: "radial-gradient(circle at 50% 40%, #000 0%, transparent 72%)"
  },
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: 420
  },
  logoCard: {
    background: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    boxShadow: "0 20px 50px rgba(5, 20, 50, 0.35)",
    animation: "ec-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both"
  },
  logo: {
    height: "auto",
    display: "block"
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 0.3,
    animation: "ec-fade-up 0.5s ease 0.15s both"
  },
  subtitle: {
    margin: "10px 0 0",
    fontSize: 14,
    color: "#DCEBFF",
    lineHeight: 1.5,
    animation: "ec-fade-up 0.5s ease 0.3s both"
  },
  progressTrack: {
    marginTop: 32,
    width: 180,
    height: 4,
    borderRadius: 4,
    background: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    animation: "ec-fade-up 0.5s ease 0.45s both"
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    background: "linear-gradient(90deg, #90CAF9, #fff)",
    animation: "ec-fill 1.8s ease forwards"
  },
  statusText: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.3,
    animation: "ec-fade-up 0.5s ease 0.45s both"
  }
};
