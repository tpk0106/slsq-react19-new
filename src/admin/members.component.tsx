import { Button, TextField, Typography, Alert } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getAuthHeaders } from "../config/api";
import { Member } from "../model/member";

const defaultMemberForm: Member = {
  id: undefined,
  post: "",
  name: "",
};

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberForm, setMemberForm] = useState<Member>({ ...defaultMemberForm });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("slsq-token");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/about/members`);
      const data = await response.json();
      setMembers(
        data.map((m: any) => ({
          id: m.Id,
          post: m.Post,
          name: m.Name,
          displayOrder: m.DisplayOrder,
        }))
      );
    } catch (err) {
      setError("Failed to load members.");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMemberForm({ ...memberForm, [name]: value });
  };

  const resetForm = () => {
    setMemberForm({ ...defaultMemberForm });
    setEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (rowData: Member) => {
    setMemberForm({ ...rowData });
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!memberForm.post.trim() || !memberForm.name.trim()) {
      setError("Post and Name are required.");
      return;
    }

    try {
      if (editing && memberForm.id) {
        const response = await fetch(
          `${API_BASE}/api/about/members/${memberForm.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              post: memberForm.post,
              name: memberForm.name,
              displayOrder: memberForm.displayOrder || 0,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Update failed.");
          return;
        }
        setSuccess("Member updated successfully.");
      } else {
        const response = await fetch(`${API_BASE}/api/about/members`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            post: memberForm.post,
            name: memberForm.name,
            displayOrder: memberForm.displayOrder || 0,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Create failed.");
          return;
        }
        setSuccess("Member added successfully.");
      }

      await fetchMembers();
      setMemberForm({ ...defaultMemberForm });
      setEditing(false);
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  const handleDelete = async (member: Member) => {
    if (!member.id) return;
    if (!window.confirm(`Delete "${member.post} - ${member.name}"?`)) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/about/members/${member.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Delete failed.");
        return;
      }

      setSuccess("Member deleted.");
      await fetchMembers();
    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div
      className="w-[95%] md:w-[50%] my-5 mx-auto
                m-auto rounded-[1em] border border-[#e0e0e0]
                shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)] text-black"
    >
      <div className="flex justify-between items-center mx-5 mt-3">
        <h2 className="text-2xl font-bold text-[#7F1734]">
          SLSQ Members
        </h2>
        <div className="flex gap-2">
          <button
            onClick={resetForm}
            className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            + New Member
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            Back to Admin
          </button>
        </div>
      </div>

      {error && (
        <Alert severity="error" sx={{ mx: 2, mt: 1 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mx: 2, mt: 1 }}>
          {success}
        </Alert>
      )}

      <div className="w-[100%] m-auto py-4">
        <table className="w-[90%] m-auto rounded-[.2em]">
          <thead>
            <tr className="bg-[#800020] text-white rounded-[.2em]">
              <td className="w-[25%] p-2">Post</td>
              <td className="w-[45%] p-2">Name</td>
              <td className="w-[30%] p-2">Action</td>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={member.id || index}
                className="border-b border-[#e0e0e0]"
                style={{
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f5e6ea",
                }}
              >
                <td className="p-2">{member.post}</td>
                <td className="p-2">{member.name}</td>
                <td className="p-2">
                  <button
                    className="mr-3 text-blue-600 underline text-sm"
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 underline text-sm"
                    onClick={() => handleDelete(member)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex w-[100%] m-auto pb-6">
        <div className="flex flex-col w-[50%] m-auto">
          <Typography
            style={{ marginTop: "10px" }}
            variant="h6"
            className="flex flex-col"
          >
            Post
          </Typography>
          <TextField
            name="post"
            label="Post"
            margin="normal"
            size="small"
            value={memberForm.post}
            disabled={editing}
            onChange={handleChange}
          />
          <Typography
            style={{ marginTop: "10px" }}
            variant="h6"
            className="flex flex-col"
          >
            Member name
          </Typography>
          <TextField
            name="name"
            label="Name"
            margin="normal"
            size="small"
            value={memberForm.name}
            onChange={handleChange}
          />
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#800020",
                color: "#fff",
                minWidth: "100px",
              }}
              onClick={handleSubmit}
            >
              {editing ? "Update" : "Save"}
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#800020",
                color: "#fff",
                minWidth: "100px",
              }}
              onClick={resetForm}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
