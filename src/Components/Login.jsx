import React from "react";
import { Link } from "react-router";

function Login() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Form submitted!");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-black rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            Enter your email below to sign in to your account
          </p>
        </div>
        
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label 
                className="text-sm font-medium text-gray-300" 
                htmlFor="email"
              >
                Email
              </label>
              <input 
                className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-600 placeholder:text-gray-500" 
                id="email" 
                placeholder="name@example.com" 
                required 
                type="email" 
              />
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
                  href="#" 
                  className="ml-auto inline-block text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input 
                  className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-600 placeholder:text-gray-500" 
                  id="password" 
                  required 
                  type={passwordVisible ? 'text' : 'password'} 
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-11 px-4 py-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
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
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium border-2 border-gray-800 bg-gray-900 hover:bg-gray-800 text-white h-11 px-4 py-2 w-full transition-all hover:border-gray-700 hover:shadow-md"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium border-2 border-gray-800 bg-gray-900 hover:bg-gray-800 text-white h-11 px-4 py-2 w-full transition-all hover:border-gray-700 hover:shadow-md"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signin" className="font-semibold text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;