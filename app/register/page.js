"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Formik } from "formik";
import * as Yup from "yup";

import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const initialValues = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password required"),
    });

    async function handleSubmit(values, { setSubmitting }) {
        try {
            setSubmitting(true);
            dispatch(registerUser({
                payload: {
                    email: values.email,
                    password: values.password,
                },
                cb: (res) => {
                    setSubmitting(false);
                    router.replace("/login");
                }
            }));
        } catch (err) {
            console.error("Register error:", err);
            setSubmitting(false);
        }
    }

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
                    Create your account
                </Typography>

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

                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                margin="normal"
                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                helperText={
                                    touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""
                                }
                            />

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{ px: 3 }}
                                >
                                    {isSubmitting ? <CircularProgress size={20} /> : "Register"}
                                </Button>

                                <Typography variant="body2">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-blue-600 underline">
                                        Login
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
