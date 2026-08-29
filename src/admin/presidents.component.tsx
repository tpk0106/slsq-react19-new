import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getAuthHeaders } from "../config/api";

interface PresidentForm {
  presidentName: string;
  periodFrom: string;
  periodTo: string;
}

interface FormErrors {
  presidentName: string;
  periodFrom: string;
  periodTo: string;
}

const defaultForm: PresidentForm = {
  presidentName: "",
  periodFrom: "",
  periodTo: "",
};

const defaultErrors: FormErrors = {
  presidentName: "",
  periodFrom: "",
  periodTo: "",
};

const isValidYear = (value: string): boolean => {
  const year = Number(value);
  return /^\d{4}$/.test(value) && year >= 1900 && year <= 2100;
};

const Presidents = () => {
  const navigate = useNavigate();
  const [presidents, setPresidents] = useState<any[]>([]);
  const [presidentForm, setPresidentForm] = useState<PresidentForm>({
    ...defaultForm,
  });
  const [errors, setErrors] = useState<FormErrors>({ ...defaultErrors });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("slsq-token");
    if (!token) {
      navigate("/admin");
    }
    fetchPresidents();
  }, []);

  const fetchPresidents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/about/presidents`);
      const data = await res.json();
      setPresidents(data);
    } catch (err) {
      console.error("Error fetching presidents:", err);
    }
  };

  const validate = (form: PresidentForm): FormErrors => {
    const errs: FormErrors = { presidentName: "", periodFrom: "", periodTo: "" };

    if (!form.presidentName.trim()) {
      errs.presidentName = "President name is required.";
    } else if (form.presidentName.trim().length < 2) {
      errs.presidentName = "Name must be at least 2 characters.";
    }

    if (!form.periodFrom.trim()) {
      errs.periodFrom = "Period From is required.";
    } else if (!isValidYear(form.periodFrom.trim())) {
      errs.periodFrom = "Enter a valid 4-digit year (1900-2100).";
    }

    if (!form.periodTo.trim()) {
      errs.periodTo = "Period To is required.";
    } else if (!isValidYear(form.periodTo.trim())) {
      errs.periodTo = "Enter a valid 4-digit year (1900-2100).";
    } else if (
      isValidYear(form.periodFrom.trim()) &&
      Number(form.periodTo.trim()) < Number(form.periodFrom.trim())
    ) {
      errs.periodTo = "Period To cannot be earlier than Period From.";
    }

    return errs;
  };

  const isFormValid = (): boolean => {
    const errs = validate(presidentForm);
    return !errs.presidentName && !errs.periodFrom && !errs.periodTo;
  };

  const resetForm = () => {
    setPresidentForm({ ...defaultForm });
    setErrors({ ...defaultErrors });
    setTouched({});
    setEditingId(null);
    setMessage("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // For year fields, only allow digits and max 4 characters
    if ((name === "periodFrom" || name === "periodTo") && value !== "") {
      if (!/^\d{0,4}$/.test(value)) return;
    }

    const updatedForm = { ...presidentForm, [name]: value };
    setPresidentForm(updatedForm);

    // Validate on change if field was already touched
    if (touched[name]) {
      const newErrors = validate(updatedForm);
      setErrors(newErrors);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched({ ...touched, [name]: true });
    const newErrors = validate(presidentForm);
    setErrors(newErrors);
  };

  const handleSave = async () => {
    // Mark all fields as touched
    setTouched({ presidentName: true, periodFrom: true, periodTo: true });
    const newErrors = validate(presidentForm);
    setErrors(newErrors);

    if (newErrors.presidentName || newErrors.periodFrom || newErrors.periodTo) {
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(
          `${API_BASE}/api/about/presidents/${editingId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              presidentName: presidentForm.presidentName.trim(),
              periodFrom: presidentForm.periodFrom.trim(),
              periodTo: presidentForm.periodTo.trim(),
            }),
          }
        );
        if (res.ok) {
          setMessage("President updated successfully.");
        } else {
          setMessage("Error updating president.");
        }
      } else {
        const res = await fetch(`${API_BASE}/api/about/presidents`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            presidentName: presidentForm.presidentName.trim(),
            periodFrom: presidentForm.periodFrom.trim(),
            periodTo: presidentForm.periodTo.trim(),
          }),
        });
        if (res.ok) {
          setMessage("President added successfully.");
        } else {
          setMessage("Error adding president.");
        }
      }
      fetchPresidents();
      resetForm();
    } catch (err) {
      setMessage("Error saving president.");
    }
  };

  const handleEdit = (president: any) => {
    setPresidentForm({
      presidentName: String(president.PresidentName),
      periodFrom: String(president.PeriodFrom),
      periodTo: String(president.PeriodTo),
    });
    setEditingId(president.Id);
    setErrors({ ...defaultErrors });
    setTouched({});
    setMessage("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this president?"))
      return;
    try {
      const res = await fetch(`${API_BASE}/api/about/presidents/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMessage("President deleted.");
        fetchPresidents();
      } else {
        setMessage("Error deleting president.");
      }
    } catch (err) {
      setMessage("Error deleting president.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#7F1734]">
          Manage Past Presidents
        </h2>
        <button
          onClick={() => navigate("/admin")}
          className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
        >
          Back to Admin
        </button>
      </div>

      {message && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "Edit President" : "Add New President"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              President Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="presidentName"
              value={presidentForm.presidentName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded p-2 ${
                touched.presidentName && errors.presidentName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g. Mr. John Smith"
            />
            {touched.presidentName && errors.presidentName && (
              <p className="text-red-500 text-xs mt-1">{errors.presidentName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Period From <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="periodFrom"
              value={presidentForm.periodFrom}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              className={`w-full border rounded p-2 ${
                touched.periodFrom && errors.periodFrom
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g. 1978"
            />
            {touched.periodFrom && errors.periodFrom && (
              <p className="text-red-500 text-xs mt-1">{errors.periodFrom}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Period To <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="periodTo"
              value={presidentForm.periodTo}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              className={`w-full border rounded p-2 ${
                touched.periodTo && errors.periodTo
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g. 1982"
            />
            {touched.periodTo && errors.periodTo && (
              <p className="text-red-500 text-xs mt-1">{errors.periodTo}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!isFormValid()}
            className={`px-6 py-2 rounded border ${
              isFormValid()
                ? "bg-[#800020] text-white border-[#800020] hover:bg-white hover:text-[#800020] cursor-pointer"
                : "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
            }`}
          >
            {editingId ? "Update" : "Save"}
          </button>
          <button
            onClick={resetForm}
            className="bg-[#800020] text-white px-6 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            {editingId ? "Cancel" : "New President"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#7F1734] text-white">
              <th className="p-3 text-left">President Name</th>
              <th className="p-3 text-left">Period From</th>
              <th className="p-3 text-left">Period To</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {presidents.map((president, index) => (
              <tr
                key={president.Id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#f5e6ea]"}
              >
                <td className="p-3">{president.PresidentName}</td>
                <td className="p-3">{president.PeriodFrom}</td>
                <td className="p-3">{president.PeriodTo}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(president)}
                    className="bg-[#800020] text-white px-3 py-1 rounded mr-2 border border-[#800020] hover:bg-white hover:text-[#800020]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(president.Id)}
                    className="bg-[#800020] text-white px-3 py-1 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {presidents.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No past presidents found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Presidents;
