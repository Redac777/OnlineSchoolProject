import React, { useState,useEffect } from 'react';
import Select from "react-select";
import Input from "../../../components/reusable/input";
import Button from "../../../components/reusable/button";
import axios from 'axios';
import Toast from '../../../components/reusable/toast';
export default function NewSchool({handleMainClick,year }) {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [manager, setManager] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [packs, setPacks] = useState([]); // State to hold the list of packs
    const [selectedPack, setSelectedPack] = useState(null); // State to hold the selected pack
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);


    //Récuperer les packs
    useEffect(() => {
        // Fetch packs from the backend
        axios.get("/packs").then((response) => {
          setPacks(response.data);
        });
      }, []);

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

    const handleSubmit = async (packId) => {
        // setIsLoading(true);
        const generatedRandomCode = generateRandomCode();
        //console.log([name,city,manager,lastName,generatedRandomCode,email,phone,packId]);
        try {
            const response = await axios.post('/createSchool', {
                name : name,
                city : city,
                manager : manager,
                code : generatedRandomCode,
                lastName : lastName,
                firstName : firstName,
                email : email,
                phone : phone,
                password: generatedRandomCode, // Pass the generated password to the server
                username : generatedRandomCode,
                pack_id : packId,
                year_id : year,
            });

            if (response.data.success) {
                handleAlert("success");
                setTimeout(() => {
                // Réinitialiser les champs
                setName('');
                setCity('');
                setManager('');
                setLastName('');
                setFirstName('');
                setEmail('');
                handleMainClick("ListSchools");
            }, 1500);

            } else {
                handleAlert("danger");
                setTimeout(() => {
                alert('Error creating school and admin user');
            }, 1500);
            }
        } catch (error) {
            handleAlert("danger");
            setTimeout(() => {
            console.error('Error creating school and admin user:', error);
        }, 1500);
        } finally {
            // setIsLoading(false);
        }
    };

    const listPacks = packs.map(pack => {
        return(
        <div class="w-[30%] flex flex-col items-start p-6 bg-main-bg border border-gray-200 rounded-lg shadow">
                        <div className="w-full flex justify-center items-center">
                        <h5 class="mb-4 text-md font-medium text-gray-500">{pack.name}</h5>
                        </div>
                        <div class="flex items-baseline justify-center text-gray-900 mt-2 w-full">
                            <span class="text-lg font-extrabold tracking-tight mr-1">{Math.floor((pack.price/pack.duration) +  (pack.price/(pack.duration*10)))}</span>
                            <span class="text-md font-normal text-gray-500">Mad</span>
                            <span class="ml-1 text-md font-normal text-gray-500">/month</span>
                        </div>
                        <div class="flex items-baseline justify-center text-gray-900 mt-3 w-full gap-2">
                            <span class="text-md font-semibold">Or</span>
                        </div>
                        <div class="flex items-baseline justify-center text-gray-900 mt-3 w-full">
                            <span class="text-lg font-extrabold tracking-tight mr-1">{pack.price}</span>
                            <span class="text-md font-normal text-gray-500">Mad</span>
                        </div>
                        <div className="mt-10 w-full">
                        <Button type="button" buttonText="Choose plan" variableClassName="w-full flex justify-center" onClick={()=>{handleSubmit(pack.id)}}/>
                        </div>
        </div>)
    });
    return(
        <div className="w-full flex flex-col items-center">
            <div>
                {showSuccessToast && <Toast type="success" message="School added successfully." />}
                {showDangerToast && <Toast type="danger" message="Error adding school" />}
            </div>
            <div className="w-full flex justify-center items-center">
                <h2 className="text-gray-700 font-medium text-xl">New School</h2>
            </div>
            <form className="w-full mt-12 flex justify-center" onSubmit={handleSubmit}>
                <div className="flex flex-col w-1/2 px-6 border-r-2 border-gray-300">
                    <div className="flex justify-between">
                            <div className="mb-6 w-[32%]">
                                <label for="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Name</label>
                                <Input type="text"  name="name"  value={name} onChange={(e) => setName(e.target.value)} placeholder="School Name" className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5" required/>
                            </div>
                            <div className="mb-6 w-[32%]">
                                <label for="city" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">City</label>
                                <Input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5"  required/>
                            </div>
                            <div className="mb-6 w-[32%]">
                                <label for="manager" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Manager</label>
                                <Input type="text" name="manager" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Manager" className="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-full px-2.5"  required/>
                            </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-full flex justify-center items-center mt-10">
                            <h2 className="text-gray-700 font-medium text-md">~~~~School Admin~~~~</h2>
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
                </div>
                <div className="w-1/2 flex justify-between h-fit px-6 pt-4">
                    {listPacks}
                </div>

            </form>
        </div>
        )
}
