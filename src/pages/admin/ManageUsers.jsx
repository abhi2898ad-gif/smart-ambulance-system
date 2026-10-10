import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { userService } from "../../services/userService";
import { Search, UserPlus, Trash2, Power, User, Shield, Phone, Mail } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "USER",
    bloodGroup: "O+",
    address: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await userService.getUsers();
    setUsers(list);
  };

  const handleToggleStatus = async (id) => {
    await userService.toggleUserStatus(id);
    loadUsers();
    setToastMessage("User account status updated.");
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await userService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      loadUsers();
      setToastMessage("User successfully removed.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const created = await userService.updateUser(users.length + 1, {
      id: users.length + 1,
      ...newUser,
      active: true,
      createdAt: new Date().toISOString()
    });
    setShowAddModal(false);
    setNewUser({ fullName: "", email: "", phone: "", role: "USER", bloodGroup: "O+", address: "" });
    loadUsers();
    setToastMessage("New user registered successfully.");
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      ((u.fullName || u.name || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((u.email || "")).toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <PageHeader
        title="User & Account Management"
        subtitle="Manage patients, drivers, hospital representatives, and administrators"
        badge={<span className="badge bg-light text-secondary border">{users.length} Registered Accounts</span>}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <UserPlus size={16} /> Register New Account
          </button>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* FILTER BAR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by full name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            {["ALL", "USER", "DRIVER", "HOSPITAL", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${
                  roleFilter === r ? "btn-primary" : "btn-light border"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Account Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="small">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">#{u.id}</td>
                  <td>
                    <div className="fw-medium text-dark">{u.fullName}</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>{u.email}</span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        u.role === "ADMIN"
                          ? "bg-danger-subtle text-danger"
                          : u.role === "DRIVER"
                          ? "bg-warning-subtle text-warning"
                          : u.role === "HOSPITAL"
                          ? "bg-info-subtle text-info"
                          : "bg-primary-subtle text-primary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.phone}</td>
                  <td>
                    <span className="badge bg-light text-danger border">{u.bloodGroup || "O+"}</span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        u.active ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {u.active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`btn btn-sm ${u.active ? "btn-light text-warning" : "btn-light text-success"} border`}
                        title={u.active ? "Suspend User" : "Activate User"}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="btn btn-sm btn-light text-danger border"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New System Account"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateUser}>
              Create User
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateUser}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Full Name</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Email</label>
              <input
                type="email"
                className="form-control bg-light"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Phone Number</label>
              <input
                type="tel"
                className="form-control bg-light"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">System Role</label>
              <select
                className="form-select bg-light"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="USER">USER (Patient)</option>
                <option value="DRIVER">DRIVER (Paramedic)</option>
                <option value="HOSPITAL">HOSPITAL (Desk)</option>
                <option value="ADMIN">ADMIN (Super)</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Blood Group</label>
              <select
                className="form-select bg-light"
                value={newUser.bloodGroup}
                onChange={(e) => setNewUser({ ...newUser, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O+">O+</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">City Address</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User Account"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-danger rounded-pill px-4" onClick={handleDelete}>
              Confirm Delete
            </button>
          </>
        }
      >
        <p className="mb-0 text-secondary">
          Are you sure you want to permanently delete user account <strong>{deleteTarget?.fullName}</strong> ({deleteTarget?.email})?
        </p>
      </Modal>
    </div>
  );
};

export default ManageUsers;
