import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Label from "../../../components/reusable/label";
import Select from "react-select";
const NewClass = ({schoolToEdit,handleMainClick,year}) =>{
    const [name,setName] = useState("");
    const [levels, setLevels] = useState([]);
    const levelOptions = levels.map((level) => ({ value: level.id, label: level.name }));
    const [level,setLevel] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    useEffect(() => {
        axios.get(`/listLevels?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          setLevels(response.data);
        });
      }, [year]);

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


//Submit
          const handleSubmit = async (event) => {
            event.preventDefault();
            const className = level.label+"-"+name;

        try {
          const response = await axios.post('/create-class', {
            name : className,
            level : level.value,
            school_id : schoolToEdit.id,
            year_id : year,
          });
          if (response.data.success) {
          // Réinitialiser les champs et afficher un message de succès
          handleAlert("success");
          setTimeout(() => {
          setName('');
          //handleMainClick("ListLevels");
        }, 1500);
        }
          else{
            handleAlert("danger");
          }
        } catch (error) {
          // Afficher un message d'erreur en cas d'échec
          handleAlert("danger");
            setTimeout(() => {
            console.error('Error creating class:', error);
        }, 1500);
        }
      };
    return(
        <div className="w-full flex flex-col justify-center">
            <div>
                {showSuccessToast && <Toast type="success" message="Class added successfully." />}
                {showDangerToast && <Toast type="danger" message="Error adding class" />}
            </div>
            <div className="w-full flex justify-center items-center">
                <h2 className="text-gray-700 font-medium text-xl">New Class</h2>
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
                        <Label forName="level" labelText="Level" variableClassName="mx-3"/>
                        <Select options={levelOptions} styles={customStyles} value={level} components={{ Option: customOption }} isSearchable={false} onChange={(value)=>setLevel(value)}/>
                    </div>
                    <div className="mt-4 w-full flex justify-center items-center gap-6">
                        <Button type="submit" buttonText="Add"/>
                        <Button type="button" buttonText="Save" onClick={()=>{handleMainClick("ListClasses")}}/>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default NewClass;
