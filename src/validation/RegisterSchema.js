import * as yup from "yup";

const RegisterSchema = yup.object({
  userName: yup
    .string()
    .required("Full Name is required")
    .min(3, "Minimum length is 3 characters")
    .max(20, "Maximum length is 20 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[\W_]/, "Password must contain at least one symbol"),

  confirmpassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default RegisterSchema;
