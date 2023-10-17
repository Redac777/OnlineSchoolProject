import React, { useState, useEffect } from "react";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import axios from "axios";

export default function SubjectDetails({ subject, handleMainClick }) {
  const [levels, setLevels] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [editedCoefficients, setEditedCoefficients] = useState({});
  useEffect(() => {
    // Fetch levels associated with the subject
      setLevels(subject.levels);
  }, [subject]);

  const buttonSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-4 h-4 mr-2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );


  const handleCoefficientChange = (levelId, coefficient) => {
    setEditedCoefficients((prevCoefficients) => ({
      ...prevCoefficients,
      [levelId]: coefficient,
    }));
  };


  const handleSaveCoefficients = async () => {
    try {
      const response = await axios.post(`/update-subject-coefficients/${subject.id}`, {
        coefficients: editedCoefficients,
      });

      if (response.data.success) {
        // Update coefficients locally after successful API call
        setShowSuccessToast(true);
        subject.levels.forEach((level) => {
          if (editedCoefficients.hasOwnProperty(level.id)) {
            level.pivot.coefficient = editedCoefficients[level.id];
          }
        });
        setTimeout(() => {
            setShowSuccessToast(false);
          }, 1500);

        // Clear edited coefficients
        setEditedCoefficients({});
      }
    } catch (error) {
        setShowDangerToast(true);
        setTimeout(() => {
        setShowDangerToast(false);
      }, 1500);
      console.error("Error updating coefficients:", error);
    }
  };
  const handleDeleteLevel = async (levelId) => {
    const confirmation = confirm("Please confirm delete action");
    if(confirmation){
    try {
      await axios.delete(`/subject/${subject.id}/detach-level/${levelId}`);
      // After successful deletion, update the levels list
      setShowSuccessToast(true);
      setLevels((prevLevels) => prevLevels.filter((level) => level.id !== levelId));
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 1500);
    } catch (error) {
      setShowDangerToast(true);
      setTimeout(() => {
        setShowDangerToast(false);
      }, 1500);
      console.error("Error deleting level:", error);
    }
}
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {showSuccessToast && <Toast type="success" message="Details updated successfully." />}
      {showDangerToast && <Toast type="danger" message="Error updating details" />}
      <div className="rounded-full">
        <h2 className="w-36 rounded-full p-5 bg-main-bg shadow-md flex justify-center items-center">
          {subject.name}
        </h2>
      </div>
      <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-14">
        <thead class="text-xs bg-slate-300 text-slate-800 uppercase ">
          <tr>
            <th scope="col" class="px-6 py-3">
              Level
            </th>
            <th scope="col" class="px-6 py-3">
              Coefficient
            </th>
            <th scope="col" class="px-6 py-3 w-1/6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => (
            <tr key={level.id}>
              <td className="px-6">{level.name}</td>
              <td className="px-6"><input
                  type="number"
                  value={editedCoefficients[level.id] || level.pivot.coefficient}
                  onChange={(e) =>
                    handleCoefficientChange(level.id, parseFloat(e.target.value))
                  }
                /></td>
              <div className="flex w-full h-full items-center">
                <a
                  href="#"
                  className="font-medium text-red-500 hover:underline px-6"
                  onClick={() => handleDeleteLevel(level.id)}
                >
                  Detach
                </a>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-6 items-center my-14 w-full ">
        <Button type="button" svgContent={buttonSvg} buttonText="Back" onClick={() => { handleMainClick("ListSubjects") }} />
        <Button type="button" onClick={handleSaveCoefficients} buttonText="Save Changes"/>
      </div>
    </div>
  );
}
