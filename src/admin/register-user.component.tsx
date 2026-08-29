import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

interface RegisterForm {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const defaultForm: RegisterForm = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const RegisterUser = () => {
  const [form, setForm] = useState<RegisterForm>({ ...defaultForm });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check if user is logged in - redirect to /admin if not
  useEffect(() => {
    const token = localStorage.getItem("slsq-token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!form.firstname.trim()) {
      setError("First name is required.");
      return;
    }
    if (!form.lastname.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("slsq-token");

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("slsq-token");
          localStorage.removeItem("slsq-user");
          navigate("/admin");
          return;
        }
        setError(data.error || "Registration failed.");
        return;
      }

      setSuccess(`User "${form.username}" created successfully.`);
      setForm({ ...defaultForm });
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...defaultForm });
    setError(null);
    setSuccess(null);
  };

  return (
    <div
      className="w-[100%] md:w-[35%] my-5
                m-auto rounded-[1em] border border-[#e0e0e0]
                shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)] text-black"
    >
      <div className="flex">
        <Box component="form" className="flex mx-auto w-[80%]">
          <div className="flex justify-around mt-10 w-[100%]">
            <div className="flex flex-col gap1-4 justify-around w-[100%]">
              <FormControl
                sx={{
                  m: 0,
                  borderRadius: "4px",
                  color: "#000",
                  width: "100%",
                }}
                variant="outlined"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#7F1734]">
                    Create New User
                  </h2>
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-[#800020] text-white px-4 py-2 rounded border border-[#800020] hover:bg-white hover:text-[#800020]"
                  >
                    Back to Admin
                  </button>
                </div>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}

                <Typography
                  style={{ marginTop: "20px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  First Name
                </Typography>
                <TextField
                  name="firstname"
                  label="First Name"
                  margin="normal"
                  size="small"
                  value={form.firstname}
                  onChange={handleChange}
                />

                <Typography
                  style={{ marginTop: "10px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  Last Name
                </Typography>
                <TextField
                  name="lastname"
                  label="Last Name"
                  margin="normal"
                  size="small"
                  value={form.lastname}
                  onChange={handleChange}
                />

                <Typography
                  style={{ marginTop: "10px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  Username
                </Typography>
                <TextField
                  name="username"
                  label="Username"
                  margin="normal"
                  size="small"
                  value={form.username}
                  onChange={handleChange}
                />

                <Typography
                  style={{ marginTop: "10px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  Password
                </Typography>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  style={{ marginTop: 15, color: "#000" }}
                  name="password"
                  size="small"
                  value={form.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                <Typography
                  style={{ marginTop: "15px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  Confirm Password
                </Typography>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  style={{ marginTop: 15, color: "#000" }}
                  name="confirmPassword"
                  size="small"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />

                <div className="flex justify-center gap-4 py-5 mb-6 mt-4">
                  <Button
                    variant="contained"
                    disabled={loading}
                    style={{
                      width: "45%",
                      backgroundColor: "#800020",
                      color: "#fff",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    {loading ? "Creating..." : "Create User"}
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      width: "45%",
                      backgroundColor: "#800020",
                      color: "#fff",
                    }}
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </Button>
                </div>
              </FormControl>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default RegisterUser;
