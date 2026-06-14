import { create } from "zustand";
import { persist } from "zustand/middleware";
import { delay } from "../utils/format";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("shopi-users") || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("shopi-users", JSON.stringify(users));
}

// Seed demo + admin accounts and migrate existing users without role
(function seedAndMigrate() {
  const users = loadUsers();

  // Ensure demo user exists with role
  const demoIdx = users.findIndex((u) => u.email === "demo@shopi.com");
  if (demoIdx === -1) {
    users.push({
      id: "user-demo",
      name: "Budi Santoso",
      email: "demo@shopi.com",
      password: "password123",
      phone: "0812-3456-7890",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
      addresses: [
        {
          id: "addr-1",
          label: "Home",
          name: "Budi Santoso",
          phone: "0812-3456-7890",
          fullAddress:
            "Jl. Merdeka No. 10, RT 01/RW 02, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta, 10310",
          isDefault: true,
        },
      ],
    });
  } else if (!users[demoIdx].role) {
    users[demoIdx].role = "user"; // migrate
  }

  // Ensure admin user exists
  const adminIdx = users.findIndex((u) => u.email === "admin@shopi.com");
  if (adminIdx === -1) {
    users.push({
      id: "user-admin",
      name: "Admin Shopi",
      email: "admin@shopi.com",
      password: "admin123",
      phone: "0811-0000-0001",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      addresses: [],
    });
  } else if (users[adminIdx].role !== "admin") {
    users[adminIdx].role = "admin"; // migrate
  }

  saveUsers(users);
})();

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await delay(500);
        const users = loadUsers();
        const found = users.find((u) => u.email === email);
        if (!found || found.password !== password) {
          throw new Error("Invalid email or password");
        }
        const { password: _pw, ...safeUser } = found;
        set({ user: safeUser, isAuthenticated: true });
        return safeUser;
      },

      register: async (name, email, password) => {
        await delay(500);
        const users = loadUsers();
        if (users.find((u) => u.email === email)) {
          throw new Error("Email already registered");
        }
        const newUser = {
          id: "user-" + Date.now(),
          name,
          email,
          password,
          phone: "",
          role: "user",  // ← new users are always "user"
          avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
          addresses: [],
        };
        users.push(newUser);
        saveUsers(users);
        const { password: _pw, ...safeUser } = newUser;
        set({ user: safeUser, isAuthenticated: true });
        return safeUser;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...updates };
        set({ user: updated });
        const users = loadUsers();
        const idx = users.findIndex((u) => u.id === current.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          saveUsers(users);
        }
      },

      addAddress: (address) => {
        const current = get().user;
        if (!current) return;
        const addresses = current.addresses || [];
        const newAddress = { ...address, id: "addr-" + Date.now() };
        if (newAddress.isDefault || addresses.length === 0) {
          addresses.forEach((a) => (a.isDefault = false));
          newAddress.isDefault = true;
        }
        const updated = { ...current, addresses: [...addresses, newAddress] };
        set({ user: updated });
        const users = loadUsers();
        const idx = users.findIndex((u) => u.id === current.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], addresses: updated.addresses };
          saveUsers(users);
        }
      },

      // Admin: change any user's role
      setUserRole: (userId, role) => {
        const users = loadUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
          users[idx].role = role;
          saveUsers(users);
        }
      },

      // Return all users (admin use only)
      getAllUsers: () => {
        return loadUsers().map(({ password: _pw, ...u }) => u);
      },
    }),
    { name: "shopi-auth" }
  )
);
