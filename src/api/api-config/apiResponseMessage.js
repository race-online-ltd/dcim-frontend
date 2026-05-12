import { toast } from "react-toastify";

export const errorMessage = (error) => {
  let message = "An unexpected error occurred";

  if (error.response?.data) {
    if (error.response.data.errors) {
      // Extract the first validation error message
      const firstErrorKey = Object.keys(error.response.data.errors)[0];
      const errors = error.response.data.errors[firstErrorKey];
      message = Array.isArray(errors) ? errors[0] : errors;
    } else if (error.response.data.message) {
      message = error.response.data.message;
    }
  } else if (error.message) {
    message = error.message;
  }

  toast.error(message, {
    position: "top-right",
  });
};

export const successMessage = (response) => {
  toast.success(response?.message || "Operation successful !", {
    position: "top-right",
  });
};

export const warningMessage = (response) => {
  toast.warn(response?.message || "Operation Error !", {
    position: "top-right",
    autoClose: 30000,
  });
};