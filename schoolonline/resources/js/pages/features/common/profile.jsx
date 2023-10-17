import React, { useState,useEffect, useRef } from "react";
import Select from "react-select";
import oeil from '../../../../../public/images/oeil.png';
import cacher from '../../../../../public/images/cacher.png';
import english from '../../../../../public/images/english.png';
import france from '../../../../../public/images/france.png';
import arabe from '../../../../../public/images/saudiArabia.png';
import change from '../../../../../public/images/change.png';
import Input from "../../components/reusable/input";
import Button from "../../components/reusable/button";
import Toast from '../../components/reusable/toast';
import axios from 'axios';
const options = [
  { value: "eng", label: "ENG", icon: english },
  { value: "fr", label: "FR", icon: france },
  { value: "عربي", label: "عربي", icon: arabe },

];

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    margin: "10px",
    width: "100px",
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
  }),
};

const customOption = ({ innerProps, label, data }) => (
  <div {...innerProps} className="flex items-center cursor-pointer">
    <img src={data.icon} alt={label} style={{ width: "1rem", marginRight: "0.5rem" }} />
    {label}
  </div>
);

const Profile = ({user,handleMainClick,updateUser}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [eyePassword, setEyePassword] = useState(true);
  const [eyeConfirm, setEyeConfirm] = useState(true);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Set the initial selected option here
  const [isMouseOver,setIsMouseOver] = useState(false);
  const [userId,setUserId] = useState(user.id);

  const [username,setUserName] = useState(user?.username || '');
  const [lastName,setLastName] = useState(user?.lastName || '');
  const [firstName,setFirstName] = useState(user?.firstName || '');
  const [address,setAddress] = useState(user?.address || '');
  const [phone,setPhone] = useState(user?.phone || '');
  const [email,setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || ''); // État pour stocker le genre
  const [birthDay, setBirthday] = useState(user?.birthDay || '');
  const [password,setPassword] = useState(user?.password || '');
  const [confirmPassword,setConfirmPassword] = useState(user?.password || '');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showWarning2Toast, setShowWarning2Toast] = useState(false);
  const [imageChanged,setImagechanged] = useState(false);
  const [imagefile,setImageFile] = useState();
  const [profilURL,setProfilURL] = useState(user?.userProfil || "");


  useEffect(() => {
    // Set the selected option based on the user's language after component mounts
    const userLanguage = user.lang;
    const languageOption = options.find(option => option.value === userLanguage);

    if (languageOption) {
      setSelectedOption(languageOption);
    }
  }, [user.lang]);

  const handleUserNameChange = (event) => {
    const newUserName = event.target.value;
    setUserName(newUserName);
  }
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    if (newPassword) {
        setPassword(newPassword);
      }

  }

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
    else if (type === "warning")
        setShowWarningToast(true);
    else if (type === "warning2")
        setShowWarning2Toast(true);
    else setShowDangerToast(true);
  };

  const handleConfirmPasswordChange = (event) => {
    const newPassword = event.target.value;
    if (newPassword) {
      setConfirmPassword(newPassword);
    }
  }

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleBirthdayChange = (event) => {
    const newBirthday = event.target.value;
    setBirthday(newBirthday);
  };

  const handleLastNameChange = (event) => {
    const newLastName = event.target.value;
    setLastName(newLastName);
  }
  const handleFirstNameChange = (event) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);
  }
  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  }
  const handlePhoneChange = (event) => {
    const newPhone = event.target.value;
    setPhone(newPhone);
  }
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  }
  function isPasswordValid(password) {
    // Minimum length of 6 characters
    if (password.length < 6) {
      return false;
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // At least one digit
    if (!/\d/.test(password)) {
      return false;
    }

    // At least one special character (e.g., !, @, #, $, etc.)
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      return false;
    }

    // If all conditions are met, the password is valid
    return true;
  }

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    if(imageChanged){
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
    const userProf = file.file_path;
    if(confirmPassword==password) {
        if(password.length>0){
            if(isPasswordValid(password)) {

    const response = axios.put(`/update-profile/${userId}`, {
            'password' : password,
            'username' : username,
            'lastName': lastName,
            'firstName': firstName,
            'email': email,
            'address': address,
            'phone': phone,
            'lang' : selectedOption.value,
            'userProfil' : userProf,
            'gender': gender,
            'birthDay': birthDay,

    })
        response.then((response)=>{
            handleAlert("success");
            setTimeout(() => {
            updateUser(response.data.user);
            if(password!="")
            axios.get('/logout').then(response => {
                console.log('User logged out successfully');
                window.location.href = '/';
                // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires
              })
              .catch(error => {
                alert('Error logging out:', error);
                // Gérer les erreurs de manière appropriée
              });
            else
                handleMainClick("Home");
              }, 1500);
        })


            // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires


        // console.log('Profile updated successfully');
        // Ajoutez ici des messages ou des actions pour informer l'utilisateur de la mise à jour réussie
      .catch(error => {
        handleAlert("danger");

        // Gérez les erreurs d'une manière appropriée ici
      });
    }
    else{
        handleAlert("warning2");
        setTimeout(() => {
            setShowWarning2Toast(false);
        },1500);
    }
    }
    else{
        const response = axios.put(`/update-profile/${userId}`, {
            'password' : password,
            'username' : username,
            'lastName': lastName,
            'firstName': firstName,
            'email': email,
            'address': address,
            'phone': phone,
            'lang' : selectedOption.value,
            'userProfil' : userProf,
            'gender': gender,
            'birthDay': birthDay,

    })
        response.then((response)=>{
            handleAlert("success");
            setTimeout(() => {
            updateUser(response.data.user);
            if(password!="")
            axios.get('/logout').then(response => {
                console.log('User logged out successfully');
                window.location.href = '/';
                // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires
              })
              .catch(error => {
                alert('Error logging out:', error);
                // Gérer les erreurs de manière appropriée
              });
            else
                handleMainClick("Home");
              }, 1500);
        })
    }
    }else{
        handleAlert("warning");
        setTimeout(() => {
            setShowWarningToast(false);
        },1500);
    }
})
.catch(error => {
    // Gérer les erreurs en cas d'échec de la requête
    console.error('Erreur lors de la récupération des données du fichier :', error);
});
}

else  {
    if(confirmPassword==password) {
        if(password.length>0){
            if(isPasswordValid(password)) {

    const response = axios.put(`/update-profile/${userId}`, {
            'password' : password,
            'username' : username,
            'lastName': lastName,
            'firstName': firstName,
            'email': email,
            'address': address,
            'phone': phone,
            'lang' : selectedOption.value,
            'userProfil' : profilURL,
            'gender': gender,
            'birthDay': birthDay,

    })
        response.then((response)=>{
            handleAlert("success");
            setTimeout(() => {
            updateUser(response.data.user);
            if(password!="")
            axios.get('/logout').then(response => {
                console.log('User logged out successfully');
                window.location.href = '/';
                // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires
              })
              .catch(error => {
                alert('Error logging out:', error);
                // Gérer les erreurs de manière appropriée
              });
            else
                handleMainClick("Home");
              }, 1500);
        })


            // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires


        // console.log('Profile updated successfully');
        // Ajoutez ici des messages ou des actions pour informer l'utilisateur de la mise à jour réussie
      .catch(error => {
        handleAlert("danger");

        // Gérez les erreurs d'une manière appropriée ici
      });
    }
    else{
        handleAlert("warning2");
        setTimeout(() => {
            setShowWarning2Toast(false);
        },1500);
    }
    }
    else{
        const response = axios.put(`/update-profile/${userId}`, {
            'password' : password,
            'username' : username,
            'lastName': lastName,
            'firstName': firstName,
            'email': email,
            'address': address,
            'phone': phone,
            'lang' : selectedOption.value,
            'userProfil' : profilURL,
            'gender': gender,
            'birthDay': birthDay,

    })
        response.then((response)=>{
            handleAlert("success");
            setTimeout(() => {
            updateUser(response.data.user);
            if(password!="")
            axios.get('/logout').then(response => {
                console.log('User logged out successfully');
                window.location.href = '/';
                // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires
              })
              .catch(error => {
                alert('Error logging out:', error);
                // Gérer les erreurs de manière appropriée
              });
            else
                handleMainClick("Home");
              }, 1500);
        })
    }
    }else{
        handleAlert("warning");
        setTimeout(() => {
            setShowWarningToast(false);
        },1500);
    }
}


  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  }
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  }

  const handleEyeClickPassword = () => {
    setEyePassword(!eyePassword);
  };
  const handleEyeClickConfirm = () => {
    setEyeConfirm(!eyeConfirm);
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setImagechanged(true);
    const imageFiles = event.target.files[0];
    setProfileImage(URL.createObjectURL(imageFiles));
    setImageFile(imageFiles);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  return (
        <>
      <div>
      {showSuccessToast && <Toast type="success" message="Profile updated successfully." />}
      {showDangerToast && <Toast type="danger" message="Error updating Profile." />}
      {showWarningToast && <Toast type="warning1" message="Password and confirm password don't match or password requirements are invalid." />}
      {showWarning2Toast && <Toast type="warning2" message="Your password must have at least 6 characters with an uppercase letter, a number and a special character." />}

      </div>

    <div className="w-full h-fit flex flex-col justify-center p-6 relative z-0">
      {/* Start of  Header Edit Profile  */}
      <div className="w-full flex justify-center items-center pt-4">
        <h2 className="text-gray-700 font-medium text-xl">{user.lang=="eng" ? "Edit Profile" :(user.lang=="fr" ? "Modifier Profile" :"تعديل الملف الشخصي")}</h2>
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
            src={isMouseOver ? change : (profileImage || `http://localhost:8000/storage/${user.userProfil}`)}
            alt="Profile"
            className={`w-28 h-28 rounded-full object-cover bg-gray-200 ${isMouseOver && "p-10"}`}
          />

          {/* File Input */}
          <input
            type="file"
            id="profileImage"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
            <Select
              options={options}
              styles={customStyles}
              value={selectedOption}
              components={{ Option: customOption }}
              isSearchable={false}
              onChange={setSelectedOption}
            />
          </div>
          {/* End of Profile Image part */}
          {/* Inputs Part */}
          <div className="mt-6 flex w-3/4 justify-between">
            <div className="w-1/2 flex flex-col ">
            {/* Username */}
            <div className="flex flex-col justify-center items-center w-72">
              <div className="flex items-center w-full">
                <label htmlFor="username" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Username" : (user.lang=="fr" ?  "Nom d'utilisateur" : "اسم المستخدم")}</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" id="username" name="username" value={username || ''} onChange={handleUserNameChange}/>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="password" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Password" : (user.lang=="fr" ?  "Mot de passe" :"كلمة المرور") }</label>
              </div>
              <div className="flex items-center w-full">
                <input type={eyePassword? "password" : "text"} id="password" name="password" value={password || ''} onChange={handlePasswordChange} class="bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-72"/>
                <span className="relative z-10 -ml-6">
                  <img src={eyePassword? cacher : oeil} className="w-4 h-4 cursor-pointer" onClick={handleEyeClickPassword}/>
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="confirmPassword" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Confirm Password" : (user.lang=="fr" ? "Confirmer le mot de passe" : "تأكيد كلمة المرور")}</label>
              </div>
              <div className="flex items-center w-full">
                <input type={eyeConfirm? "password" : "text"} id="confirmPassword" name="confirmPassword" value={confirmPassword || ''} onChange={handleConfirmPasswordChange} class={`bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-72 ${password==confirmPassword ? "" : "focus:border-b-red-200"}`}/>
                <span className="relative z-10 -ml-6">
                  <img src={eyeConfirm? cacher : oeil} className="w-4 h-4 cursor-pointer" onClick={handleEyeClickConfirm}/>
                </span>
              </div>
            </div>

            {/* Last Name */}
            <div className="flex flex-col justify-center items-center w-72 mt-5">
              <div className="flex items-center w-full">
                <label htmlFor="lastName" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Last Name" :(user.lang=="fr" ? "Nom" : "اسم العائلة")}</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" name="lastName" value={lastName || ''} onChange={handleLastNameChange} required/>
              </div>
            </div>

            {/* First Name */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="firstName" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "First Name" : (user.lang=="fr" ? "Prénom":"الاسم الخاص") }</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" name="firstName" value={firstName || ''} onChange={handleFirstNameChange} required/>
              </div>
            </div>

            </div>
            <div className="w-1/2 flex flex-col">
            {/* Gender */}
            <div className="flex flex-col justify-center items-center w-72">
              <div className="w-full flex justify-start items-center">
              <span className="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Gender" : (user.lang=="fr" ? "Sexe":"الجنس") }</span>
              </div>
              <div className="flex justify-start items-center w-full space-x-5">
                <div class="flex items-center">
                <input
        id="male-gender"
        type="radio"
        value="male"
        name="gender"
        checked={gender === 'male'}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
        onChange={(e) => handleGenderChange(e.target.value)}
      />                    <label htmlFor="default-radio-1" class="ml-2 text-sm  text-black dark:text-gray-300">Male</label>
                </div>
                <div class="flex items-center">
                <input
        id="female-gender"
        type="radio"
        value="female"
        name="gender"
        checked={gender === 'female'}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
        onChange={(e) => handleGenderChange(e.target.value)}
      />                    <label htmlFor="default-radio-2" class="ml-2 text-sm  text-black dark:text-gray-300">Female</label>
                </div>
              </div>
            </div>

            {/* Birthday */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="birthDay" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="eng" ? "Birthday" : (user.lang=="fr" ? "Date de naissance":"تاريخ الميلاد") }</label>
              </div>
              <div className="flex items-center w-full">
              <Input type="date" name="birthDay" value={birthDay || ''} onChange={handleBirthdayChange} require/>              </div>
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

            {/*Email  */}
            <div className="flex flex-col justify-center items-center mt-5 w-72">
              <div className="flex items-center w-full">
                <label htmlFor="email" class="block mb-1 font-semibold text-sm text-gray-700">{user.lang=="عربي" ? "البريد الإلكتروني" : "Email"}</label>
              </div>
              <div className="flex items-center w-full">
                <Input type="text" name="email" value={email || ''} onChange={handleEmailChange} required/>
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

export default Profile;






