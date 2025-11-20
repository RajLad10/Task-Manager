"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";

import { loginUser } from "@/store/slices/authSlice";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [serverError, setServerError] = React.useState(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      setServerError(null);

      dispatch(
        loginUser({
          payload: {
            email: values.email,
            password: values.password,
          },
          cb: () => {
            setSubmitting(false);
            router.replace("/dashboard");
          },
        })
      ).unwrap()
        .catch((err) => {
          setSubmitting(false);
          if (err?.response?.data?.error?.message) {
            setServerError(err.response.data.error.message);
          } else {
            setServerError("Login failed. Check credentials.");
          }
        });

    } catch (err) {
      setSubmitting(false);
      setServerError("Unexpected error occurred.");
      console.error("Login error:", err);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 2, textAlign: "center" }}>
          Login to your account
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email ? errors.email : ""}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password ? errors.password : ""}
              />

              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ px: 3 }}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : "Login"}
                </Button>

                <Typography variant="body2">
                  New user?{" "}
                  <Link href="/register" className="text-blue-600 underline">
                    Register
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
