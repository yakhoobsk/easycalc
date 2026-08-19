// @ts-nocheck
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, BarChart3, ShieldCheck } from "lucide-react";
import { LoginUser } from "../redux/services/authService";
import { showSnackbar } from "../utils/snackbar";
import logo from "../assests/logocomany1.png"

const FEATURES = [
    { icon: Zap, text: "Instant sprint & resource planning" },
    { icon: BarChart3, text: "Live dashboards & Gantt charts" },
    { icon: ShieldCheck, text: "Enterprise-grade security" },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isNarrow, setIsNarrow] = useState(window.innerWidth < 860);
    const dispatch = useDispatch();

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth < 860);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleLogin = (e) => {
        e?.preventDefault?.();

        if (!email || !password) {
            showSnackbar("warning", "Please enter both email and password");
            return;
        }

        const payload = { email, password };
        setSubmitting(true);

        dispatch(LoginUser(payload))
            .unwrap()
            .then(() => {
                showSnackbar("success", "Login successful");
                sessionStorage.setItem("justLoggedIn", "1");
            })
            .catch((err) => {
                showSnackbar("error", typeof err === "string" ? err : err?.message || "Login failed");
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div style={styles.page}>
            <div style={{ ...styles.shell, maxWidth: isNarrow ? 420 : 900 }}>
                {!isNarrow && (
                    <div style={styles.brandPanel}>
                        <div style={styles.brandGlow} />

                        <div style={styles.brandLogoWrap}>
                            <img src={logo} alt="EasyStepin" style={styles.brandLogo} />
                        </div>

                        <h1 style={styles.brandTitle}>EasyStepin EasyCalc</h1>

                        <p style={styles.brandSubtitle}>
                            Project-to-delivery estimation, built for teams that ship on time.
                        </p>

                        <ul style={styles.brandList}>
                            {FEATURES.map(({ icon: Icon, text }) => (
                                <li key={text} style={styles.brandListItem}>
                                    <span style={styles.brandIconWrap}>
                                        <Icon size={14} color="#fff" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={styles.formPanel}>
                    <form style={styles.formCard} onSubmit={handleLogin}>
                        {isNarrow && (
                            <img src={logo} alt="EasyStepin" width={140} style={styles.mobileLogo} />
                        )}

                        <h2 style={styles.formTitle}>Welcome back</h2>
                        <p style={styles.formSubtitle}>Sign in to continue to your workspace</p>

                        <label style={styles.label}>Email</label>
                        <div style={styles.inputWrap}>
                            <Mail size={16} color="#8a94a6" style={styles.inputIcon} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={styles.input}
                                autoComplete="username"
                            />
                        </div>

                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrap}>
                            <Lock size={16} color="#8a94a6" style={styles.inputIcon} />
                            <input
                                type={show ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ ...styles.input, paddingRight: 40 }}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => !s)}
                                style={styles.eyeBtn}
                                aria-label={show ? "Hide password" : "Show password"}
                            >
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <button type="submit" disabled={submitting} style={styles.submitBtn(submitting)}>
                            {submitting ? "Signing in..." : "Sign In"}
                            {!submitting && <ArrowRight size={16} />}
                        </button>

                        <p style={styles.footer}>Secure login • EasyStepin © 2026</p>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes ec-fade-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a2f6b 0%, #0F52BA 45%, #185FA5 100%)",
        padding: 20
    },
    shell: {
        width: "100%",
        display: "flex",
        minHeight: 520,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(5, 20, 50, 0.35)",
        background: "#fff",
        animation: "ec-fade-up 0.5s ease"
    },
    brandPanel: {
        flex: "0 0 44%",
        position: "relative",
        background: "linear-gradient(160deg, #0F52BA, #123E82 70%, #0A2C5C)",
        color: "#fff",
        padding: "44px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 16,
        overflow: "hidden"
    },
    brandGlow: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(144,202,249,0.35), transparent 70%)",
        top: -80,
        right: -80
    },
    brandLogoWrap: {
        alignSelf: "flex-start",
        background: "#fff",
        borderRadius: 14,
        padding: "12px 18px",
        marginBottom: 8,
        display: "inline-flex",
        boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        position: "relative",
        zIndex: 1
    },
    brandLogo: {
        width: 170,
        height: "auto",
        display: "block"
    },
    brandTitle: {
        margin: 0,
        fontSize: 25,
        fontWeight: 700,
        position: "relative",
        zIndex: 1
    },
    brandSubtitle: {
        margin: 0,
        fontSize: 13.5,
        color: "#CFE1FA",
        lineHeight: 1.5,
        position: "relative",
        zIndex: 1,
        maxWidth: 280
    },
    brandList: {
        margin: "12px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        zIndex: 1
    },
    brandListItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12.5,
        color: "#E3EEFC"
    },
    brandIconWrap: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: "rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },
    formPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "44px 40px",
        background: "#fff"
    },
    formCard: {
        width: "100%",
        maxWidth: 320,
        display: "flex",
        flexDirection: "column"
    },
    mobileLogo: {
        height: "auto",
        marginBottom: 18
    },
    formTitle: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "#122036"
    },
    formSubtitle: {
        margin: "6px 0 26px",
        fontSize: 13,
        color: "#788296"
    },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: "#42506b",
        marginBottom: 6,
        marginTop: 14
    },
    inputWrap: {
        position: "relative",
        display: "flex",
        alignItems: "center"
    },
    inputIcon: {
        position: "absolute",
        left: 12,
        pointerEvents: "none"
    },
    input: {
        width: "100%",
        height: 44,
        borderRadius: 10,
        border: "1.5px solid #E3E7EE",
        padding: "0 14px 0 36px",
        fontSize: 14,
        outline: "none",
        background: "#F8FAFD",
        fontFamily: "inherit"
    },
    eyeBtn: {
        position: "absolute",
        right: 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#8a94a6",
        display: "flex",
        padding: 4
    },
    submitBtn: (submitting) => ({
        marginTop: 26,
        height: 46,
        borderRadius: 10,
        border: "none",
        background: submitting ? "#7fa6d6" : "linear-gradient(135deg, #185FA5, #0F52BA)",
        color: "#fff",
        fontWeight: 600,
        fontSize: 14.5,
        cursor: submitting ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: submitting ? "none" : "0 10px 24px rgba(15,82,186,0.35)",
        fontFamily: "inherit"
    }),
    footer: {
        marginTop: 22,
        fontSize: 11.5,
        textAlign: "center",
        color: "#9aa5b6"
    }
};
