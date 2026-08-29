import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_BASE, getAuthHeaders } from "../config/api";

// ─── Types ───────────────────────────────────────────────────────

interface Publication {
  Id: number;
  Title: string;
  Year: number;
  Month: number;
  Description: string | null;
  PdfUrl: string;
  CreatedAt: string;
}

interface PublicationForm {
  title: string;
  year: string;
  month: string;
  description: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const defaultForm: PublicationForm = {
  title: "",
  year: new Date().getFullYear().toString(),
  month: "",
  description: "",
};

// ─── Component ───────────────────────────────────────────────────

const Publications = () => {
  const navigate = useNavigate();

  // Data
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PublicationForm>(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete confirm
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Pagination
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ─── Fetch publications ────────────────────────────────────────

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/publications`);
      if (!res.ok) throw new Error("Failed to fetch publications.");
      const data: Publication[] = await res.json();
      setPublications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load publications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // ─── Form handlers ─────────────────────────────────────────────

  const openCreateForm = () => {
    setForm(defaultForm);
    setSelectedFile(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormChange = (field: keyof PublicationForm, value: string) => {
    // For year field, only allow digits and max 4 characters
    if (field === "year" && value !== "") {
      if (!/^\d{0,4}$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isUploadFormValid = (): boolean => {
    return (
      form.title.trim().length > 0 &&
      /^\d{4}$/.test(form.year) &&
      form.month !== "" &&
      selectedFile !== null
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSave = async () => {
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.year || isNaN(parseInt(form.year))) {
      setFormError("Valid year is required.");
      return;
    }
    if (!form.month) {
      setFormError("Month is required.");
      return;
    }
    if (!selectedFile) {
      setFormError("PDF file is required.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim() || "");

      const token = localStorage.getItem("slsq-token");

      // Pass year and month as query params so the pre-upload middleware
      // can set the correct folder/filename before multer saves the file
      const res = await fetch(
        `${API_BASE}/api/publications?year=${form.year}&month=${form.month}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload publication.");
      }

      setSuccess("Publication uploaded successfully.");
      setFormOpen(false);
      setSelectedFile(null);
      await fetchPublications();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete publication ────────────────────────────────────────

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${API_BASE}/api/publications/${deletingId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete publication.");
      setSuccess("Publication deleted.");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      await fetchPublications();
    } catch (err: any) {
      setError(err.message);
      setDeleteDialogOpen(false);
    }
  };

  // ─── Clear alerts after timeout ────────────────────────────────

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ─── Table columns ─────────────────────────────────────────────

  const columns = useMemo<MRT_ColumnDef<Publication>[]>(
    () => [
      {
        accessorKey: "Title",
        header: "Title",
        size: 250,
      },
      {
        accessorKey: "Year",
        header: "Year",
        size: 80,
      },
      {
        accessorFn: (row) => MONTH_NAMES[row.Month - 1] || row.Month,
        id: "monthName",
        header: "Month",
        size: 120,
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 250,
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          if (!val) return "";
          return val.length > 60 ? `${val.substring(0, 60)}...` : val;
        },
      },
      {
        accessorKey: "PdfUrl",
        header: "PDF",
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const url = cell.getValue<string>();
          if (!url) return "";
          return (
            <Tooltip title="View PDF">
              <IconButton
                size="small"
                onClick={() => window.open(`${API_BASE}${url}`, "_blank")}
                style={{ color: "#800020" }}
              >
                <PdfIcon />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    []
  );

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div
      className="w-[95%] md:w-[85%] my-5 mx-auto rounded-[1em] border border-[#e0e0e0]
                 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)] text-black"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#e0e0e0]">
        <h2 className="text-2xl font-bold text-[#7F1734]">
          Publications Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={openCreateForm}
            className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            Upload Newsletter
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            Back to Admin
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="px-6 pt-2">
        {error && (
          <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 1 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
      </div>

      {/* MRT Table */}
      <div className="p-4">
        <MaterialReactTable
          columns={columns}
          data={publications}
          state={{ isLoading: loading, pagination }}
          onPaginationChange={setPagination}
          muiPaginationProps={{
            rowsPerPageOptions: [10, 15, 20, 50],
          }}
          enableGlobalFilter
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "4px" }}>
              <Tooltip title="Open PDF">
                <IconButton
                  size="small"
                  onClick={() =>
                    window.open(
                      `${API_BASE}${row.original.PdfUrl}`,
                      "_blank"
                    )
                  }
                  style={{ color: "#1976d2" }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => confirmDelete(row.original.Id)}
                  style={{ color: "#d32f2f" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          muiTablePaperProps={{
            elevation: 0,
            sx: { border: "1px solid #e0e0e0", borderRadius: "8px" },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#800020",
              color: "#fff",
              fontWeight: 700,
              "& .MuiTableSortLabel-root": { color: "#fff" },
              "& .MuiTableSortLabel-root:hover": { color: "#ddd" },
              "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
              "& .MuiTableSortLabel-icon": { color: "#fff !important" },
              "& .MuiIconButton-root": { color: "#fff" },
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              backgroundColor:
                row.index % 2 === 0 ? "#fff" : "rgba(128, 0, 32, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(128, 0, 32, 0.15) !important",
              },
            },
          })}
        />
      </div>

      {/* ─── Upload Dialog ───────────────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#800020",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Upload Newsletter
          <IconButton
            onClick={() => setFormOpen(false)}
            sx={{ color: "#fff" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, mt: 1 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={(e) => handleFormChange("title", e.target.value)}
            required
          />
          <TextField
            label="Year"
            fullWidth
            margin="normal"
            value={form.year}
            onChange={(e) => handleFormChange("year", e.target.value)}
            required
            inputProps={{ maxLength: 4 }}
            placeholder="e.g. 2025"
            helperText={
              form.year && !/^\d{4}$/.test(form.year)
                ? "Enter a valid 4-digit year"
                : ""
            }
            error={form.year.length > 0 && !/^\d{4}$/.test(form.year)}
          />
          <TextField
            label="Month"
            select
            fullWidth
            margin="normal"
            value={form.month}
            onChange={(e) => handleFormChange("month", e.target.value)}
            required
          >
            {MONTH_NAMES.map((name, idx) => (
              <MenuItem key={idx + 1} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />

          {/* File picker */}
          <div className="mt-4 p-4 border border-dashed border-[#ccc] rounded-lg bg-[#fafafa]">
            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                component="label"
                size="small"
                startIcon={<CloudUploadIcon />}
                style={{ borderColor: "#800020", color: "#800020" }}
              >
                Select PDF
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleFileSelect}
                />
              </Button>
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <PdfIcon style={{ color: "#800020" }} />
                  <Typography variant="body2">{selectedFile.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !isUploadFormValid()}
            style={{
              backgroundColor: saving || !isUploadFormValid() ? "#ccc" : "#800020",
              color: saving || !isUploadFormValid() ? "#666" : "#fff",
            }}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {saving ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Delete Confirm Dialog ───────────────────────────────── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this publication? The PDF file will
            also be removed. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Publications;
