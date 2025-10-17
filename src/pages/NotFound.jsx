import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-background-dark-primary">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600 dark:text-text-dark-secondary">Page not found</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;