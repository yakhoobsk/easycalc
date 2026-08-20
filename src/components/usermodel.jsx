import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, UserCog } from "lucide-react";
import {
  AllProfileDetails,
  createUser,
  updateUser,
} from "../redux/services/profileService";
import { deptRolesDetails } from "../redux/services/settingsService";
import { Modal, FormGroup, Input, Select, Btn } from "./UI.jsx";
import { showSnackbar } from "../utils/snackbar";

export default function UserModal({ onClose, editUser }) {
  const dispatch = useDispatch();

  const deptRolesData = useSelector((state) => state.complexity?.deptRolesData || []);

  const [rolesList, setRolesList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(deptRolesDetails());
  }, [dispatch]);

  const [form, setForm] = useState({
    name: editUser?.name || "",
    email: editUser?.email || "",
    password: "",
    role_id: editUser?.role_id || "",
    department_id: editUser?.department_id || "",
    is_active: true,
  });

  const isEdit = !!editUser;

  const handleDeptChange = (deptId) => {
    setForm({ ...form, department_id: deptId, role_id: "" });

    const selectedDept = deptRolesData.find((d) => d.department_id === deptId);
    setRolesList(selectedDept?.roles || []);
  };

  useEffect(() => {
    if (editUser && deptRolesData.length > 0) {
      const selectedDept = deptRolesData.find((d) => d.department_id === editUser.department_id);
      setRolesList(selectedDept?.roles || []);
    }
  }, [editUser, deptRolesData]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      showSnackbar("warning", "Name and email are required");
      return;
    }

    if (!isEdit && !form.password) {
      showSnackbar("warning", "Password is required for new users");
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit) {
        await dispatch(
          updateUser({
            user_id: editUser?.user_id,
            payload: { ...form, updated_by: form.email },
          })
        ).unwrap();
        showSnackbar("success", "User updated successfully");
      } else {
        await dispatch(
          createUser({ ...form, created_by: form.email, updated_by: "" })
        ).unwrap();
        showSnackbar("success", "User created successfully");
      }

      dispatch(AllProfileDetails());
      onClose();
    } catch (err) {
      showSnackbar("error", typeof err === "string" ? err : err?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isEdit ? <UserCog size={16} /> : <UserPlus size={16} />}
          {isEdit ? "Update user" : "Add user"}
        </span>
      }
      onClose={onClose}
      width={520}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Btn>
          <Btn variant="navy" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update user" : "Create user"}
          </Btn>
        </>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 560 ? "1fr" : "1fr 1fr",
          gap: 14,
        }}
      >
        <FormGroup label="Name">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@company.com"
          />
        </FormGroup>

        {!isEdit && (
          <FormGroup label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </FormGroup>
        )}

        <FormGroup label="Department">
          <Select value={form.department_id} onChange={(e) => handleDeptChange(e.target.value)}>
            <option value="">Select department</option>
            {deptRolesData.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="Role">
          <Select
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            disabled={!form.department_id}
          >
            <option value="">Select role</option>
            {rolesList.map((r) => (
              <option key={r.role_id} value={r.role_id}>
                {r.role_name}
              </option>
            ))}
          </Select>
        </FormGroup>
      </div>
    </Modal>
  );
}
