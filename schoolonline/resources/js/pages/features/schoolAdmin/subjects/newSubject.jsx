import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";

const NewSubject = ({ handleMainClick,schoolToEdit,year }) => {
  const [name, setName] = useState("");
  const [coefficientValues, setCoefficientValues] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);

  // Fetch levels from the backend
  useEffect(() => {
    axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setLevels(response.data);
    });
  }, []);
  const allLevelsOption = { value: 'all', label: 'All Levels' };
  const levelOptions = levels.map((level) => ({ value: level.id, label: level.name }));
  const optionsWithAll = [allLevelsOption, ...levelOptions];
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "290px",
      padding : "4px 0",
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
      width :"290px",
      marginLeft: "0.7rem",
      marginTop : "-0.4rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedAll = selectedLevels[0].value=="all" ? levels : selectedLevels;
    try {
        const response = await axios.post("/create-subject", {
          name: name,
          school_id: schoolToEdit.id,
          coefficients: coefficientValues,
          levels: selectedAll.map((level) => level.id || level.value),
          year_id:year,
        });

      if (response.data.success) {
        // Show success message and reset fields
        setShowSuccessToast(true);
        setName("");
        setCoefficientValues("");
        setSelectedLevels([]);
        setTimeout(() => {
            setShowSuccessToast(false);
        },1500);
      } else {
        setShowDangerToast(true);
        setTimeout(() => {
            setShowDangerToast(false);
        },1500);
      }
    } catch (error) {
      setShowDangerToast(true);
      console.error("Error creating subject:", error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {showSuccessToast && (
        <Toast type="success" message="Subject added successfully." />
      )}
      {showDangerToast && <Toast type="danger" message="Error adding subject" />}

      <h2 className="text-gray-700 font-medium text-xl">New Subject</h2>

      <form
        onSubmit={handleSubmit}
        className="w-1/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg"
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
        <label htmlFor="coefficients" className="mb-2 text-sm font-medium text-gray-900">
        Coefficients (comma-separated)
      </label>
      <input
        type="text"
        id="coefficients"
        className="block w-72 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
        value={coefficientValues}
        onChange={(e) => setCoefficientValues(e.target.value)}
        required
      />
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
                        <Button type="submit" buttonText="Add"/>
                        <Button type="button" buttonText="Save" onClick={()=>{handleMainClick("ListSubjects")}}/>
                    </div>
      </form>
    </div>
  );
};

export default NewSubject;
