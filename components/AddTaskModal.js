"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import { Formik } from "formik";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
import { createTask } from "@/store/slices/taskSlice";

export default function AddTaskModal({ open, onClose, projectId }) {
  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    status: "Todo",
    dueDate: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Task title is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await dispatch(
      createTask({
        payload: {
          ...values,
          projectId,
        },
      })
    );

    setSubmitting(false);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Task</DialogTitle>

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
                name="title"
                label="Task Title"
                fullWidth
                margin="normal"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.title && touched.title)}
                helperText={touched.title && errors.title}
              />

              <TextField
                name="status"
                label="Status"
                select
                fullWidth
                margin="normal"
                value={values.status}
                onChange={handleChange}
              >
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </TextField>

              <TextField
                type="date"
                name="dueDate"
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                value={values.dueDate}
                onChange={handleChange}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting}
              >
                Create Task
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
