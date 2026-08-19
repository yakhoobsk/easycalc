import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Hash, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { ProfileDetails } from "../redux/services/profileService";
import { Card, PageHeader } from "../components/UI.jsx";
import { DEPT_COLORS } from "../constants.js";

const FIELDS = [
    { icon: Mail, label: "Email", key: "email" },
    { icon: Hash, label: "User ID", key: "user_id" },
    { icon: Briefcase, label: "Role", key: "role_name" },
    { icon: Building2, label: "Department", key: "department_name" },
];

export default function ProfilePage() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth?.auth || {});
    const profile = useSelector((state) => state.profile?.profile || {});
    const loading = useSelector((state) => state.profile?.loading);

    useEffect(() => {
        if (auth?.user_id) {
            dispatch(ProfileDetails(auth.user_id));
        }
    }, [dispatch, auth?.user_id]);

    if (loading) {
        return (
            <div>
                <PageHeader
                    breadcrumb={["Account", "Profile"]}
                    title="Profile"
                    subtitle="Your account details and role information."
                />
                <div className="ec-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13, borderRadius: 16, border: "1px solid var(--border)" }}>
                    Loading profile...
                </div>
            </div>
        );
    }

    const dc = DEPT_COLORS[profile?.department_name] || DEPT_COLORS.PM;

    return (
        <div>
            <PageHeader
                breadcrumb={["Account", "Profile"]}
                title="Profile"
                subtitle="Your account details and role information."
            />

            <div style={styles.heroCard}>
                <div style={styles.banner}>
                    <div style={styles.bannerGlow} />
                </div>

                <div style={styles.avatarWrap}>
                    <div style={styles.avatar}>
                        {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </div>

                <div style={styles.identity}>
                    <div style={styles.name}>{profile?.name || "—"}</div>
                    <div style={styles.role}>{profile?.role_name || "—"}</div>

                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        <span style={{ ...styles.badge, background: dc.bg, color: dc.text }}>
                            {profile?.department_name || "—"}
                        </span>
                        <span style={styles.activeBadge}>
                            <ShieldCheck size={12} /> Active account
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.grid}>
                {FIELDS.map(({ icon: Icon, label, key }) => (
                    <Card key={key} style={styles.fieldCard}>
                        <div style={styles.fieldIcon}>
                            <Icon size={17} color="#185FA5" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={styles.fieldLabel}>{label}</div>
                            <div style={styles.fieldValue}>{profile?.[key] || "—"}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const styles = {
    heroCard: {
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 6px 18px rgba(15,23,42,.05)",
        marginBottom: 20,
        background: "#fff",
    },
    banner: {
        height: 96,
        background: "linear-gradient(135deg, #0a2f6b 0%, #0F52BA 55%, #185FA5 100%)",
        position: "relative",
        overflow: "hidden",
    },
    bannerGlow: {
        position: "absolute",
        top: -60,
        right: -40,
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(144,202,249,0.35), transparent 70%)",
    },
    avatarWrap: {
        position: "absolute",
        left: 24,
        top: 52,
        width: 88,
        height: 88,
        borderRadius: "50%",
        background: "#fff",
        padding: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #185FA5, #0F52BA)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        fontWeight: 700,
    },
    identity: {
        paddingLeft: 130,
        paddingRight: 24,
        paddingTop: 14,
        paddingBottom: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 700,
        color: "var(--navy-800)",
    },
    role: {
        fontSize: 13,
        color: "var(--text-secondary)",
        marginTop: 2,
    },
    badge: {
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
    },
    activeBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        background: "var(--green-100)",
        color: "var(--green-700)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
    },
    fieldCard: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        marginBottom: 0,
    },
    fieldIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: "var(--blue-50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    fieldLabel: {
        fontSize: 11,
        color: "var(--text-muted)",
        fontWeight: 600,
        marginBottom: 3,
    },
    fieldValue: {
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-primary)",
        wordBreak: "break-word",
    },
};
