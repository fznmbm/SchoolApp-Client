import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePA, getAllPAs } from "@services/pa";
import PATable from "@components/tables/PATable";
import { Button } from "@components/common/Button";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import Popup from "@components/common/modal/Popup";

const ErrorAlert = ({ message }) => (
  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-colors duration-200">
    <div className="flex">
      <ExclamationCircleIcon
        className="h-5 w-5 text-red-400 dark:text-red-300 transition-colors duration-200"
        aria-hidden="true"
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800 dark:text-red-300 transition-colors duration-200">
          {message || "An error occurred while fetching PAs"}
        </p>
      </div>
    </div>
  </div>
);

const PageHeader = ({ onAddClick }) => (
  <div className="flex justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Personal Assistants
      </h1>
      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Manage personal assistants and their information
      </p>
    </div>
    <Button
      onClick={onAddClick}
      className="flex items-center transition-colors duration-200"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      Add PA
    </Button>
  </div>
);

const PAList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    status: "ACTIVE",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["pas", searchParams],
    queryFn: async () => {
      const response = await getAllPAs(searchParams);
      return response;
    },
  });

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [paToDelete, setPAToDelete] = useState(null);

  const queryClient = useQueryClient();
  const {
    mutate: deletePAHandler,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => deletePA(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pas"]); 
      setIsDeletePopupOpen(false); 
    },
  });

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((pa) => {
    setPAToDelete(pa);
    setIsDeletePopupOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (paToDelete) {
      deletePAHandler(paToDelete._id);
    }
  }, [paToDelete, deletePAHandler]);

  const navigateToCreate = useCallback(() => {
    navigate("/pa/create");
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      <PageHeader onAddClick={navigateToCreate} />

      {error && <ErrorAlert message={error?.message} />}
      {isDeleteError && <ErrorAlert message={deleteError?.message} />}

      <PATable
        data={data?.data} 
        isLoading={isLoading}
        pagination={{
          currentPage: Number(data?.currentPage) || searchParams.page,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this PA? This action cannot be undone."
        title="Delete PA"
      />
    </motion.div>
  );
};

export default PAList;