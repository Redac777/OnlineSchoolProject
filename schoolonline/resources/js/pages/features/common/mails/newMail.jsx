import { useState,useEffect } from "react";
import axios from 'axios';
import Toast from '../../../components/reusable/toast';
export default function NewMail({user, recipient,handleMainClick,year}) {
  const [content, setContent] = useState("");
  const [email, setEmail] = useState(recipient?.email || "");
  const [subject,setSubject] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  const initialMessage = `Good day ${
    (recipient?.gender === "male" || !recipient) ? "Mr." : "Mrs."
  } ${ (recipient) ? (recipient?.lastName + " " + recipient?.firstName)+"," : ""}\n`;

  const endingMessage = "\nThank you,\n"+user.user_type!="admin-platform" ? user.school.name : user.user_type;

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



  const handleSubmitMail = async (e) => {
    e.preventDefault();
    if(!recipient){
        if(email){
            try {
                const userResponse = await axios.get(`/getUserByCode/${email}`);
                if (userResponse.status === 200) {
                  const userId = userResponse.data.id;
                  const response = await axios.post("/createMailing", {
                    recipient_id: userId,
                    content: content,
                    subject: subject,
                    year_id: year,
                  });

                  if (response.status === 201) {
                    // Handle success, e.g., show a success message
                    handleAlert("success");
                    setTimeout(() => {
                      handleMainClick("ListMails",false);
                    }, 1500);
                  }
                }
              } catch (error) {
                // Handle error, e.g., show an error message
                handleAlert("danger");
                console.error("Error sending mailing:", error);
              }
        }
    }
    //console.log([recipient.id,content,subject]);
    else{
        try {
            const response = await axios.post("/createMailing", {
              recipient_id : recipient.id, // Change this to the appropriate recipient ID field
              content : content,
              subject : subject,
              year_id:year,
            });

            if (response.status === 201) {
              // Handle success, e.g., show a success message
              handleAlert("success");
                      setTimeout(() => {
              handleMainClick("ListMails",false);
          }, 1500);

            }
          } catch (error) {
            // Handle error, e.g., show an error message
            handleAlert("danger");
            setTimeout(() => {
            console.error("Error sending mailing:", error);
          }, 1500);
          }
    }

  };

  return (
    <div className="w-full flex justify-center">
        <div>
                {showSuccessToast && <Toast type="success" message="Mail sent successfully." />}
                {showDangerToast &&  <Toast type="danger" message="Error sending mail." />}
                {showWarningToast && <Toast type="warning" message="Password and confirm password don't match." />}
            </div>
        <div className="w-5/6 flex flex-col justify-center items-center rounded-xl">
            <div className="w-full flex justify-start bg-slate-700 py-2">
                <span className="text-white mx-8">New Message</span>
            </div>
            <form className="w-full flex flex-col bg-white pt-8" onSubmit={handleSubmitMail}>
                <div className="w-full flex justify-start mb-2">
                    <input type="text" placeholder={`To ${email}`} id="recipientEmail" name="recipientEmail" className="bg-main-bg border  text-slate-900 focus:outline-none rounded-full text-sm w-full py-1.5 mx-4 px-4" value={email} onChange={(e)=>{setEmail(e.target.value)}} readOnly={!!recipient} />
                </div>
                <div className="w-full flex justify-start mb-2">
                    <input type="text" placeholder="Subject" id="subject" name="subject" value={subject} onChange={(e)=>setSubject(e.target.value)} className="bg-main-bg border  text-slate-900 focus:outline-none rounded-full text-sm w-full py-1.5 mx-4 px-4"/>
                </div>
                <div className="w-full flex justify-start mb-3 pt-2 h-40">
                    <textarea
                    className="w-full mx-8 focus:outline-none text-slate-900 text-sm"
                    defaultValue={initialMessage}
                    onChange={(e) => setContent(e.target.value + "\n" + endingMessage)}
                    placeholder="Message"
                    />
                </div>
                <div className="w-full flex items-center justify-between">
                    <button type="button" className="text-white bg-slate-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center m-8" onClick={()=>{
                      handleMainClick("ListMails",false);
                      }}>Cancel</button>
                    <button type="submit" className="text-white bg-slate-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center m-8">Send</button>
                </div>
            </form>
        </div>
    </div>
  );
}
