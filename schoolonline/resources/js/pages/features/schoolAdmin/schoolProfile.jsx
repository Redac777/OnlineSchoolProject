import React, { useState,useEffect, useRef } from "react";
import change from '../../../../../public/images/change.png';
import Input from "../../components/reusable/input";
import Button from "../../components/reusable/button";
import Toast from '../../components/reusable/toast';
import axios from 'axios';


const SchoolProfile = ({user,schoolToEdit,handleMainClick,updateSchool}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isMouseOver,setIsMouseOver] = useState(false);
  const [schoolId,setSchoolId] = useState(schoolToEdit?.id);
  const [name,setName] = useState(schoolToEdit?.name || '');
  const [address,setAddress] = useState(schoolToEdit?.address || '');
  const [phone,setPhone] = useState(schoolToEdit?.phone || '');
  const [city,setCity] = useState(schoolToEdit?.city || ' ');
  const [manager, setManager] = useState(schoolToEdit?.manager|| ''); // État pour stocker le genre
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [schoolLogoURL,setSchoolLogoURL] = useState(schoolToEdit?.logo || "");
  const [imageChanged,setImagechanged] = useState(false);
  const [imagefile,setImageFile] = useState();

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

  const handleNameChange = (event) => {
    const newUserName = event.target.value;
    setName(newUserName);
  }

  const handleManagerChange = (event) => {
    const newManager = event.target.value;
    setManager(newManager);
  };

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setCity(newCity);
  };

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  }
  const handlePhoneChange = (event) => {
    const newPhone = event.target.value;
    setPhone(newPhone);
  }

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    if(imageChanged) {
    const formData = new FormData();
    formData.append('image', imagefile);
    // Effectuer une requête vers votre endpoint backend
    axios.post('/upload-image', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})
.then(response => {
    // Récupérer les données du modèle File depuis la réponse JSON
    const file = response.data.file;

    // Utiliser les données du modèle File comme vous le souhaitez
    console.log(file.file_path); // Affiche le chemin du fichier
    console.log(file.file_type); // Affiche le type de fichier
    const schoolProf = file.file_path;
    const response2 = axios.put(`/update-school-profile/${schoolId}`, {
        'name' : name,
        'city': city,
        'address': address,
        'phone': phone,
        'logo' : schoolProf,
        'manager': manager,
})
    response2.then((response2)=>{
        handleAlert("success");
        setTimeout(() => {
            updateSchool(response2.data.school);
            handleMainClick("Home");
          }, 1500);
    })
  .catch(error => {
    handleAlert("danger");
    setTimeout(() => {
        console.log(error);
    }, 1500);
    // Gérez les erreurs d'une manière appropriée ici
  });



})
    .catch(err => console.log(err));
}

else{
    const response2 = axios.put(`/update-school-profile/${schoolId}`, {
        'name' : name,
        'city': city,
        'address': address,
        'phone': phone,
        'logo' : schoolLogoURL,
        'manager': manager,
})
    response2.then((response2)=>{
        handleAlert("success");
        setTimeout(() => {
            updateSchool(response2.data.school);
            handleMainClick("Home");
          }, 1500);
    })
  .catch(error => {
    handleAlert("danger");
    setTimeout(() => {
        console.log(error);
    }, 1500);
    // Gérez les erreurs d'une manière appropriée ici
  });
}


  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  }
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  }

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setImagechanged(true);
    const imagesFile = event.target.files[0];
    setProfileImage(URL.createObjectURL(imagesFile));
    setImageFile(imagesFile);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  return (
        <>
      <div>
      {showSuccessToast && <Toast type="success" message="School updated successfully." />}
      {showDangerToast && <Toast type="danger" message="Error updating School." />}
      </div>

    <div className="w-full h-fit flex flex-col justify-center p-6 relative z-0">
      {/* Start of  Header Edit Profile  */}
      <div className="w-full flex justify-center items-center pt-4">
        <h2 className="text-gray-700 font-medium text-xl">{user.lang=="eng" ? "Edit School Profile" :(user.lang=="fr" ? "Modifier Profile Ecole" :"تعديل ملف المؤسسة")}</h2>
      </div>
      {/* End of Header Edit Profile */}
      <form className="flex flex-col" onSubmit={handleUpdateProfile}>
        {/* Other form fields htmlFor editing profile information */}
        <div className="flex justify-center items-start gap-28 pt-10 w-full">
          {/* Start of Profile Image part */}
          <div className="mt-8 w-1/4 flex flex-col items-center" >
          <div
          className="cursor-pointer"
          onClick={handleProfileImageClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Profile Image */}
          <img
            src={isMouseOver ? change : (profileImage || `http://localhost:8000/storage/${schoolToEdit.logo}`)}
            alt="Logo"
            className={`w-28 h-28 rounded-full object-cover bg-gray-200 ${isMouseOver && "p-10"}`}
          />

          {/* File Input */}
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
          </div>
          {/* End of Profile Image part */}
          {/* Inputs Part */}
          <div className="mt-6 flex w-3/4 justify-between">
            <div className="w-1/2 flex flex-col ">
                {/* Name */}
                <div className="flex flex-col justify-center items-center w-72">
                    <div className="flex items-center w-full">
                        <label htmlFor="name" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Name" : (user.lang=="fr" ?  "Nom" : "اسم المؤسسة")}</label>
                    </div>
                    <div className="flex items-center w-full">
                        <Input type="text" id="name" name="name" value={name || ''} onChange={handleNameChange}/>
                    </div>
                </div>
                {/*City  */}
                <div className="flex flex-col justify-center items-center mt-5 w-72">
                    <div className="flex items-center w-full">
                        <label htmlFor="city" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="عربي" ? "البريد الإلكتروني" : (user.lang=="fr" ? "Ville" : "City")}</label>
                    </div>
                    <div className="flex items-center w-full">
                        <Input type="text" name="city" value={city || ''} onChange={handleCityChange} required/>
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col">

            {/* Manager */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="manager" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Manager" : (user.lang=="fr" ? "Directeur":"المدير") }</label>
              </div>
              <div className="flex items-center w-full">
              <Input type="text" name="manager" value={manager || ''} onChange={handleManagerChange} require/>              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="address" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Address" : (user.lang=="fr" ? "Adresse" : "العنوان")}</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" name="address" value={address || ''} onChange={handleAddressChange} />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="phone" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Phone" : (user.lang=="fr" ? "Tél" : "الهاتف") }</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" name="phone" value={phone || ''} onChange={handlePhoneChange}/>
              </div>
            </div>

            <div className="mt-6">
            <Button type="submit" buttonText="Edit"/>
            </div>
            </div>



          </div>

        </div>

      </form>
    </div>
    </>
  );
};

export default SchoolProfile;






