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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_BASE, getAuthHeaders } from "../config/api";

// ─── Types ───────────────────────────────────────────────────────

interface GalleryImage {
  Id: number;
  GalleryId: number;
  ImageUrl: string;
  Caption: string | null;
  DisplayOrder: number;
}

interface Gallery {
  Id: number;
  Title: string;
  GalleryDate: string;
  Description: string | null;
  CreatedAt: string;
  images: GalleryImage[];
}

interface GalleryForm {
  title: string;
  galleryDate: string;
  description: string;
}

const defaultForm: GalleryForm = {
  title: "",
  galleryDate: "",
  description: "",
};

// ─── Component ───────────────────────────────────────────────────

const PhotoGallery = () => {
  const navigate = useNavigate();

  // Data
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<GalleryForm>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Upload state (per gallery, tracked by gallery Id)
  const [uploadingGalleryId, setUploadingGalleryId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Full image viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState("");

  // Delete confirm
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingGalleryId, setDeletingGalleryId] = useState<number | null>(null);

  // Pagination
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ─── Fetch galleries ───────────────────────────────────────────

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      if (!res.ok) throw new Error("Failed to fetch galleries.");
      const data: Gallery[] = await res.json();
      setGalleries(data);
    } catch (err: any) {
      setError(err.message || "Failed to load galleries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // ─── Form handlers ─────────────────────────────────────────────

  const openCreateForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = (gallery: Gallery) => {
    setForm({
      title: gallery.Title,
      galleryDate: gallery.GalleryDate
        ? new Date(gallery.GalleryDate).toISOString().split("T")[0]
        : "",
      description: gallery.Description || "",
    });
    setEditingId(gallery.Id);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormChange = (field: keyof GalleryForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.galleryDate) {
      setFormError("Gallery date is required.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `${API_BASE}/api/gallery/${editingId}`
        : `${API_BASE}/api/gallery`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: form.title.trim(),
          galleryDate: form.galleryDate,
          description: form.description.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save gallery.");
      }

      setSuccess(editingId ? "Gallery updated." : "Gallery created.");
      setFormOpen(false);
      await fetchGalleries();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete gallery ────────────────────────────────────────────

  const confirmDelete = (galleryId: number) => {
    setDeletingGalleryId(galleryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGallery = async () => {
    if (!deletingGalleryId) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${deletingGalleryId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete gallery.");
      setSuccess("Gallery deleted.");
      setDeleteDialogOpen(false);
      setDeletingGalleryId(null);
      await fetchGalleries();
    } catch (err: any) {
      setError(err.message);
      setDeleteDialogOpen(false);
    }
  };

  // ─── Image upload (inline in expanded row) ─────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, galleryId: number) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGalleryId(galleryId);
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearFileSelection = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadingGalleryId(null);
  };

  const handleUploadImages = async (galleryId: number) => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const token = localStorage.getItem("slsq-token");
      const res = await fetch(`${API_BASE}/api/gallery/${galleryId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload images.");
      }

      setSuccess(`${selectedFiles.length} image(s) uploaded.`);
      clearFileSelection();
      await fetchGalleries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/images/${imageId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete image.");

      setSuccess("Image deleted.");
      await fetchGalleries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Full image viewer ─────────────────────────────────────────

  const openViewer = (imageUrl: string) => {
    setViewerImageUrl(`${API_BASE}${imageUrl}`);
    setViewerOpen(true);
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

  const columns = useMemo<MRT_ColumnDef<Gallery>[]>(
    () => [
      {
        accessorKey: "Title",
        header: "Title",
        size: 250,
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 300,
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          if (!val) return "";
          return val.length > 80 ? `${val.substring(0, 80)}...` : val;
        },
      },
      {
        accessorFn: (row) => row.images?.length || 0,
        id: "imageCount",
        header: "Images",
        size: 100,
        enableSorting: true,
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
          Photo Gallery Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={openCreateForm}
            className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            New Gallery
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

      {/* MRT Table with Expandable Rows */}
      <div className="p-4">
        <MaterialReactTable
          columns={columns}
          data={galleries}
          state={{ isLoading: loading, pagination }}
          onPaginationChange={setPagination}
          muiPaginationProps={{
            rowsPerPageOptions: [10, 15, 20, 50],
          }}
          enableGlobalFilter
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableExpanding
          enableExpandAll={false}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "4px" }}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => openEditForm(row.original)}
                  style={{ color: "#1976d2" }}
                >
                  <EditIcon />
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
          renderDetailPanel={({ row }) => {
            const gallery = row.original;
            const images = gallery.images || [];
            const isThisGalleryUploading = uploadingGalleryId === gallery.Id;

            return (
              <Box sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
                {/* Upload section */}
                <div className="mb-4 p-3 border border-dashed border-[#ccc] rounded-lg bg-white">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      startIcon={<CloudUploadIcon />}
                      style={{ borderColor: "#800020", color: "#800020" }}
                    >
                      Select Images
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, gallery.Id)}
                      />
                    </Button>
                    {isThisGalleryUploading && selectedFiles.length > 0 && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          style={{ backgroundColor: "#800020" }}
                          onClick={() => handleUploadImages(gallery.Id)}
                          disabled={uploading}
                          startIcon={
                            uploading ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : null
                          }
                        >
                          {uploading
                            ? "Uploading..."
                            : `Upload ${selectedFiles.length} file(s)`}
                        </Button>
                        <Button
                          size="small"
                          color="inherit"
                          onClick={clearFileSelection}
                        >
                          Clear
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Selected files preview */}
                  {isThisGalleryUploading && previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid #ddd",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeSelectedFile(idx)}
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              backgroundColor: "#d32f2f",
                              color: "#fff",
                              width: 18,
                              height: 18,
                              "&:hover": { backgroundColor: "#b71c1c" },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing images grid */}
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1, color: "#800020" }}
                >
                  Gallery Images ({images.length})
                </Typography>

                {images.length > 0 ? (
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {images.map((img) => (
                      <div
                        key={img.Id}
                        className="relative group rounded-lg overflow-hidden border border-[#e0e0e0]"
                      >
                        <img
                          src={`${API_BASE}${img.ImageUrl}`}
                          alt={img.Caption || `Image ${img.DisplayOrder}`}
                          style={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => openViewer(img.ImageUrl)}
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                     transition-opacity flex items-center justify-center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(img.Id)}
                            sx={{
                              backgroundColor: "rgba(255,255,255,0.9)",
                              color: "#d32f2f",
                              width: 28,
                              height: 28,
                              "&:hover": { backgroundColor: "#fff" },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" sx={{ color: "#999", py: 1 }}>
                    No images uploaded yet. Use the button above to add images.
                  </Typography>
                )}
              </Box>
            );
          }}
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
          muiDetailPanelProps={{
            sx: { backgroundColor: "#fafafa" },
          }}
        />
      </div>

      {/* ─── Create/Edit Dialog ──────────────────────────────────── */}
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
          {editingId ? "Edit Gallery" : "Create Gallery"}
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
            label="Gallery Date"
            type="date"
            fullWidth
            margin="normal"
            value={form.galleryDate}
            onChange={(e) => handleFormChange("galleryDate", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            style={{ backgroundColor: "#800020" }}
          >
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
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
            Are you sure you want to delete this gallery and all its images?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteGallery}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Full-Resolution Image Viewer ────────────────────────── */}
      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            position: "relative",
            minHeight: 400,
          }}
        >
          <IconButton
            onClick={() => setViewerOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={viewerImageUrl}
            alt="Full resolution"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGallery;
