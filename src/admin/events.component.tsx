import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef, type MRT_PaginationState } from "material-react-table";
import { API_BASE, getAuthHeaders } from "../config/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EventImage {
  Id: number;
  EventId: number;
  EventPosterImageUrl: string;
  Caption: string | null;
  DisplayOrder: number;
}

interface EventRow {
  EventId: number;
  EventName: string;
  EventDate: string;
  Description: string | null;
  EventType: string;
  CreatedAt: string;
  images: EventImage[];
}

type EventTypeValue = "Event" | "NoticeBoard";

interface EventForm {
  eventName: string;
  eventDate: string;
  description: string;
}

interface FormErrors {
  eventName: string;
  eventDate: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const defaultForm: EventForm = { eventName: "", eventDate: "", description: "" };
const defaultErrors: FormErrors = { eventName: "", eventDate: "" };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
};

const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface EventsProps {
  eventType?: EventTypeValue;
}

const Events = ({ eventType = "Event" }: EventsProps) => {
  const isNoticeBoard = eventType === "NoticeBoard";
  const label = isNoticeBoard ? "Notice" : "Event";
  const labelPlural = isNoticeBoard ? "Notice Board" : "Events & Gallery";
  const navigate = useNavigate();

  /* — state — */
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventForm, setEventForm] = useState<EventForm>({ ...defaultForm });
  const [errors, setErrors] = useState<FormErrors>({ ...defaultErrors });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  /* image-management state */
  const [managingEvent, setManagingEvent] = useState<EventRow | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  /* MRT pagination */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  /* — auth guard — */
  useEffect(() => {
    const token = localStorage.getItem("slsq-token");
    if (!token) navigate("/admin");
    fetchEvents();
  }, []);

  /* — data fetch — */
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/events?type=${eventType}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, [eventType]);

  /* — validation — */
  const validate = (form: EventForm): FormErrors => {
    const errs: FormErrors = { eventName: "", eventDate: "" };
    if (!form.eventName.trim()) errs.eventName = "Event name is required.";
    else if (form.eventName.trim().length < 3) errs.eventName = "Name must be at least 3 characters.";
    if (!form.eventDate) errs.eventDate = "Event date is required.";
    return errs;
  };

  const isFormValid = (): boolean => {
    const errs = validate(eventForm);
    return !errs.eventName && !errs.eventDate;
  };

  /* — form handlers — */
  const resetForm = () => {
    setEventForm({ ...defaultForm });
    setErrors({ ...defaultErrors });
    setTouched({});
    setEditingId(null);
    setMessage("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...eventForm, [name]: value };
    setEventForm(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validate(eventForm));
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  /* — save event (create / update) — */
  const handleSaveEvent = async () => {
    setTouched({ eventName: true, eventDate: true });
    const newErrors = validate(eventForm);
    setErrors(newErrors);
    if (newErrors.eventName || newErrors.eventDate) return;

    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch(`${API_BASE}/api/events/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            eventName: eventForm.eventName.trim(),
            eventDate: eventForm.eventDate,
            description: eventForm.description.trim(),
            eventType,
          }),
        });
        if (res.ok) {
          showMessage(`${label} updated successfully.`);
          const savedId = editingId;
          resetForm();
          // refresh events list and managing event together
          const updatedEvents = await (await fetch(`${API_BASE}/api/events?type=${eventType}`)).json();
          setEvents(updatedEvents);
          if (managingEvent && managingEvent.EventId === savedId) {
            const updated = updatedEvents.find((e: EventRow) => e.EventId === savedId);
            if (updated) setManagingEvent(updated);
          }
        } else {
          showMessage("Error updating event.", "error");
        }
      } else {
        const res = await fetch(`${API_BASE}/api/events`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            eventName: eventForm.eventName.trim(),
            eventDate: eventForm.eventDate,
            description: eventForm.description.trim(),
            eventType,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          showMessage(`${label} created successfully. You can now upload images.`);
          resetForm();
          await fetchEvents();
          // auto-open image manager for the new event
          const refreshed = await (await fetch(`${API_BASE}/api/events?type=${eventType}`)).json();
          const newEvt = refreshed.find((e: EventRow) => e.EventId === data.EventId);
          if (newEvt) setManagingEvent(newEvt);
        } else {
          showMessage("Error creating event.", "error");
        }
      }
    } catch (err) {
      showMessage("Error saving event.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* — edit event — */
  const handleEdit = (event: EventRow) => {
    setEventForm({
      eventName: event.EventName,
      eventDate: formatDateForInput(event.EventDate),
      description: event.Description || "",
    });
    setEditingId(event.EventId);
    setErrors({ ...defaultErrors });
    setTouched({});
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* — delete event — */
  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm(`Delete this ${label.toLowerCase()} and ALL its images? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showMessage(`${label} deleted.`);
        if (managingEvent?.EventId === id) setManagingEvent(null);
        fetchEvents();
      } else {
        showMessage("Error deleting event.", "error");
      }
    } catch (err) {
      showMessage("Error deleting event.", "error");
    }
  };

  /* — image management — */
  const handleManageImages = (event: EventRow) => {
    setManagingEvent(event);
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // generate preview URLs
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleUploadImages = async () => {
    if (!managingEvent || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const token = localStorage.getItem("slsq-token");
      const res = await fetch(`${API_BASE}/api/events/${managingEvent.EventId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        showMessage(`${selectedFiles.length} image(s) uploaded successfully.`);
        setSelectedFiles([]);
        setPreviewUrls([]);
        // reset file input
        const fileInput = document.getElementById("image-upload-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        // refresh events and managing event
        await fetchEvents();
        const refreshed = await (await fetch(`${API_BASE}/api/events?type=${eventType}`)).json();
        const updated = refreshed.find((e: EventRow) => e.EventId === managingEvent.EventId);
        if (updated) setManagingEvent(updated);
      } else {
        showMessage("Error uploading images.", "error");
      }
    } catch (err) {
      showMessage("Error uploading images.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/events/images/${imageId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showMessage("Image deleted.");
        await fetchEvents();
        if (managingEvent) {
          const refreshed = await (await fetch(`${API_BASE}/api/events?type=${eventType}`)).json();
          const updated = refreshed.find((e: EventRow) => e.EventId === managingEvent.EventId);
          if (updated) setManagingEvent(updated);
        }
      } else {
        showMessage("Error deleting image.", "error");
      }
    } catch (err) {
      showMessage("Error deleting image.", "error");
    }
  };

  /* — MRT column definitions — */
  const columns = useMemo<MRT_ColumnDef<EventRow>[]>(
    () => [
      {
        accessorKey: "EventName",
        header: `${label} Name`,
        size: 250,
      },
      {
        accessorKey: "EventDate",
        header: `${label} Date`,
        size: 130,
        Cell: ({ cell }) => formatDateForDisplay(cell.getValue<string>()),
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 200,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val && val.length > 50 ? val.substring(0, 50) + "..." : val || "—";
        },
      },
      {
        accessorFn: (row) => row.images?.length || 0,
        id: "imageCount",
        header: "Images",
        size: 90,
        Cell: ({ cell }) => (
          <span className="bg-[#7F1734] text-white px-2 py-1 rounded text-sm">
            {cell.getValue<number>()}
          </span>
        ),
      },
    ],
    [label]
  );

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#7F1734]">Manage {labelPlural}</h2>
        <button
          onClick={() => navigate("/admin")}
          className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
        >
          Back to Admin
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* ============================================================ */}
      {/*  Event Form                                                   */}
      {/* ============================================================ */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? `Edit ${label}` : `Add New ${label}`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {label} Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={eventForm.eventName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded p-2 ${
                touched.eventName && errors.eventName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={isNoticeBoard ? "e.g. Community Notice" : "e.g. Sinhala New Year 2025"}
            />
            {touched.eventName && errors.eventName && (
              <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {label} Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="eventDate"
              value={eventForm.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded p-2 ${
                touched.eventDate && errors.eventDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {touched.eventDate && errors.eventDate && (
              <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={eventForm.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Optional description of the event"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveEvent}
            disabled={!isFormValid() || loading}
            className={`px-6 py-2 rounded border ${
              isFormValid() && !loading
                ? "bg-[#800020] text-white border-[#800020] hover:bg-white hover:text-[#800020] cursor-pointer"
                : "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : editingId ? `Update ${label}` : `New ${label}`}
          </button>
          <button
            onClick={resetForm}
            className="bg-[#800020] text-white px-6 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
          >
            {editingId ? "Cancel" : "Clear"}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Image Management Section                                     */}
      {/* ============================================================ */}
      {managingEvent && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#7F1734]">
              Images for: {managingEvent.EventName}
            </h3>
            <button
              onClick={() => {
                setManagingEvent(null);
                setSelectedFiles([]);
                setPreviewUrls([]);
              }}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-gray-300 rounded p-4 mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Images to Upload (jpg, png, webp)
            </label>
            <input
              id="image-upload-input"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#800020] file:text-white hover:file:bg-[#5a1025]"
            />

            {/* Preview selected files */}
            {previewUrls.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFiles.length} file(s) selected:
                </p>
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`preview-${idx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-[10px] text-center truncate px-1">
                        {selectedFiles[idx]?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUploadImages}
              disabled={selectedFiles.length === 0 || uploading}
              className={`mt-3 px-6 py-2 rounded border ${
                selectedFiles.length > 0 && !uploading
                  ? "bg-[#800020] text-white border-[#800020] hover:bg-white hover:text-[#800020] cursor-pointer"
                  : "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
              }`}
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Image(s)`}
            </button>
          </div>

          {/* Existing images thumbnail grid */}
          {managingEvent.images && managingEvent.images.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Existing Images ({managingEvent.images.length})
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {managingEvent.images.map((img) => (
                  <div key={img.Id} className="relative group">
                    <img
                      src={`${API_BASE}${img.EventPosterImageUrl}`}
                      alt={img.Caption || "event image"}
                      className="w-full h-24 object-cover rounded border shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteImage(img.Id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      &times;
                    </button>
                    <span className="block text-[10px] text-gray-500 text-center mt-1 truncate">
                      {img.EventPosterImageUrl.split("/").pop()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No images uploaded yet for this event.</p>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  MRT Events Table                                             */}
      {/* ============================================================ */}
      <div className="bg-white shadow rounded overflow-hidden">
        <MaterialReactTable
          columns={columns}
          data={events}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableSorting={true}
          enableGlobalFilter={true}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enablePagination={true}
          onPaginationChange={setPagination}
          state={{ pagination }}
          muiPaginationProps={{
            rowsPerPageOptions: [10, 15, 20, 50],
            showFirstButton: true,
            showLastButton: true,
          }}
          enableRowActions={true}
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <div className="flex gap-1">
              <button
                onClick={() => handleManageImages(row.original)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs border border-blue-600 hover:bg-white hover:text-blue-600"
                title="Manage images"
              >
                Images
              </button>
              <button
                onClick={() => handleEdit(row.original)}
                className="bg-[#800020] text-white px-2 py-1 rounded text-xs border border-[#800020] hover:bg-white hover:text-[#800020]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(row.original.EventId)}
                className="bg-[#800020] text-white px-2 py-1 rounded text-xs border border-[#800020] hover:bg-white hover:text-[#800020]"
              >
                Delete
              </button>
            </div>
          )}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#7F1734",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              backgroundColor: row.index % 2 === 0 ? "#fff" : "#f5e6ea",
            },
          })}
          muiTopToolbarProps={{
            sx: {
              backgroundColor: "#f5e6ea",
            },
          }}
          muiBottomToolbarProps={{
            sx: {
              backgroundColor: "#f5e6ea",
            },
          }}
          renderEmptyRowsFallback={() => (
            <div className="p-6 text-center text-gray-500">
              No {label.toLowerCase()}s found. Add one above.
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Events;
