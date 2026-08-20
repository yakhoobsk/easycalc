import { useState } from "react";
import { useSelector } from "react-redux";
import { Building2 } from "lucide-react";
import { Modal, FormGroup, Input, Switch, Btn } from "./UI.jsx";
import { showSnackbar } from "../utils/snackbar";

export default function DepartmentModal({ onClose, onSubmit }) {
  const auth = useSelector((state) => state.auth?.auth || {});
  const [form, setForm] = useState({
    name: "",
    hod_name: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.hod_name.trim()) {
      showSnackbar("warning", "Department name and HOD name are required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      hod_name: form.hod_name.trim(),
      created_by: auth?.name || "",
      updated_by: auth?.name || "",
      is_active: form.is_active,
    };

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={16} /> Create department
        </span>
      }
      onClose={onClose}
      width={440}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Btn>
          <Btn variant="navy" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create department"}
          </Btn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FormGroup label="Department name">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Integration"
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Head of department">
          <Input
            value={form.hod_name}
            onChange={(e) => setForm({ ...form, hod_name: e.target.value })}
            placeholder="e.g. Jane Doe"
          />
        </FormGroup>

        <Switch
          checked={form.is_active}
          onChange={(v) => setForm({ ...form, is_active: v })}
          label="Active"
          hint="Inactive departments are hidden from role assignment"
        />
      </div>
    </Modal>
  );
}
