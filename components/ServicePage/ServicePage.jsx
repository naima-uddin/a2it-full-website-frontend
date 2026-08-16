import React from "react";
import { useParams } from "react-router";

const ServicePage = () => {
  const { serviceId } = useParams();

  const formatTitle = (slug) => {
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen py-20 text-center">
      <h1 className="text-4xl font-bold text-[#f36e27]">
        {formatTitle(serviceId)}
      </h1>
      <p className="mt-4 text-gray-600">
        This page provides detailed information about {formatTitle(serviceId)}.
      </p>
    </div>
  );
};

export default ServicePage;
