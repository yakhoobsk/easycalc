import { useEffect, useState } from "react";
import UserModal from "../components/usermodel";
import { useDispatch, useSelector } from "react-redux";
import { AllProfileDetails, createdeparment, deleteUser } from "../redux/services/profileService";
import { deptRolesDetails } from "../redux/services/settingsService";
import DepartmentModal from "../components/DepartmentModal";

/* ---------- BUTTONS ---------- */

const btnPrimary = {
    background: "linear-gradient(135deg, #185FA5, #0F52BA)",
    color: "#fff",
    border: "1px solid #0F52BA",
    padding: "9px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 2px 10px rgba(15,82,186,.28)"
};

const btnEdit = {
    marginRight: 8,
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    cursor: "pointer",
    background: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--gray-700)"
};

const btnDelete = {
    color: "var(--red-700)",
    border: "1px solid #F7C1C1",
    background: "var(--red-100)",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12.5,
    fontWeight: 600
};

/* ---------- TABLE ---------- */

const tableCard = {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: "1px solid var(--border)",
    boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 6px 18px rgba(15,23,42,.05)",
    overflowX: "auto"
};

const thCell = {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 10.5,
    color: "var(--gray-600)",
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    borderBottom: "2px solid var(--border)"
};

const tdCell = {
    padding: "12px 14px",
    fontSize: 13,
    borderBottom: "1px solid var(--gray-200)"
};

const avatar = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #185FA5, #0F52BA)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600
};

const badge = {
    background: "#EEF6FF",
    color: "#185FA5",
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    fontWeight: 700
};

const emptyState = {
    textAlign: "center",
    padding: 30,
    color: "#9CA3AF",
    fontSize: 13
};


export default function UsersPage() {
    const [openModal, setOpenModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const dispatch = useDispatch();
    const [tab, setTab] = useState("users");
    const deptRolesData = useSelector((state) => state.complexity?.deptRolesData || [])
    const users = useSelector((state) => state.profile?.allprofile || []);
    const [openDeptModal, setOpenDeptModal] = useState(false);

    useEffect(() => {
        dispatch(AllProfileDetails());
    }, [dispatch]);

    useEffect(() => {
        dispatch(deptRolesDetails())
    }, [dispatch])

    const handleDelete = async (user_id) => {

        try {
            await dispatch(deleteUser(user_id)).unwrap();

            dispatch(AllProfileDetails());

        } catch (err) {
            console.error(err || "Delete failed");
        }
    };

    function TabButton({ active, onClick, label }) {
        return (
            <button
                onClick={onClick}
                style={{
                    padding: "10px 16px",
                    border: "none",
                    borderBottom: active
                        ? "2px solid #185FA5"
                        : "2px solid transparent",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#185FA5" : "#6B7280"
                }}
            >
                {label}
            </button>
        );
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                    borderBottom: "1px solid #eee"
                }}
            >
                <TabButton
                    active={tab === "users"}
                    onClick={() => setTab("users")}
                    label="User Management"
                />

                <TabButton
                    active={tab === "dept"}
                    onClick={() => setTab("dept")}
                    label="Department Management"
                />
            </div>

            {tab === "users" &&
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20
                        }}
                    >
                        <div>
                            <h2 style={{ margin: 0 }}>Users</h2>
                            <div style={{ fontSize: 12, color: "#888" }}>
                                Manage system users
                            </div>
                        </div>

                        <button
                            className="ec-btn"
                            onClick={() => {
                                setEditUser(null);
                                setOpenModal(true);
                            }}
                            style={btnPrimary}
                        >
                            + Add User
                        </button>
                    </div>

                    {/* TABLE */}
                    <div style={tableCard}>
                        <table className="ec-table" style={{ width: "100%", borderCollapse: "collapse" }}>

                            {/* HEADER */}
                            <thead style={{ background: "linear-gradient(180deg, #F8FAFC, #F0F4F8)" }}>
                                <tr>
                                    <th style={thCell}>User</th>
                                    <th style={thCell}>Email</th>
                                    <th style={thCell}>Role</th>
                                    <th style={thCell}>Department</th>
                                    <th style={{ ...thCell, textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((u, i) => (
                                        <tr key={i}>
                                            {/* USER */}
                                            <td style={tdCell}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={avatar}>
                                                        {u?.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                                                </div>
                                            </td>

                                            <td style={tdCell}>{u.email}</td>

                                            <td style={tdCell}>
                                                <span style={badge}>{u.role_name}</span>
                                            </td>

                                            <td style={tdCell}>{u.department_name}</td>

                                            {/* ACTIONS */}
                                            <td style={{ ...tdCell, textAlign: "right" }}>
                                                <button
                                                    className="ec-btn"
                                                    style={btnEdit}
                                                    onClick={() => {
                                                        setEditUser(u);
                                                        setOpenModal(true);
                                                    }}
                                                >
                                                    <span>✏</span> Edit
                                                </button>
                                                <button
                                                    className="ec-btn"
                                                    style={btnDelete}
                                                    onClick={() => handleDelete(u.user_id)}
                                                >
                                                    🗑 Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={emptyState}>
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MODAL */}
                    {openModal && (
                        <UserModal
                            onClose={() => setOpenModal(false)}
                            editUser={editUser}
                        />
                    )}
                </>

            }

            {tab === "dept" && (
                <>
                    {/* HEADER */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20
                        }}
                    >
                        <div>
                            <h2 style={{ margin: 0 }}>Departments</h2>
                            <div style={{ fontSize: 12, color: "#888" }}>
                                Manage departments & roles
                            </div>
                        </div>

                        <button className="ec-btn" style={btnPrimary} onClick={() => setOpenDeptModal(true)}>
                            + Add Department
                        </button>
                    </div>

                    <div style={tableCard}>
                        <table className="ec-table" style={{ width: "100%", borderCollapse: "collapse" }}>

                            <thead style={{ background: "linear-gradient(180deg, #F8FAFC, #F0F4F8)" }}>
                                <tr>
                                    <th style={thCell}>Department</th>
                                    <th style={thCell}>HOD</th>
                                    <th style={thCell}>Roles</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody>
                                {deptRolesData?.length > 0 ? (
                                    deptRolesData.map((dept, i) => (
                                        <tr key={i}>
                                            {/* DEPT NAME */}
                                            <td style={tdCell}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={avatar}>
                                                        {dept?.department_name?.charAt(0)}
                                                    </div>
                                                    <span style={{ fontWeight: 500 }}>
                                                        {dept.department_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* HOD */}
                                            <td style={tdCell}>{dept.hod_name || "-"}</td>

                                            {/* ROLES */}
                                            <td style={tdCell}>
                                                {dept.roles?.length > 0 ? (
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                        {dept.roles.slice(0, 3).map((r, idx) => (
                                                            <span key={idx} style={badge}>
                                                                {r.role_name}
                                                            </span>
                                                        ))}

                                                        {dept.roles.length > 3 && (
                                                            <span style={{ fontSize: 11, color: "#888" }}>
                                                                +{dept.roles.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#999" }}>No roles</span>
                                                )}
                                            </td>



                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={emptyState}>
                                            No departments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {openDeptModal && (
                        <DepartmentModal
                            onClose={() => setOpenDeptModal(false)}
                            onSubmit={(payload) => {
                                dispatch(createdeparment(payload))
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}