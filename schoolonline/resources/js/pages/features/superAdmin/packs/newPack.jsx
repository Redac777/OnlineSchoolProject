import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Input from "../../../components/reusable/input";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Label from "../../../components/reusable/label";
const NewPack = ({handleMainClick,year}) =>{
    const [name,setName] = useState("");
    const [price,setPrice] = useState(0.0);
    const [duration,setDuration] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);

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

        try {
          const response = await axios.post('/create-pack', {
            name : name,
            price : price,
            duration : duration,
            year_id : year,
          });
          if (response.data.success) {
          // Réinitialiser les champs et afficher un message de succès
          handleAlert("success");
          setTimeout(() => {
          setName('');
          setPrice('');
          setDuration('');
          handleMainClick("ListPacks");
        }, 1500);
        }
          else{
            handleAlert("danger");
          }
        } catch (error) {
          // Afficher un message d'erreur en cas d'échec
          handleAlert("danger");
            setTimeout(() => {
            console.error('Error creating school and admin user:', error);
        }, 1500);

        }
      };
    return(
        <div className="w-full flex flex-col justify-center">
            <div>
                {showSuccessToast && <Toast type="success" message="Pack added successfully." />}
                {showDangerToast && <Toast type="danger" message="Error adding pack" />}
            </div>
            <div className="w-full flex justify-center items-center">
                <h2 className="text-gray-700 font-medium text-xl">New Pack</h2>
            </div>
            <div className="w-full flex justify-center items-center">
                <form onSubmit={handleSubmit} className="w-1/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg">
                    <div className="flex flex-col mb-6">
                        <Label forName="name" labelText="Name" />
                        <Input type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} required/>
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label forName="price" labelText="Price" />
                        <Input type="number" name="price" onChange={(e) => setPrice(e.target.value)} value={price} required/>
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label forName="duration" labelText="Duration" />
                        <Input type="number" name="duration" onChange={(e) => setDuration(e.target.value)} value={duration} required/>
                    </div>
                    <div className="mt-4">
                        <Button type="submit" buttonText="Add"/>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default NewPack;
