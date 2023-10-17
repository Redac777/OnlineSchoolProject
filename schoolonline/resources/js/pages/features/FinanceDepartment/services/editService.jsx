import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Label from "../../../components/reusable/label";

const EditService = ({ handleMainClick, service }) => {
  const [name, setName] = useState(service?.name || "");
  const [price, setPrice] = useState(service?.price || "");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);

  useEffect(() => {
    if (showSuccessToast || showDangerToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast]);

  const handleAlert = (type) => {
    if (type === "success") setShowSuccessToast(true);
    else setShowDangerToast(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/update-service/${service.id}`, {
        name: name,
        price: price,
      });

      if (response.data.message === "Service updated successfully") {
        // Réinitialiser les champs et afficher un message de succès
        handleAlert("success");
        setTimeout(() => {
          setName("");
          setPrice("");
          handleMainClick("ListServices");
        }, 1500);
      } else {
        handleAlert("danger");
      }
    } catch (error) {
      // Afficher un message d'erreur en cas d'échec
      handleAlert("danger");
      console.error("Error updating service:", error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div>
        {showSuccessToast && <Toast type="success" message="Service updated successfully." />}
        {showDangerToast && <Toast type="danger" message="Error updating service" />}
      </div>
      <div className="w-full flex justify-center items-center">
        <h2 className="text-gray-700 font-medium text-xl">Edit Service</h2>
      </div>
      <div className="w-full flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-1/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg"
        >
          <div className="flex flex-col mb-6">
            <Label forName="name" labelText="Name" />
            <input
              type="text"
              id="name"
              className="block w-72 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-6">
            <Label forName="price" labelText="Price" />
            <input
              type="text"
              id="price"
              className="block w-72 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <Button type="submit" buttonText="Edit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
