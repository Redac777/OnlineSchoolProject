import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Input from "../../../components/reusable/input";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Label from "../../../components/reusable/label";
import Select from "react-select";
const NewLevel = ({schoolToEdit,handleMainClick,year}) =>{
    const [name,setName] = useState("");
    const [category,setCategory] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const options = [
        {value : "pre school",label : "Pre school"},
        { value: "primary", label: "Primary"},
        { value: "secondary", label: "Secondary"},
        { value: "high school" , label : "High School"}
      ];

      const customStyles = {
        control: (provided) => ({
          ...provided,
          border: "1px solid #e2e8f0",
          borderRadius: "0.375rem",
          margin: "10px",
          width: "290px",
          backgroundColor: "#f9fafb",
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

      useEffect(() => {
            if (showSuccessToast || showDangerToast || showWarningToast) {
              const timer = setTimeout(() => {
                setShowSuccessToast(false);
                setShowDangerToast(false);
                setShowWarningToast(false);
              }, 1500);

              return () => clearTimeout(timer);
            }
          }, [showSuccessToast, showDangerToast, showWarningToast]);

          const handleAlert = (type) => {
            if (type === "success") setShowSuccessToast(true);
            else if (type === "warning") setShowWarningToast(true);
            else setShowDangerToast(true);
          };
          const handleSubmit = async (event) => {
            event.preventDefault();
            const categoryValue = category.value;
        try {
          const response = await axios.post('/create-level', {
            name : name,
            category : categoryValue,
            school_id : schoolToEdit.id,
            year_id : year,
          });
          if (response.data.success) {
          // Réinitialiser les champs et afficher un message de succès
          handleAlert("success");
          setTimeout(() => {
          setName('');
        }, 1500);
        }
          else{
            handleAlert("danger");
          }
        } catch (error) {
          // Afficher un message d'erreur en cas d'échec
          handleAlert("danger");
            setTimeout(() => {
            console.error('Error creating level:', error);
        }, 1500);

        }
      };
    return(
        <div className="w-full flex flex-col justify-center">
            <div>
                {showSuccessToast && <Toast type="success" message="Level added successfully." />}
                {showDangerToast && <Toast type="danger" message="Error adding level" />}
            </div>
            <div className="w-full flex justify-center items-center">
                <h2 className="text-gray-700 font-medium text-xl">New Level</h2>
            </div>
            <div className="w-full flex justify-center items-center">
                <form onSubmit={handleSubmit} className="w-1/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg">
                    <div className="flex flex-col mb-6">
                        <Label forName="name" labelText="Name" />
                        <input
            type="text"
            id="name"
            className="block w-72 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />                    </div>
                    <div className="flex flex-col mb-6">
                        <Label forName="category" labelText="Category" variableClassName="mx-3"/>
                        <Select options={options} styles={customStyles} value={category} components={{ Option: customOption }} isSearchable={false} onChange={setCategory}/>
                    </div>
                    <div className="mt-4 w-full flex justify-center items-center gap-6">
                        <Button type="submit" buttonText="Add"/>
                        <Button type="button" buttonText="Save" onClick={()=>{handleMainClick("ListLevels")}}/>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default NewLevel;
