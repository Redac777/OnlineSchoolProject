import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";

const NewService = ({ handleMainClick, schoolToEdit, year }) => {
  const [name, setName] = useState("");
  const [priceValues, setPriceValues] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const maxPricesPerRow = 4; // Nombre maximum de champs de prix par ligne
  const priceRows = Math.ceil(priceValues.length / maxPricesPerRow);

  // Fetch levels from the backend
  useEffect(() => {
    axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
      setLevels(response.data);
    });
  }, [schoolToEdit,year]);

  const allLevelsOption = { value: "all", label: "All Levels" };
  const levelOptions = levels.map((level) => ({ value: level.id, label: level.name }));
  const optionsWithAll = [allLevelsOption, ...levelOptions];



  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "290px",
      padding: "4px 0",
      backgroundColor: "white",
    }),
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      paddingLeft: "0.5rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      paddingLeft: "0.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
      width: "290px",
      marginLeft: "0.7rem",
      marginTop: "-0.4rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedAll = selectedLevels[0].value === "all" ? levels : selectedLevels;


    try {
      const response = await axios.post("/create-service", {
        name: name,
        school_id: schoolToEdit.id,
        prices: priceValues.map((price) => parseFloat(price)),
        levels: selectedAll.map((level) => level.id || level.value),
      });

      if (response.data.success) {
        // Show success message and reset fields
        setShowSuccessToast(true);
        setName("");
        setPriceValues([]);
        setSelectedLevels([]);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 1500);
      } else {
        setShowDangerToast(true);
        setTimeout(() => {
          setShowDangerToast(false);
        }, 1500);
      }
    } catch (error) {
      setShowDangerToast(true);
      console.error(error);
    }
  };

  const handleAddPrice = () => {
    // Ajouter un nouvel élément vide pour saisir un prix
    setPriceValues([...priceValues, ""]);
  };

  const handleRemovePrice = (index) => {
    // Supprimer un élément du tableau de prix
    const newPriceValues = [...priceValues];
    newPriceValues.splice(index, 1);
    setPriceValues(newPriceValues);
  };

  const handleChangePrice = (index, value) => {
    // Mettre à jour un élément du tableau de prix en fonction de l'index
    const newPriceValues = [...priceValues];
    newPriceValues[index] = value;
    setPriceValues(newPriceValues);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {showSuccessToast && (
        <Toast type="success" message="Service added successfully." />
      )}
      {showDangerToast && <Toast type="danger" message="Error adding service" />}

      <h2 className="text-gray-700 font-medium text-xl">New Service</h2>

      <form
        onSubmit={handleSubmit}
        className="w-5/6 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg"
      >
        <div className="flex flex-col mb-6">
          <label htmlFor="name" className="mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
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
          <label className="mb-2 text-sm font-medium text-gray-900">
            Prices
          </label>
          <div className="flex flex-wrap">
            {priceValues.map((price, index) => (
              <div
                key={index}
                className={`flex items-center mb-2 mr-2 ${
                  index >= maxPricesPerRow * priceRows ? 'mt-2' : ''
                }`}
              >
                <input
                  type="number"
                  value={price}
                  onChange={(e) => handleChangePrice(index, e.target.value)}
                  className="block w-40 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                  placeholder="Price"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrice(index)}
                  className="text-red-600 font-medium ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            {priceValues.length < maxPricesPerRow * (priceRows + 1) && (
              <button
                type="button"
                onClick={handleAddPrice}
                className="text-green-600 font-medium"
              >
                Add Price
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-sm font-medium text-gray-900">
            Levels
          </label>
          <Select
            options={optionsWithAll}
            isMulti
            styles={customStyles}
            value={selectedLevels}
            onChange={(selectedOptions) => setSelectedLevels(selectedOptions)}
            components={{ Option: customOption }}
          />
        </div>
        <div className="mt-4 w-full flex justify-center items-center gap-6">
          <Button type="submit" buttonText="Add" />
          <Button type="button" buttonText="Save" onClick={() => handleMainClick("ListServices")} />
        </div>
      </form>
    </div>
  );
};

export default NewService;
