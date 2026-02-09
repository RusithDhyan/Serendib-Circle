"use client";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { countries } from "../../(contact)/CountryCodes";
import { useSession } from "next-auth/react";

export default function AddUsers({ onClose, editingAddUsers }) {
  const { data: session } = useSession();
  const [addUsers, setAddUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAddUsersId, setEditingAddUsersId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    countryCode: "",
  });

  // All roles
  const roles = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Moderator", value: "moderator" },
    { label: "Guest", value: "guest" },
  ];

  // Role hierarchy (higher = more power)
  const ROLE_LEVEL = {
    owner: 5,
    admin: 4,
    manager: 3,
    supervisor: 2,
    moderator: 1,
    guest: 0,
  };

  const allowedRoles = useMemo(() => {
    if (!session || !session.user.role) return roles;

    const currentLevel = ROLE_LEVEL[session.user.role.toLowerCase()];
    const editableRole = editingAddUsers?.role?.toLowerCase() || "";

    return roles.filter(
      (r) => ROLE_LEVEL[r.value] < currentLevel || r.value === editableRole
    );
  }, [session, editingAddUsers]);

  console.log(allowedRoles);

  // Fetch users
  const fetchAddUsers = async () => {
    try {
      const res = await fetch("/api/site-admin/users");
      const data = await res.json();
      if (data.success) setAddUsers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddUsers();
  }, []);

  // Set form for editing
  useEffect(() => {
    if (editingAddUsers) {
      setForm({
        name: editingAddUsers.name || "",
        email: editingAddUsers.email || "",
        password: editingAddUsers.password || "",
        role: editingAddUsers.role || "",
        phone: editingAddUsers.phone || "",
        countryCode: editingAddUsers.countryCode || "",
      });
      setEditingAddUsersId(editingAddUsers._id);
    }
  }, [editingAddUsers]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("phone", `${form.countryCode}${form.phone}`);

    try {
      let res;
      if (editingAddUsersId) {
        res = await fetch(`/api/site-admin/users/${editingAddUsersId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/site-admin/users", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }

      const result = await res.json();
      if (result.success) {
        setForm({
          name: "",
          email: "",
          password: "",
          role: "",
          phone: "",
          countryCode: "",
        });
        setEditingAddUsersId(null);
        fetchAddUsers();
        onClose();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (!session?.user) return <p>Not logged in</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl relative">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingAddUsersId ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">-- Select Role --</option>
                {allowedRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <small className="text-red-500">
                You don't have permission to add higher roles
              </small>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-md pr-10"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold">Phone</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={form.countryCode}
                  onChange={(e) =>
                    setForm({ ...form, countryCode: e.target.value })
                  }
              
                  className="border-b px-4 py-2 bg-white w-full sm:w-1/1"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  required
                  disabled={!form.countryCode}
                  className={`border-b px-4 py-2 w-full ${
                    !form.countryCode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingAddUsersId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
