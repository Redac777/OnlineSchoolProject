import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Toast from "../../../components/reusable/toast";

const NewFinancePost = ({ user, year, schoolToEdit, handleMainClick }) => {
  // ...
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      margin: "10px",
      width: "160px",
      padding : "1px 0",
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
      width :"160px",
      marginLeft: "0.7rem",
      marginTop : "0rem",
    }),
  };

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center cursor-pointer">
      {label}
    </div>
  );

  useEffect(() => {
    if (showSuccessToast || showDangerToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast]);

  const handleAlert = (type) => {
    if (type === "success") setShowSuccessToast(true);
    else setShowDangerToast(true);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let recipientHandleValue  = (JSON.stringify(["finance"]));
    if (file) {
        formData.append('image', file);
      }
        let response;
        let fileToSend = null;
        if (file) {
          // Only send the request if a file has been selected
          response = await axios.post("/upload-image", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        if (response)
            fileToSend = response.data.file;
        else
            fileToSend = null;
        const postData = {
            post_title : postTitle,
            post_content : postContent,
            file_id : fileToSend ? fileToSend.id : null,
            user_id : user.id,
            recipient: recipientHandleValue,
            school_id : schoolToEdit.id,
          };
    try {
      const response = axios.post("/api/posts", postData);
      console.log("Nouveau message créé :", response.data);
      // Réinitialisez les champs après la publication
      setPostTitle("");
      setPostContent("");
      setFile(null);
      handleAlert("success");
      setTimeout(() => {
      handleMainClick("ListFinancePosts");
    }, 1500);

    } catch (error) {
        handleAlert("danger");
      console.error("Erreur lors de la création du message :", error);
    }

  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center rounded-xl">
      <div>
        {showSuccessToast && <Toast type="success" message="Post published successfully." />}
        {showDangerToast && <Toast type="danger" message="Error publishing post" />}
      </div>
      <div className="w-3/4 flex justify-start bg-slate-700 py-2">
        <span className="text-white mx-8">New Post</span>
      </div>
      <form onSubmit={handlePostSubmit} className="w-3/4 flex flex-col bg-white">
        <div className="flex items-center h-20 pt-8">
        <img className='w-10 bg-slate-700 rounded-full mr-4 mx-7' src={`http://localhost:8000/storage/${user.userProfil}`}/>
          <input
            type="text"
            value={postTitle}
            placeholder="Title"
            className="outline-none text-sm w-40"
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        <div className="mt-10 px-7 h-40">
          <textarea
            placeholder="Write Here !"
            value={postContent}
            className="w-full outline-none"
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
            <div className="flex items-center justify-center w-40">
            {/* Champ pour télécharger un fichier */}
                <div className="flex items-center">
                    <label htmlFor="fileInput" className="relative cursor-pointer bg-white rounded">
                        <div className="flex items-center">
                            <div className=" flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="#334155">
                                    <path d="M14 12h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H8c-.55 0-1-.45-1-1s.45-1 1-1h2V8c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                                </svg>
                            </div>
                        </div>
                    </label>
                        <input
                        type="file"
                        id="fileInput"
                        accept="image/png, image/jpeg, image/jpg, application/pdf, application/msword, application/vnd.ms-excel"
                        onChange={handleFileChange}
                        className="hidden"
                        />
                        <div className="flex items-center">
                            {file ? (
                                <span className="text-slate-700">{file.name}</span>
                            ) : (
                                <span className="text-slate-700">Attach file</span>
                            )}
                        </div>
                </div>
            </div>
            <div className="mr-6">
                <button type="submit" className="text-slate-700 font-medium">Publish</button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default NewFinancePost;
