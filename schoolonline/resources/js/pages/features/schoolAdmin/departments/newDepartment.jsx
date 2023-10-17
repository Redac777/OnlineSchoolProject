import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import Input from "../../../components/reusable/input";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Label from "../../../components/reusable/label";
const NewDepartment = ({schoolToEdit,handleMainClick,year}) =>{
    const [name,setName] = useState("");
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone,setPhone] = useState('');
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


          const generateRandomCode = () => {
            const randomNumbers = Math.floor(Math.random() * 9000000000) + 1000000000; // Generates a 4-digit random number
            const password = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(lastName.length - 1).toUpperCase()}${randomNumbers}`;
            return password;
        };

          const handleSubmit = async (event) => {
            event.preventDefault();
            const generatedRandomCode = generateRandomCode();
            // console.log("name : " + name);
            // console.log("lastName : " + lastName);
            // console.log("firstName : " + firstName);
            // console.log("email : " + email);
            // console.log("phone : " + phone);
            // console.log("username : " + generatedRandomCode);
            // console.log("code : " + generatedRandomCode);
            // console.log("password : " + generatedRandomCode);
            // console.log("school id : "+schoolToEdit.id);
            // console.log("year id : "+year);

        try {
          const response = await axios.post('/create-department', {
            name : name,
            code : generatedRandomCode,
            lastName : lastName,
            firstName : firstName,
            email : email,
            phone : phone,
            password: generatedRandomCode, // Pass the generated password to the server
            username : generatedRandomCode,
            school_id : schoolToEdit.id,
            year_id : year,
          });
          if (response.data.success) {
          // Réinitialiser les champs et afficher un message de succès
          handleAlert("success");
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
                {showSuccessToast && <Toast type="success" message="Department added successfully." />}
                {showDangerToast && <Toast type="danger" message="Error adding department" />}
            </div>
            <div className="w-full flex justify-center items-center">
                <h2 className="text-gray-700 font-medium text-xl">New Department</h2>
            </div>
            <div className="w-full flex justify-center items-center">
                <form onSubmit={handleSubmit} className="w-1/3 flex flex-col items-center justify-center p-8 mt-8 shadow-md shadow-gray-300 rounded-lg">
                    <div className="flex flex-col mb-6">
                        <Label forName="name" labelText="Name" />
                        <input type="text" id="name" className="block w-72 py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-400" value={name} onChange={(e) => setName(e.target.value)} required
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="w-full flex justify-center items-center mt-10">
                            <h2 className="text-gray-700 font-medium text-md">~~~~Department Admin~~~~</h2>
                        </div>
                        <div className="flex flex-col w-full mt-10">
                            <div className="flex w-full justify-center gap-24">
                                <div className="mb-6 w-[42%]">
                                    <label for="lastName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Last Name</label>
                                    <Input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"  className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5" required/>
                                </div>
                                <div className="mb-6 w-[42%]">
                                    <label for="firstName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">First Name</label>
                                    <Input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"  className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5" required/>
                                </div>
                            </div>
                            <div className="flex w-full justify-center gap-18 mt-2">
                                <div className="mb-6 w-[42%]">
                                    <label for="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Email</label>
                                    <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5"  required/>
                                </div>
                                <div className="mb-6 w-[42%]">
                                    <label for="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Phone</label>
                                    <Input type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone"  className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5" required/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 w-full flex justify-center items-center gap-6">
                        <Button type="submit" buttonText="Add"/>
                        <Button type="button" buttonText="Save" onClick={()=>{handleMainClick("ListDepartments")}}/>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default NewDepartment;
