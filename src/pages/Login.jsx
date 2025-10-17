import { useState, useCallback, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { ThemeContext } from '@/context/ThemeContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  XMarkIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { LoginSchema } from '@/utils/validations/schemas/login.schema';



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, setError, isLoading } = useAuth();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  // Get the previous location if available or default to '/'
  const from = location.state?.from?.pathname || '/';

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (values, formikHelpers) => {
    const { setSubmitting } = formikHelpers;
    
    // Prevent default form submission behavior
    try {
      await login({
        email: values.email,
        password: values.password,
        rememberMe
      }, from);
      
      // Note: do not reset form here as we don't want to clear inputs on error
      // and on success, we'll navigate away
    } catch (err) {
      console.error('Form submission error:', err);
      // Error is already handled by the auth context
    } finally {
      setSubmitting(false);
    }
  }, [login, from, rememberMe]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-all duration-300">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-text-primary dark:text-text-dark-primary transition-colors duration-300">
            School Route Management
          </h2>
          <h3 className="mt-2 text-center text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Sign in to your account
          </h3>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 transition-colors duration-200" role="alert" aria-live="assertive">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300 transition-colors duration-200">
                  {error}
                </p>
              </div>
              {setError && (
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex rounded-md p-1.5 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                      onClick={() => setError(null)}
                      aria-label="Dismiss"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, handleSubmit: formikHandleSubmit }) => (
            <Form onSubmit={(e) => {
              e.preventDefault(); // Explicitly prevent default
              formikHandleSubmit(e);
            }}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      errors.email && touched.email ? "border-red-500 dark:border-red-400" : "border-border-light dark:border-border-dark-mode"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-text-primary dark:text-text-dark-primary rounded-t-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-surface dark:bg-surface-dark transition-colors duration-200`}
                    placeholder="Email address"
                    aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                    aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  />
                  <ErrorMessage 
                    name="email" 
                    component="div" 
                    className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-200"
                    id="email-error"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      errors.password && touched.password ? "border-red-500 dark:border-red-400" : "border-border-light dark:border-border-dark-mode"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-text-primary dark:text-text-dark-primary rounded-b-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-surface dark:bg-surface-dark transition-colors duration-200 pr-10`}
                    placeholder="Password"
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                  <ErrorMessage 
                    name="password" 
                    component="div" 
                    className="text-red-500 dark:text-red-400 text-xs mt-1 transition-colors duration-200"
                    id="password-error"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                    aria-describedby="remember-me-description"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Remember me
                  </label>
                </div>

              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  variant="primary"
                  size="md"
                  className="w-full group relative"
                  aria-busy={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors duration-200" aria-hidden="true" />
                      </span>
                      Sign in
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;