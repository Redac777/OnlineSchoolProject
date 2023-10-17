import React,{useState,useEffect} from "react";
import english from "../../../../../public/images/english.png";
import france from "../../../../../public/images/france.png";
import arabe from "../../../../../public/images/saudiArabia.png";
import Button from "../reusable/button";
import Select from "react-select";
import axios from "axios";


  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "150px",
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
      marginTop: "-0.5rem",
      width: "150px",
      marginLeft: "0.65rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  // Header Component
  const Header = ({user,onHeaderClick,mailCount,onYearChange,selectedYearDef}) => {
    const [isProfileImageClicked,setIsProfileImageClicked] = useState(false);
    const [unreadMailCount, setUnreadMailCount] = useState(-1);
    const [yearOptions,setYearOptions] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [userMails,setUserMails] = useState([]);
    const [unread,setUnread] = useState(false);
    const [updatedYear,setUpdatedYear] = useState(false);

    useEffect(()=>{
        axios.get("/list-years").then((response) => {

            const years = response.data.map((year) => ({
              value: year.id,
              label: year.name,
            }));
            setYearOptions(years);
            const selectedYearOption = years.find((year) => year.value === selectedYearDef);
            setSelectedYear(selectedYearOption || years[0]);
          });
    },[updatedYear]);

    useEffect(() => {
        async function fetchMailCount() {
                    axios.get(`/mails?selectedYear=${selectedYearDef}&unread=true`)
                    .then(response => {
                        console.log(response.data.length);
                        setUnreadMailCount(response.data.length);
                      })
                      .catch(error => {
                        console.error(error);
                      });
        }
        fetchMailCount();
    },[user,mailCount,selectedYearDef]);




    // svg for messages button
    const messagesButtonSvg = (
        <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
        </svg>

      );


      const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        onYearChange(selectedOption.value);
         // Send the selected year value to the parent component
      };


      const updateYear = () => {
        const response = axios.post(`/update-year?date=${"2025-07-07"}`)
        .then((response) => {
          // Gérez la réponse de la requête ici, par exemple, affichez un message de succès
          console.log(response.message);
          setUpdatedYear(!updatedYear);
        })
        .catch((error) => {
          // Gérez les erreurs ici
          console.error(error);
        });
      }
    // Logout
    const handleLogOut = () => {
        axios.get('/logout').then(response => {
            console.log('User logged out successfully');
            window.location.href = '/';
            // Rediriger l'utilisateur vers la page de connexion ou faire d'autres actions nécessaires
          })
          .catch(error => {
            console.error('Error logging out:', error);
            // Gérer les erreurs de manière appropriée
          });
    }

    //profile Image Click
    const handleProfileImageClick = () => {
        setIsProfileImageClicked(!isProfileImageClicked);
    }

    return (
        <div className={`print:hidden flex items-center ${user.lang=="عربي" ? "justify-start" : "justify-end"} gap-4 w-full h-fit py-4 bg-gray-100 shadow-sm shadow-gray-100`}>
            {user.lang!="عربي" ? (
                <>
            {/* language flag */}
            <img src={user.lang=="fr" ? france : (user.lang=="eng" ? english : arabe) } className="w-8"/>
            {/* select year */}
            <Select options={yearOptions} styles={customStyles} value={selectedYear} components={{ Option: customOption }} isSearchable={false} onChange={handleYearChange}/>
            {/* Messages button */}
            {user.user_type === "admin-platform" && (
                <Button type={`button`} buttonText={"UpdateYear"} onClick={updateYear}/>
            )
            }
            <Button type={`button`} svgContent={<>{messagesButtonSvg}</>} buttonText={"Messages"} onClick={()=>{
                setIsProfileImageClicked(false);
                onHeaderClick("ListMails",true)}} />

            <div class="absolute inline-flex items-center justify-center top-5 right-32 w-6 h-6 text-xs font-bold text-white bg-footerColor border-2 border-white rounded-full dark:border-gray-900">{unreadMailCount}</div>
            {/* Profile image */}
            <img src={user.userProfil ? `http://localhost:8000/storage/${user.userProfil}` : null} className={`rounded-full w-12 h-12 p-1 mx-10 cursor-pointer ${isProfileImageClicked ? "bg-white" : "bg-gray-300"}`} onClick={handleProfileImageClick}/>
            {/* If profile image is clicked on */}
            <div className={`absolute z-10 flex flex-col bg-white rounded-md shadow-md float-right top-24 right-3`} style={{ opacity: isProfileImageClicked ? 1 : 0,pointerEvents: isProfileImageClicked ? "auto" : "none"}}>
                <div className={`flex flex-col border-b border-dashed py-2 ${isProfileImageClicked ? "cursor-text" : "cursor-default"} `}>
                    <div className="flex flex-col items-start justify-center">
                        <span className="text-sideBarITemsColor font-roboto text-sm leading-3 py-2 px-4">{user.code}</span>
                        <span className="text-sideBarITemsColor font-roboto text-sm leading-3 py-2 px-4">{"@"+user.username}</span>
                    </div>
                </div>
                <ul className={`py-1 mx-2 ${isProfileImageClicked ? "cursor-pointer" : "cursor-default"}`}>
                    <li className="px-2 py-1 rounded-md hover:bg-gray-100">
                        <a className="p-2 text-sm" onClick={()=>{
                            setIsProfileImageClicked(false);
                            onHeaderClick("Profile")}}>
                            {(user.lang=="eng" || user.lang=="fr") ? "Profile" : "الملف الشخصي"}
                        </a>
                    </li>
                    {user.user_type=="admin-ecole" && (
                        <li className="px-2 py-1 rounded-md hover:bg-gray-100">
                            <a className="p-2 text-sm" onClick={()=>{
                                setIsProfileImageClicked(false);
                                onHeaderClick("SchoolProfile")}}>
                                {user.lang === "eng" ? "School" : (user.lang == "fr" ? "Ecole" : "مؤسسة")}
                            </a>
                        </li>
                    )}
                    <li className="px-2 py-1 rounded-md hover:bg-gray-100">
                        <a className="p-2 text-sm text-slate-800" onClick={handleLogOut}>
                            {user.lang === "eng" ? "Logout" : (user.lang == "fr" ? "Déconnection" : "تسجيل خروج")}
                        </a>
                    </li>
                </ul>
            </div>
                </>
            ) : (
                   <>
                        {/* Profile image */}
                        <img src={user.userProfil ? `http://localhost:8000/storage/${user.userProfil}` : null} className={`rounded-full w-11 p-1 mx-10 cursor-pointer ${isProfileImageClicked ? "bg-white" : "bg-gray-300"}`} onClick={handleProfileImageClick}/>
                        {/* If profile image is clicked on */}
                        <div className={`absolute z-10 flex flex-col bg-white rounded-md shadow-md float-left top-24 left-3`} style={{ opacity: isProfileImageClicked ? 1 : 0,pointerEvents: isProfileImageClicked ? "auto" : "none"}}>
                            <div className={`flex flex-col border-b border-dashed py-2 ${isProfileImageClicked ? "cursor-text" : "cursor-default"} `}>
                                <div className="flex flex-col items-start justify-center">
                                    <span className="text-sideBarITemsColor font-roboto text-sm leading-3 py-2 px-4">{user.code}</span>
                                    <span className="text-sideBarITemsColor font-roboto text-sm leading-3 py-2 px-4">{"@"+user.username}</span>
                                </div>
                            </div>
                            <ul className={`py-1 mx-2 ${isProfileImageClicked ? "cursor-pointer" : "cursor-default"}`}>
                                <li className="px-2 py-1 rounded-md hover:bg-gray-100">
                                    <a className="p-2 text-sm" onClick={()=>{
                                        setIsProfileImageClicked(false);
                                        onHeaderClick("Profile")}}>
                                        {(user.lang=="eng" || user.lang=="fr") ? "Profile" : "الملف الشخصي"}
                                    </a>
                                </li>
                                <li className="px-2 py-1 rounded-md hover:bg-gray-100">
                                    <a className="p-2 text-sm text-slate-800" onClick={handleLogOut}>
                                        {user.lang === "eng" ? "Logout" : (user.lang == "fr" ? "Déconnection" : "تسجيل خروج")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Messages button */}
                        <Button type={`button`} svgContent={<>{messagesButtonSvg}</>} buttonText={"Messages"} onClick={()=>{
                            setIsProfileImageClicked(false);
                            onHeaderClick("ListMails")}} />
                        <div class="absolute inline-flex items-center justify-center top-5 right-32 w-6 h-6 text-xs font-bold text-white bg-footerColor border-2 border-white rounded-full dark:border-gray-900">{unreadMailCount}</div>
                        {/* select year */}
                        <Select options={yearOptions} styles={customStyles} value={selectedYear} components={{ Option: customOption }} isSearchable={false} onChange={handleYearChange}/>
                        {/* language flag */}
                        <img src={user.lang=="fr" ? france : (user.lang=="eng" ? english : arabe) } className="w-8"/>
                   </>
            )}

        </div>
    )
  };

  export default Header;
