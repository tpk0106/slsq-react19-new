import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../model/user";
import { API_BASE } from "../config/api";
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

const defaultSignInForm: User = {
  userId: "",
  password: "",
};

interface MenuCard {
  title: string;
  description: string;
  route: string;
  icon: string;
}

const menuCards: MenuCard[] = [
  {
    title: "Members",
    description: "Add, edit or delete committee members",
    route: "/members",
    icon: "\u{1F465}",
  },
  {
    title: "Past Presidents",
    description: "Manage past presidents list",
    route: "/presidents",
    icon: "\u{1F3DB}",
  },
  {
    title: "Events",
    description: "Manage events and upload images",
    route: "/events-admin",
    icon: "\u{1F4C5}",
  },
  {
    title: "Notice Board",
    description: "Manage notice board posters",
    route: "/noticeboard-admin",
    icon: "\u{1F4CC}",
  },
  {
    title: "Publications",
    description: "Upload and manage newsletters",
    route: "/publications-admin",
    icon: "\u{1F4F0}",
  },
  {
    title: "Photo Gallery",
    description: "Manage photo galleries and images",
    route: "/gallery-admin",
    icon: "\u{1F4F7}",
  },
  {
    title: "Create User",
    description: "Register a new admin user",
    route: "/register",
    icon: "\u{1F511}",
  },
];

const Administrator = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState<User>(defaultSignInForm);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("slsq-token");
    const user = localStorage.getItem("slsq-user");
    if (token) {
      setIsLoggedIn(true);
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserName(parsed.firstname || parsed.username || "");
        } catch {
          setUserName("");
        }
      }
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInForm({ ...signInForm, [name]: value });
  };

  const handleLogin = async () => {
    setError(null);

    if (!signInForm.userId.trim() || !signInForm.password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signInForm.userId,
          password: signInForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("slsq-token", data.token);
      localStorage.setItem("slsq-user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setUserName(data.user?.firstname || data.user?.username || "");
      setSignInForm(defaultSignInForm);
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("slsq-token");
    localStorage.removeItem("slsq-user");
    setIsLoggedIn(false);
    setUserName("");
    setSignInForm(defaultSignInForm);
  };

  // -- Dashboard (after login) --
  if (isLoggedIn) {
    return (
      <div
        className="w-[95%] md:w-[60%] my-5 mx-auto
                  rounded-[1em] border border-[#e0e0e0]
                  shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)] text-black"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e0e0e0]">
          <div>
            <Typography variant="h5" style={{ fontWeight: 700, color: "#800020" }}>
              Admin Dashboard
            </Typography>
            {userName && (
              <Typography variant="body2" style={{ color: "#666", marginTop: 2 }}>
                Welcome, {userName}
              </Typography>
            )}
          </div>
          <Button
            variant="outlined"
            size="small"
            style={{ borderColor: "#800020", color: "#800020" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {menuCards.map((card) => (
            <div
              key={card.route}
              className="flex items-center gap-4 p-5 rounded-lg border border-[#e0e0e0]
                         cursor-pointer transition-all duration-200
                         hover:border-[#800020] hover:shadow-md"
              onClick={() => navigate(card.route)}
            >
              <div className="text-3xl">{card.icon}</div>
              <div>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 600, color: "#800020" }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" style={{ color: "#666" }}>
                  {card.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -- Login form (before login) --
  return (
    <div
      className="w-[100%] md:w-[30%] my-5
                m-auto rounded-[1em] border-1 border-[#000]
                shadow-[0px_10px_20px_0px_rgba(0,0,0,0.15)] text-black"
    >
      <div className="flex">
        <Box component="form" className="flex mx-auto">
          <div className="flex justify-around mt-10">
            <div className="flex flex-col gap1-4 justify-around">
              <FormControl
                sx={{
                  m: 0,
                  borderRadius: "4px",
                  color: "#000",
                }}
                variant="outlined"
              >
                <Typography variant="h4">Sign In</Typography>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Typography
                  style={{ marginTop: "30px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  User Id
                </Typography>
                <TextField
                  name="userId"
                  label="User Id"
                  margin="normal"
                  size="small"
                  value={signInForm.userId}
                  onChange={handleChange}
                />

                <Typography variant="h6" className="flex flex-col mb-2">
                  Password
                </Typography>

                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  style={{ marginTop: 15, color: "#000" }}
                  name="password"
                  size="small"
                  value={signInForm.password}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                <Typography
                  color="gray"
                  className="mt-6 text-center font-normal py-5 mb-6"
                >
                  <Button
                    variant="contained"
                    disabled={loading}
                    style={{
                      width: "100%",
                      margin: "0px",
                      backgroundColor: "#800020",
                      color: "#fff",
                    }}
                    onClick={() => handleLogin()}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </Typography>
              </FormControl>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Administrator;
