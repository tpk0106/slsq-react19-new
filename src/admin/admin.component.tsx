import React, { ChangeEvent, Component, useState } from "react";
import { User } from "../model/user";
// import { z } from "zod";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";

const defaultSignInForm: User = {
  userId: "",
  password: "",
};
// const [signupForm, setSignupForm] = useState(defaultSignupForm);
// const { userId, password }: User = signinForm;

const Administrator = () => {
  // const signInFormSchema = z.object({
  //   email: z.coerce.string().min(5, "email required"),
  //   password: z.coerce.string().min(8, "password required"),
  // });

  // type signInFormData = z.infer<typeof signInFormSchema>;

  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState<User>(defaultSignInForm);

  // const signInFormSchema = z.object({
  //   email: z.coerce.string().min(5, "email required"),
  //   password: z.coerce.string().min(8, "password required"),
  // });

  // type signInFormData = z.infer<typeof signInFormSchema>;
  // type signInFormErrors = Partial<Record<keyof signInFormData, string[]>>;
  const navigate = useNavigate();
  // const handleSubmit = ({ children }: any) => {
  const handleSubmit = () => {
    // Replace this with your actual authentication check (e.g., checking a token in localStorage, a global state, or a context)
    const isAuthenticated = localStorage.getItem("slsq-token");

    // if (!isAuthenticated) {
    //   // Redirect to the login page if not authenticated
    //   return <Navigate to="/admin" replace />;
    // }

    // Render the children (protected components) if authenticated
    // return children;
    navigate("/members");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  // const [errors, setErrors] = useState<signInFormErrors>({});

  //   //console.log("name change ", event.target);
  //   const { name, value } = event.target;
  //   setSignupForm({ ...signupForm, [name]: value });
  //   //console.log("signup form : ", { ...signupForm });
  //   const newErrors = validateForm(signupForm);
  //   setErrors(newErrors);
  // };

  // const validateForm = (data: signInFormData): signInFormErrors => {
  //   try {
  //     signInFormSchema.parse(data);
  //     return {};
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       return error.flatten().fieldErrors;
  //     }
  //     return {};
  //   }
  // };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInForm({ ...signInForm, [name]: value });

    // const newErrors = validateForm(signInForm);
    // setErrors(newErrors);
  };

  return (
    <div
      className="w-[100%] md:w-[30%] my-5
                m-auto rounded-[1em] border-1 border-[#000]
                shadow-[0px_10px_20px_0px_rgba(000,_10,_10,_0.15)] text1-black"
    >
      <div className="flex">
        <Box component="form" className="flex mx-auto">
          <div className="flex justify-around mt-10">
            {/* <form className="w-80 max-w-screen-lg sm:w-96"> */}
            <div className="flex flex-col gap1-4 justify-around">
              <FormControl
                sx={{
                  m: 0,
                  borderRadius: "4px",
                  color: "#000",
                }}
                variant="outlined"
              >
                <Typography
                  variant="h4"
                  // color="blue-gray"
                  // style={{ marginBottom: "13px" }}
                >
                  Sign In
                </Typography>
                <Typography
                  style={{ marginTop: "30px" }}
                  variant="h6"
                  className="flex flex-col"
                >
                  User Id
                </Typography>
                <TextField
                  error
                  name="userId"
                  label="User Id"
                  margin="normal"
                  size="small"
                  // className="text-[#000]"
                  //    defaultValue={email}
                  onChange={handleChange}
                  //   helperText="Incorrect entry."
                />
                {/* {errors.email && (
                    <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                      {errors.email}
                    </div>
                  )} */}

                <Typography variant="h6" className="flex flex-col mb-2">
                  Password
                </Typography>

                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  style={{ marginTop: 15, color: "#000" }}
                  error
                  name="password"
                  label="Password"
                  size="small"
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
                {/* {errors.password && (
                    <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                      {errors.password}
                    </div>
                  )} */}

                <Typography
                  color="gray"
                  className="mt-6 text-center font-normal py-5 mb-6"
                >
                  <Button
                    variant="contained"
                    style={{
                      width: "100%",
                      margin: "0px",
                      backgroundColor: "#800020",
                      color: "#fff",
                    }}
                    onClick={(event: any) => handleSubmit()}
                  >
                    Sign in
                  </Button>
                </Typography>
              </FormControl>
            </div>
            {/* </form> */}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Administrator;
