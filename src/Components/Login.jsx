import React, { useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import GoogleandGithub from "./GoogleandGithub";

function Login() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword } = useAuth();

  // Get the page user came from, default to home
  const from = location.state?.from || '/';

  // Scroll to top immediately when component mounts (before paint)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Additional scroll on regular effect
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await login(data.email, data.password);

      if (!userCredential.user.emailVerified) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your email is not verified",
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
        // Redirect to the page they came from
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Error Sign in user:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleForgetPassword = () => {
    const email = getValues("email");

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address first",
      });
      return;
    }

    resetPassword(email)
      .then(() => {
        Swal.fire({
          title: "Reset email Sent",
          text: "Please check your email",
          icon: "info",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };

  const handleAuthSuccess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
    // Redirect to the page they came from
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 -mt-28">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-black rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            Enter your email below to sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-sm font-medium text-gray-300"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={`flex h-11 w-full rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } bg-gray-900 px-4 py-2 text-sm text-white shadow-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-purple-500"
                } focus:border-transparent hover:border-gray-600 placeholder:text-gray-500`}
                id="email"
                placeholder="name@example.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  onClick={handleForgetPassword}
                  className="ml-auto inline-block text-sm text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  className={`flex h-11 w-full rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } bg-gray-900 px-4 py-2 text-sm text-white shadow-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-purple-500"
                  } focus:border-transparent hover:border-gray-600 placeholder:text-gray-500`}
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    onClick={togglePassword}
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {passwordVisible ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    )}
                  </svg>
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-11 px-4 py-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleandGithub onSuccess={handleAuthSuccess} />
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;