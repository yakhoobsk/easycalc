import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, UserPlus, Building2, Users as UsersIcon } from "lucide-react";
import UserModal from "../components/usermodel";
import DepartmentModal from "../components/DepartmentModal";
import { AllProfileDetails, createdeparment, deleteUser } from "../redux/services/profileService";
import { deptRolesDetails } from "../redux/services/settingsService";
import { showSnackbar } from "../utils/snackbar";
import {
  PageHeader,
  Card,
  Btn,
  IconBtn,
  Badge,
  DeptBadge,
  TableWrap,
  Th,
  Td,
  EmptyState,
  SearchInput,
} from "../components/UI.jsx";

const avatarStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #185FA5, #0F52BA)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
};

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "users", label: "User management", icon: <UsersIcon size={14} /> },
    { id: "dept", label: "Department management", icon: <Building2 size={14} /> },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 4,
        background: "var(--gray-100)",
        padding: 4,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            className="ec-btn"
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              border: "none",
              borderRadius: 9,
              padding: "8px 16px",
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              background: active ? "#fff" : "transparent",
              color: active ? "var(--navy-800)" : "var(--text-secondary)",
              boxShadow: active ? "0 1px 3px rgba(15,23,42,.12)" : "none",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default function UsersPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [openDeptModal, setOpenDeptModal] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [tab, setTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");

  const dispatch = useDispatch();
  const deptRolesData = useSelector((state) => state.complexity?.deptRolesData || []);
  const users = useSelector((state) => state.profile?.allprofile || []);
  const usersLoading = useSelector((state) => state.profile?.loading);

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return true;
    return [u.name, u.email, u.role_name, u.department_name]
      .some((v) => v?.toLowerCase().includes(q));
  });

  const filteredDepts = deptRolesData.filter((d) => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return true;
    return [d.department_name, d.hod_name].some((v) => v?.toLowerCase().includes(q));
  });

  useEffect(() => {
    dispatch(AllProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    dispatch(deptRolesDetails());
  }, [dispatch]);

  const handleDelete = async (user) => {
    try {
      setDeletingId(user.user_id);
      await dispatch(deleteUser(user.user_id)).unwrap();
      showSnackbar("success", `${user.name || "User"} deleted successfully`);
      dispatch(AllProfileDetails());
    } catch (err) {
      showSnackbar("error", typeof err === "string" ? err : err?.message || "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb={["Configuration", "Users"]}
        title="Users & departments"
        subtitle="Manage who has access to EasyCalc and how departments and roles are organized."
      />

      <TabBar tab={tab} setTab={setTab} />

      {tab === "users" && (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 4, height: 16, borderRadius: 4, background: "linear-gradient(180deg, #2F80ED, #0F52BA)" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy-800)" }}>System users</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                  {users.length} {users.length === 1 ? "user" : "users"} with access to this workspace
                </div>
              </div>
            </div>

            <Btn
              variant="navy"
              onClick={() => {
                setEditUser(null);
                setOpenModal(true);
              }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <UserPlus size={15} /> Add user
            </Btn>
          </div>

          {usersLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<UsersIcon size={22} />}
              title="No users yet"
              description="Add your first teammate to give them access to EasyCalc."
              action={
                <Btn variant="navy" onClick={() => { setEditUser(null); setOpenModal(true); }}>
                  + Add user
                </Btn>
              }
            />
          ) : (
            <>
              <SearchInput
                value={userSearch}
                onChange={setUserSearch}
                placeholder="Search by name, email, role, or department..."
              />
              {filteredUsers.length === 0 ? (
                <EmptyState title="No matching users" description={`No user matches "${userSearch}".`} />
              ) : (
              <TableWrap style={{ marginBottom: 0 }} maxHeight={420}>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Department</Th>
                  <Th center>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u.user_id ?? i} className="ec-row-hover" style={{ background: i % 2 === 0 ? "#fff" : "var(--gray-50)" }}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={avatarStyle}>{u?.name?.charAt(0)?.toUpperCase() || "?"}</div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </Td>
                    <Td style={{ color: "var(--text-secondary)" }}>{u.email}</Td>
                    <Td><Badge variant="blue">{u.role_name || "—"}</Badge></Td>
                    <Td><DeptBadge dept={u.department_name} /></Td>
                    <Td center>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <IconBtn
                          title="Edit user"
                          onClick={() => {
                            setEditUser(u);
                            setOpenModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </IconBtn>
                        <IconBtn
                          title="Delete user"
                          variant="danger"
                          disabled={deletingId === u.user_id}
                          onClick={() => handleDelete(u)}
                        >
                          <Trash2 size={14} />
                        </IconBtn>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
              </TableWrap>
              )}
            </>
          )}
        </Card>
      )}

      {tab === "dept" && (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 4, height: 16, borderRadius: 4, background: "linear-gradient(180deg, #2F80ED, #0F52BA)" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy-800)" }}>Departments</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                  {deptRolesData.length} {deptRolesData.length === 1 ? "department" : "departments"} configured
                </div>
              </div>
            </div>

            <Btn
              variant="navy"
              onClick={() => setOpenDeptModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Building2 size={15} /> Add department
            </Btn>
          </div>

          {deptRolesData.length === 0 ? (
            <EmptyState
              icon={<Building2 size={22} />}
              title="No departments yet"
              description="Create a department to start organizing roles under it."
              action={
                <Btn variant="navy" onClick={() => setOpenDeptModal(true)}>
                  + Add department
                </Btn>
              }
            />
          ) : (
            <>
              <SearchInput
                value={deptSearch}
                onChange={setDeptSearch}
                placeholder="Search by department or HOD..."
              />
              {filteredDepts.length === 0 ? (
                <EmptyState title="No matching departments" description={`No department matches "${deptSearch}".`} />
              ) : (
              <TableWrap style={{ marginBottom: 0 }} maxHeight={420}>
              <thead>
                <tr>
                  <Th>Department</Th>
                  <Th>HOD</Th>
                  <Th>Roles</Th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map((dept, i) => (
                  <tr key={dept.department_id ?? i} className="ec-row-hover" style={{ background: i % 2 === 0 ? "#fff" : "var(--gray-50)" }}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={avatarStyle}>{dept?.department_name?.charAt(0)?.toUpperCase() || "?"}</div>
                        <span style={{ fontWeight: 600 }}>{dept.department_name}</span>
                      </div>
                    </Td>
                    <Td style={{ color: "var(--text-secondary)" }}>{dept.hod_name || "—"}</Td>
                    <Td>
                      {dept.roles?.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                          {dept.roles.slice(0, 3).map((r, idx) => (
                            <Badge key={idx} variant="gray">{r.role_name}</Badge>
                          ))}
                          {dept.roles.length > 3 && (
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                              +{dept.roles.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>No roles yet</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
              </TableWrap>
              )}
            </>
          )}
        </Card>
      )}

      {openModal && (
        <UserModal
          onClose={() => setOpenModal(false)}
          editUser={editUser}
        />
      )}

      {openDeptModal && (
        <DepartmentModal
          onClose={() => setOpenDeptModal(false)}
          onSubmit={async (payload) => {
            try {
              await dispatch(createdeparment(payload)).unwrap();
              showSnackbar("success", "Department created successfully");
              dispatch(deptRolesDetails());
            } catch (err) {
              showSnackbar("error", typeof err === "string" ? err : err?.message || "Failed to create department");
            }
          }}
        />
      )}
    </div>
  );
}
