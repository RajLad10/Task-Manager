"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createProject } from "@/store/slices/projectSlice";

export default function AddProjectModal({ open, onClose }) {
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await dispatch(
      createProject({
        payload: values,
      })
    );

    setSubmitting(false);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Project</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            <DialogContent dividers>
              <TextField
                name="name"
                label="Project Name"
                fullWidth
                margin="normal"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.name && touched.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
                Create
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
