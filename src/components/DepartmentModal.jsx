import { useState } from "react";
import { useSelector } from "react-redux";

const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(10,25,41,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalBox = {
    background: "#fff",
    borderRadius: 14,
    width: 480,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
};

const inputWrap = {
    display: "flex",
    flexDirection: "column",
    gap: 4
};

const labelStyle = {
    fontSize: 12,
    color: "#666"
};

const inputStyle = {
    height: 36,
    borderRadius: 6,
    border: "1px solid #ddd",
    padding: "0 10px",
    fontSize: 13
};

const footer = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10
};

const btnPrimary = {
    background: "#185FA5",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer"
};

const btnCancel = {
    background: "#eee",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer"
};

export default function DepartmentModal({ onClose, onSubmit }) {
    const auth = useSelector((state) => state.auth?.auth || {});

    const [form, setForm] = useState({
        name: "",
        hod_name: "",
        created_by: "",
        updated_by: "",
        is_active: true
    });

    const handleSubmit = () => {
        if (!form.name || !form.hod_name) {
            console.error("Name & HOD required");
            return;
        }

        const payload = {
            name: form.name,
            hod_name: form.hod_name,
            created_by: auth?.name || "",
            updated_by: auth?.name || "",
            is_active: true
        };


        onSubmit?.(payload);
        onClose();
    };

    return (
        <div style={modalOverlay} onClick={onClose}>
            <div style={modalBox} onClick={(e) => e.stopPropagation()}>

                <h3 style={{ margin: 0 }}>Create Department</h3>

                <Input
                    label="Department Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                />

                <Input
                    label="HOD Name"
                    value={form.hod_name}
                    onChange={(v) => setForm({ ...form, hod_name: v })}
                />



                {/* ACTIVE SWITCH */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{ fontSize: 12 }}>Active</label>
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) =>
                            setForm({ ...form, is_active: e.target.checked })
                        }
                    />
                </div>

                <div style={footer}>
                    <button onClick={onClose} style={btnCancel}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit} style={btnPrimary}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- INPUT ---------- */

function Input({ label, value, onChange }) {
    return (
        <div style={inputWrap}>
            <label style={labelStyle}>{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
}