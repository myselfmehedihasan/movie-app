import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import Swal from "sweetalert2";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5"></path>
    <path d="m12 19-7-7 7-7"></path>
  </svg>
);

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // Validate on change for better UX
  });

  // Watch form values
  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle next step with validation
  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger("fullName");
    } else if (step === 2) {
      isValid = await trigger(["email", "password"]);
    }

    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    // console.log("Form Data:", data);
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log("User created successfully:", userCredential.user);

      // Send verification email
      try {
        await sendEmailVerification(userCredential.user);

        Swal.fire({
          title: "Success!",
          html: `
        <p>Account created successfully!</p>
        <p class="text-sm text-gray-600 mt-2">A verification email has been sent to <strong>${data.email}</strong></p>
        <p class="text-sm text-gray-600 mt-1">Please verify your email before signing in.</p>
      `,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          reset();
          navigate("/login");
        });

        // Updateprofile
        const profile = {
          displayName: fullName,
        };
        updateProfile(auth.currentUser, profile);
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);

        Swal.fire({
          title: "Account Created",
          text: "Your account was created but we couldn't send the verification email. You can request it again from the login page.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 -mt-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-300">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-black rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full mb-4 text-purple-400">
              <UserIcon />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Create account
            </h1>
            <p className="text-sm text-gray-400">
              {step === 1 && "Let's start with your basic information"}
              {step === 2 && "Now, set up your credentials"}
              {step === 3 && "Almost done! Review your details"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* STEP 1: Full Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      name="fullname"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 bg-gray-900 border ${
                        errors.fullName ? "border-red-500" : "border-gray-700"
                      } rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? "focus:ring-red-500"
                          : "focus:ring-purple-500"
                      } focus:border-transparent hover:border-gray-600 transition-all duration-200`}
                      {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Name can only contain letters",
                        },
                      })}
                    />
                    {fullName && !errors.fullName && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!fullName || errors.fullName}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRightIcon />
                </button>
              </div>
            )}

            {/* STEP 2: Email & Password */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <MailIcon />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`w-full pl-9 pr-3 py-2 bg-gray-900 border ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      } rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "focus:ring-red-500"
                          : "focus:ring-purple-500"
                      } focus:border-transparent hover:border-gray-600 transition-all duration-200`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={`w-full pl-9 pr-10 py-2 bg-gray-900 border ${
                        errors.password ? "border-red-500" : "border-gray-700"
                      } rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "focus:ring-red-500"
                          : "focus:ring-purple-500"
                      } focus:border-transparent hover:border-gray-600 transition-all duration-200`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message:
                            "Password must contain uppercase, lowercase, number and special character",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    !email || !password || errors.email || errors.password
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRightIcon />
                </button>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-100 mb-3 flex items-center gap-2 text-purple-400">
                    <CheckIcon />
                    Review Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-gray-100 font-medium">
                        {fullName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-gray-100 font-medium">{email}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Password:</span>
                      <span className="text-gray-100 font-medium">
                        ••••••••
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            )}
          </form>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 w-full text-gray-400 hover:text-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon />
              Back to previous step
            </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
