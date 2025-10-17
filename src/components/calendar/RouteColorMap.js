
export const getRouteColor = (routeNo, isDarkMode = false) => {
  // Skip if no route number
  if (!routeNo) {
    return isDarkMode 
      ? 'bg-gray-700 text-gray-200 transition-colors duration-200' 
      : 'bg-gray-200 text-gray-800 transition-colors duration-200';
  }
  
  const colors = [
    // Light mode : Dark mode pairs
    {
      light: 'bg-blue-200 text-blue-800',
      dark: 'bg-blue-800 text-blue-200'
    },
    {
      light: 'bg-green-200 text-green-800',
      dark: 'bg-green-800 text-green-200'
    },
    {
      light: 'bg-purple-200 text-purple-800',
      dark: 'bg-purple-800 text-purple-200'
    },
    {
      light: 'bg-pink-200 text-pink-800',
      dark: 'bg-pink-800 text-pink-200'
    },
    {
      light: 'bg-yellow-200 text-yellow-800',
      dark: 'bg-yellow-800 text-yellow-200'
    },
    {
      light: 'bg-indigo-200 text-indigo-800',
      dark: 'bg-indigo-800 text-indigo-200'
    },
    {
      light: 'bg-red-200 text-red-800',
      dark: 'bg-red-800 text-red-200'
    },
    {
      light: 'bg-teal-200 text-teal-800',
      dark: 'bg-teal-800 text-teal-200'
    },
    {
      light: 'bg-orange-200 text-orange-800',
      dark: 'bg-orange-800 text-orange-200'
    },
    {
      light: 'bg-emerald-200 text-emerald-800',
      dark: 'bg-emerald-800 text-emerald-200'
    }
  ];
  
  let hash = 0;
  const routeString = String(routeNo);
  for (let i = 0; i < routeString.length; i++) {
    hash = routeString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % colors.length;
  
  return isDarkMode 
    ? `${colors[colorIndex].dark} transition-colors duration-200` 
    : `${colors[colorIndex].light} transition-colors duration-200`;
};


export const getRouteColorClasses = (routeNo) => {
  if (!routeNo) {
    return {
      light: 'bg-gray-200 text-gray-800',
      dark: 'bg-gray-700 text-gray-200'
    };
  }
  
  let hash = 0;
  const routeString = String(routeNo);
  for (let i = 0; i < routeString.length; i++) {
    hash = routeString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    {
      light: 'bg-blue-200 text-blue-800',
      dark: 'bg-blue-800 text-blue-200'
    },
    {
      light: 'bg-green-200 text-green-800',
      dark: 'bg-green-800 text-green-200'
    },
    {
      light: 'bg-purple-200 text-purple-800',
      dark: 'bg-purple-800 text-purple-200'
    },
    {
      light: 'bg-pink-200 text-pink-800',
      dark: 'bg-pink-800 text-pink-200'
    },
    {
      light: 'bg-yellow-200 text-yellow-800',
      dark: 'bg-yellow-800 text-yellow-200'
    },
    {
      light: 'bg-indigo-200 text-indigo-800',
      dark: 'bg-indigo-800 text-indigo-200'
    },
    {
      light: 'bg-red-200 text-red-800',
      dark: 'bg-red-800 text-red-200'
    },
    {
      light: 'bg-teal-200 text-teal-800',
      dark: 'bg-teal-800 text-teal-200'
    },
    {
      light: 'bg-orange-200 text-orange-800',
      dark: 'bg-orange-800 text-orange-200'
    },
    {
      light: 'bg-emerald-200 text-emerald-800',
      dark: 'bg-emerald-800 text-emerald-200'
    }
  ];
  
  const colorIndex = Math.abs(hash) % colors.length;

  return colors[colorIndex];
};


export const getRouteTailwindColor = (routeNo) => {
  const colors = getRouteColorClasses(routeNo);
  return `${colors.light} dark:${colors.dark.replace(/\s+/g, ' dark:')} transition-colors duration-200`;
};