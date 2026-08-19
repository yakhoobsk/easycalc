import { useEffect, useState } from "react";
import {
    AllProfileDetails,
    createUser,
    updateUser
} from "../redux/services/profileService";
import { useDispatch, useSelector } from "react-redux";
import { deptRolesDetails } from "../redux/services/settingsService";


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
    width: 520,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: 10
};

const inputWrap = {
    display: "flex",
    flexDirection: "column",
    gap: 4
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
    gap: 10,
    marginTop: 10
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
    background: "#f3f4f6",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer"
};


export default function UserModal({ onClose, editUser }) {
    const dispatch = useDispatch();

    const deptRolesData =
        useSelector((state) => state.complexity?.deptRolesData || []);

    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        dispatch(deptRolesDetails());
    }, [dispatch]);

    const [form, setForm] = useState({
        name: editUser?.name || "",
        email: editUser?.email || "",
        password: "",
        role_id: editUser?.role_id || "",
        department_id: editUser?.department_id || "",
        is_active: true
    });

    const isEdit = !!editUser;

    const handleDeptChange = (deptId) => {
        setForm({
            ...form,
            department_id: deptId,
            role_id: ""
        });

        const selectedDept = deptRolesData.find(
            (d) => d.department_id === deptId
        );

        setRolesList(selectedDept?.roles || []);
    };

    useEffect(() => {
        if (editUser && deptRolesData.length > 0) {
            const selectedDept = deptRolesData.find(
                (d) => d.department_id === editUser.department_id
            );

            setRolesList(selectedDept?.roles || []);
        }
    }, [editUser, deptRolesData]);

    const handleSubmit = async () => {
        if (!form.name || !form.email) {
            alert("Name & Email required");
            return;
        }

        if (!isEdit && !form.password) {
            alert("Password required");
            return;
        }

        try {
            if (isEdit) {
                await dispatch(
                    updateUser({
                        user_id: editUser?.user_id,
                        payload: {
                            ...form,
                            updated_by: form.email
                        }
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createUser({
                        ...form,
                        created_by: form.email,
                        updated_by: ""
                    })
                ).unwrap();
            }

            dispatch(AllProfileDetails());
            onClose();
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div style={modalOverlay} onClick={onClose}>
            <div style={modalBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div style={headerStyle}>
                    <h3>{isEdit ? "Update User" : "Add User"}</h3>
                    <span onClick={onClose} style={{ cursor: "pointer" }}>✕</span>
                </div>

                {/* FORM */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    <Input
                        label="Name"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                    />

                    <Input
                        label="Email"
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                    />

                    {!isEdit && (
                        <Input
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(v) => setForm({ ...form, password: v })}
                        />
                    )}

                    <Select
                        label="Department"
                        value={form.department_id}
                        onChange={handleDeptChange}
                        options={deptRolesData.map((d) => ({
                            label: d.department_name,
                            value: d.department_id
                        }))}
                    />

                    <Select
                        label="Role"
                        value={form.role_id}
                        onChange={(v) =>
                            setForm({ ...form, role_id: v })
                        }
                        options={rolesList.map((r) => ({
                            label: r.role_name,
                            value: r.role_id
                        }))}
                    />
                </div>

                {/* ACTIONS */}
                <div style={footer}>
                    <button onClick={onClose} style={btnCancel}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit} style={btnPrimary}>
                        {isEdit ? "Update User" : "Create User"}
                    </button>
                </div>
            </div>
        </div>
    );
}


function Input({ label, value, onChange, type = "text" }) {
    return (
        <div style={inputWrap}>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
}


function Select({ label, value, onChange, options }) {
    return (
        <div style={inputWrap}>
            <label>{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            >
                <option value="">Select {label}</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}