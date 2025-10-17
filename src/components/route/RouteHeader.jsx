import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import RouteSummaryGenerator from '@components/route/RouteSummaryGenerator';

const RouteHeader = ({ id, route }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex justify-between items-center">
      <Button 
        onClick={() => navigate(-1)} 
        aria-label="Back to routes"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Routes
      </Button>
      <div className="flex gap-2">
        {route && <RouteSummaryGenerator route={route} />}
        <Button
          onClick={() => navigate(`/routes/${id}/edit`)}
          aria-label="Edit route"
        >
          Edit Route
        </Button>
      </div>
    </div>
  );
};

export default RouteHeader;