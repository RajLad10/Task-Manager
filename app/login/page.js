"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import { useToast } from "@/context/ToastContext";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();

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

      dispatch(
        loginUser({
          payload: values,
          cb: () => {
            setSubmitting(false);
            showToast("Login successful!", "success");
            setTimeout(() => router.replace("/dashboard"), 800);
          }
        })
      )
        .unwrap()
        .catch((err) => {
          setSubmitting(false);

          const msg =
            err?.response?.data?.error?.message ||
            "Login failed. Check your credentials.";

          showToast(msg, "error");
        });
    } catch (err) {
      setSubmitting(false);
      showToast("Unexpected error occurred.", "error");
    }
  };

  return (
    <>
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
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Login to your account
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
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
                  helperText={touched.email && errors.email}
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
                  helperText={touched.password && errors.password}
                />

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
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
    </>
  );
}
