import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpenIcon } from '@heroicons/react/24/outline';

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05 
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const EmptyState = ({ message = "No data available" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 px-4 transition-colors duration-200"
    role="status"
    aria-live="polite"
  >
    <FolderOpenIcon className="w-12 h-12 text-gray-400 dark:text-gray-300 mb-4 transition-colors duration-200" />
    <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1 transition-colors duration-200">No Data Found</h3>
    <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">{message}</p>
  </motion.div>
);

export const Table = ({
  columns,
  data,
  isLoading,
  pagination,
  className,
  emptyStateMessage,
}) => {
  const handlePageChange = useCallback((newPage) => {
    pagination?.onPageChange(newPage);
  }, [pagination]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center" role="status" aria-label="Loading">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-6 h-6 border-2 border-gray-300 dark:border-gray-400 border-t-blue-600 dark:border-t-blue-500 rounded-full transition-colors duration-200"
        />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className={`bg-surface dark:bg-surface-dark rounded-lg shadow dark:shadow-gray-800 transition-colors duration-200 ${className}`}>
        <EmptyState message={emptyStateMessage} />
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg shadow dark:shadow-gray-800 transition-all duration-200 ${className}`}>
      <motion.table 
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        role="table"
        aria-label="Data table"
      >
        <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider transition-colors duration-200"
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <AnimatePresence>
          <motion.tbody className="bg-surface dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                variants={rowVariants}
                className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                role="row"
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.accessor}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white transition-colors duration-200"
                    role="cell"
                  >
                    {column.cell
                      ? column.cell(row)
                      : row[column.accessor]
                      ? String(row[column.accessor])
                      : ''}
                  </td>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        </AnimatePresence>
      </motion.table>

      {pagination && (
        <motion.div 
          className="px-6 py-4 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark-mode flex items-center justify-between transition-colors duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="navigation"
          aria-label="Pagination navigation"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 border border-border-light dark:border-border-dark-mode rounded-md text-sm font-medium transition-colors duration-200 ${
              pagination.currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-surface dark:bg-surface-dark text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            aria-label="Previous page"
            aria-disabled={pagination.currentPage === 1}
          >
            Previous
          </motion.button>

          <span className="text-sm text-text-primary dark:text-white transition-colors duration-200" aria-live="polite">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 border border-border-light dark:border-border-dark-mode rounded-md text-sm font-medium transition-colors duration-200 ${
              pagination.currentPage === pagination.totalPages
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-surface dark:bg-surface-dark text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            aria-label="Next page"
            aria-disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  }),
  className: PropTypes.string,
  emptyStateMessage: PropTypes.string,
};

Table.defaultProps = {
  data: [],
  isLoading: false,
  className: '',
  emptyStateMessage: 'No data available',
};

export default Table;