import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '@context/ThemeContext';

const Logo = ({ className = '' }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {/* You can replace this with an actual SVG or image */}
      <h2 className={`text-2xl font-bold text-primary dark:text-primary-light transition-colors`}>
        SchoolRoute
      </h2>
    </Link>
  );
};

export default Logo;