// File: app/page.tsx
"use client";

import { useState } from "react";
import { backend } from "@/declarations/backend";
import { User } from "@/declarations/backend/backend.did";
import { Result } from "@/declarations/backend/backend.did";

export default function Page() {
  //
  // ─── STATE FOR CREATE / UPDATE FORM ────────────────────────────────────────────
  //
  const [createId, setCreateId] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createStatus, setCreateStatus] = useState<string | null>(null);

  //
  // ─── STATE FOR GET BY ID ────────────────────────────────────────────────────────
  //
  const [queryId, setQueryId] = useState("");
  const [fetchedById, setFetchedById] = useState<User | null>(null);
  const [errorById, setErrorById] = useState<string | null>(null);

  //
  // ─── STATE FOR GET BY EMAIL ─────────────────────────────────────────────────────
  //
  const [queryEmail, setQueryEmail] = useState("");
  const [fetchedByEmail, setFetchedByEmail] = useState<User | null>(null);
  const [errorByEmail, setErrorByEmail] = useState<string | null>(null);

  //
  // ─── STATE FOR UPDATE FORM ─────────────────────────────────────────────────────
  //
  const [updateId, setUpdateId] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  //
  // ─── STATE FOR DELETE ───────────────────────────────────────────────────────────
  //
  const [deleteId, setDeleteId] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  //
  // ─── HANDLERS ──────────────────────────────────────────────────────────────────
  //

  // CREATE USER
  const handleCreate = async () => {
    setCreateStatus(null);
    const nowNs: bigint = BigInt(Date.now()) * 1_000_000n;

    const newUser: User = {
      id: createId,
      email: createEmail,
      password: createPassword,
      username: createUsername,
      createdAt: nowNs,
    };

    try {
      const res: Result = await backend.createUser(newUser); // async Result<(), Text>
      if ("ok" in res) {
        setCreateStatus("✅ Created successfully");
      } else {
        setCreateStatus(`❌ Error: ${res.err}`);
      }
    } catch (e) {
      setCreateStatus(`❌ Unexpected error: ${e}`);
    }
  };

  // GET USER BY ID
  const handleGetById = async () => {
    setFetchedById(null);
    setErrorById(null);

    try {
      const user: [User] | [] = await backend.getUserById(queryId);
      if (user === null || user.length === 0) {
        setErrorById("User not found");
      } else {
        setFetchedById(user[0]);
      }
    } catch (e) {
      setErrorById(`Error: ${e}`);
    }
  };

  // GET USER BY EMAIL
  const handleGetByEmail = async () => {
    setFetchedByEmail(null);
    setErrorByEmail(null);

    try {
      const user: [User] | [] = await backend.getUserByEmail(queryEmail);
      if (user === null || user.length === 0) {
        setErrorByEmail("User not found");
      } else {
        setFetchedByEmail(user[0]);
      }
    } catch (e) {
      setErrorByEmail(`Error: ${e}`);
    }
  };

  // UPDATE USER
  const handleUpdate = async () => {
    setUpdateStatus(null);

    // We will override createdAt with current time for simplicity
    const nowNs: bigint = BigInt(Date.now()) * 1_000_000n;
    const updatedUser: User = {
      id: updateId,
      email: updateEmail,
      password: updatePassword,
      username: updateUsername,
      createdAt: nowNs,
    };

    try {
      const res: Result = await backend.updateUser(updatedUser);
      if ("ok" in res) {
        setUpdateStatus("✅ Updated successfully");
      } else {
        setUpdateStatus(`❌ Error: ${res.err}`);
      }
    } catch (e) {
      setUpdateStatus(`❌ Unexpected error: ${e}`);
    }
  };

  // DELETE USER
  const handleDelete = async () => {
    setDeleteStatus(null);

    try {
      const res: Result = await backend.deleteUser(deleteId);
      if ("ok" in res) {
        setDeleteStatus("✅ Deleted successfully");
      } else {
        setDeleteStatus(`❌ Error: ${res.err}`);
      }
    } catch (e) {
      setDeleteStatus(`❌ Unexpected error: ${e}`);
    }
  };

  //
  // ─── RENDER ───────────────────────────────────────────────────────────────────
  //
  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-12">

        {/* ─── CREATE USER ───────────────────────────────────────────────────────────── */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create User</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="ID (e.g. user123)"
              className="w-full p-2 border border-gray-300 rounded"
              value={createId}
              onChange={(e) => setCreateId(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create
            </button>
            {createStatus && (
              <p className="mt-2 text-sm">{createStatus}</p>
            )}
          </div>
        </section>

        {/* ─── GET USER BY ID ────────────────────────────────────────────────────────── */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Get User By ID</h2>
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter user ID"
              className="flex-grow p-2 border border-gray-300 rounded"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
            />
            <button
              onClick={handleGetById}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Fetch
            </button>
          </div>
          {errorById && <p className="mt-2 text-red-500">{errorById}</p>}
          {fetchedById && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p><strong>ID:</strong> {fetchedById.id}</p>
              <p><strong>Email:</strong> {fetchedById.email}</p>
              <p><strong>Username:</strong> {fetchedById.username}</p>
              <p>
                <strong>CreatedAt:</strong>{" "}
                {new Date(Number(fetchedById.createdAt / BigInt(1_000_000))).toLocaleString()}
              </p>
            </div>
          )}
        </section>

        {/* ─── GET USER BY EMAIL ─────────────────────────────────────────────────────── */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Get User By Email</h2>
          <div className="flex space-x-2 items-center">
            <input
              type="email"
              placeholder="Enter user email"
              className="flex-grow p-2 border border-gray-300 rounded"
              value={queryEmail}
              onChange={(e) => setQueryEmail(e.target.value)}
            />
            <button
              onClick={handleGetByEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Fetch
            </button>
          </div>
          {errorByEmail && <p className="mt-2 text-red-500">{errorByEmail}</p>}
          {fetchedByEmail && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p><strong>ID:</strong> {fetchedByEmail.id}</p>
              <p><strong>Email:</strong> {fetchedByEmail.email}</p>
              <p><strong>Username:</strong> {fetchedByEmail.username}</p>
              <p>
                <strong>CreatedAt:</strong>{" "}
                {new Date(Number(fetchedByEmail.createdAt / BigInt(1_000_000))).toLocaleString()}
              </p>
            </div>
          )}
        </section>

        {/* ─── UPDATE USER ───────────────────────────────────────────────────────────── */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Update User</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Existing User ID"
              className="w-full p-2 border border-gray-300 rounded"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
            />
            <input
              type="email"
              placeholder="New Email"
              className="w-full p-2 border border-gray-300 rounded"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border border-gray-300 rounded"
              value={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={updateUsername}
              onChange={(e) => setUpdateUsername(e.target.value)}
            />
            <button
              onClick={handleUpdate}
              className="mt-2 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update
            </button>
            {updateStatus && (
              <p className="mt-2 text-sm">{updateStatus}</p>
            )}
          </div>
        </section>

        {/* ─── DELETE USER ───────────────────────────────────────────────────────────── */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter user ID to delete"
              className="flex-grow p-2 border border-gray-300 rounded"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          {deleteStatus && <p className="mt-2 text-sm">{deleteStatus}</p>}
        </section>
      </div>
    </div>
  );
}
