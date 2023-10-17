import React, { useState, useEffect } from 'react';
import Button from "../../../components/reusable/button";
import axios from 'axios';

const ListMails = ({user,handleMainClick,updateLuState,receptionValue,year}) => {
  const [mails, setMails] = useState([]);
  const [senderMails,setSenderMails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reception ,setReception] = useState(true);
  const plusButtonSvg = (
    <svg
      className="w-4 h-4 mr-2"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
  useEffect(()=> {
    setReception(receptionValue);
  },[receptionValue]);
  useEffect(() => {
    axios.get(`/mails?selectedYear=${year}`) // Remplacez par le chemin approprié vers votre route
      .then(response => {
        setMails(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [year]);
  useEffect(() => {
    axios.get(`/mailsSender?selectedYear=${year}`) // Remplacez par le chemin approprié vers votre route
      .then(response => {
        setSenderMails(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [year]);

  const handleClickReceived = async (mail,mailSender,reception) => {
    // Only update the value if the mail is not already read
    if (!mail.read) {
      // Send a request to update the 'read' value in the database
      try {
        await axios.put(`/messages/${mail.id}/mark-as-read`);

        // Update the 'read' value in local state
        const updatedMails = mails.map(existingMail =>
          existingMail.id === mail.id ? { ...existingMail, read: true } : existingMail
        );

        // Update the local state with the new 'read' value
        setMails(updatedMails);

        // Update the unread mail count and pass it to the parent component
        const unreadMailCount = updatedMails.filter(updatedMail => !updatedMail.read).length;
        updateLuState(unreadMailCount);

        // Notify the parent component about the clicked mail

      } catch (error) {
        console.error("Error updating mail in database:", error);
      }
    }
    handleMainClick("MailDetails",mail,mailSender,reception);
  };
  const handleClickSent = (mail,mailRecipient,reception) => {
    handleMainClick("MailDetails",mail,mailRecipient,reception);
  }


//received messages
    const listMails = mails.filter((mail) => mail.subject.toLowerCase().includes(searchQuery.toLowerCase())).map((mail,index) => {
    const createdDate = new Date(mail.created_at);
    const date = createdDate.toLocaleDateString(); // Date in format MM/DD/YYYY
    const time = createdDate.toLocaleTimeString();
    return (
    <li key={mail.id} className={`flex justify-between py-2.5 ${index===0 && "border-t border-slate-200"} border-b border-slate-200 px-6 ${mail.read ? "bg-slate-100" : "bg-white"}  hover:bg-gray-200 cursor-pointer`} onClick={()=>{handleClickReceived(mail,mail.sender,reception);}}>
      <div>
      <span className="font-semibold text-sm text-slate-800">{mail.sender.lastName + " "+mail.sender.firstName}</span>
      </div>
      <div>
      <span className="font-semibold text-sm text-slate-800">{mail.subject}</span>
      </div>
      <div>
      <span className="font-semibold text-sm text-slate-800">{date + " " +time}</span>
      </div>
    </li>
    )
});


//sent Messages
    const listMailsSent = senderMails.filter((mail) => {
        const recipientFullName = `${mail.recipient.lastName} ${mail.recipient.firstName}`;
        return recipientFullName.toLowerCase().includes(searchQuery.toLowerCase())}).map((mail,index) => {
    const createdDate = new Date(mail.created_at);
    const date = createdDate.toLocaleDateString(); // Date in format MM/DD/YYYY
    const time = createdDate.toLocaleTimeString();
    return (
    <li key={mail.id} className={`flex justify-between py-2.5 ${index===0 && "border-t border-slate-200"} border-b border-slate-200 px-6 bg-slate-100  hover:bg-gray-200 cursor-pointer`} onClick={()=>{handleClickSent(mail,mail.recipient,reception);}}>
      <div>
      <span className="font-semibold text-sm text-slate-800">{" To :  "+mail.recipient.lastName + " "+mail.recipient.firstName}</span>
      </div>
      <div>
      <span className="font-semibold text-sm text-slate-800">{mail.subject}</span>
      </div>
      <div>
      <span className="font-semibold text-sm text-slate-800">{date + " " +time}</span>
      </div>
    </li>
    )
});



  return (
    <div className="w-full flex justify-center mx-auto -mt-16 bg-gray-100" style={{height : '88vh'}}>
        <div className="w-1/4 flex flex-col bg-gray-100 mr-16 pt-6">
         <div className="w-full flex justify-center">
            <Button svgContent={plusButtonSvg} buttonText={user.lang=="eng" ? "New mail" : (user.lang=="fr" ? "Nouveau message" : "رسالة جديدة")} variableClassName="w-2/3 py-3 flex items-center justify-start" onClick={()=>{handleMainClick("NewMail")}}/>
        </div>
        <ul className="flex flex-col items-start w-full mx-12 mt-6">
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} w-48 gap-4  cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${reception ? "bg-slate-300" : ""}`} onClick={()=>{handleMainClick("ListMails",true)}}>
                    <a className={`text-sm text-slate-800 ${reception ? "font-medium" : ""}`} >
                        {user.lang=="eng" ? "Reception box" : (user.lang=="fr" ? "Boite de reception" : "صندوق الاستقبال")}
                    </a>
                </li>
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} w-48 gap-4 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${!reception ? "bg-slate-300" : ""}`} onClick={()=>{handleMainClick("ListMails",false)}}>
                    <a className={`text-sm ${!reception ? "font-medium" : ""}`}>
                        {user.lang=="eng" ? "Mails sent" : (user.lang=="fr" ? "Messages envoyés" : "رسالة مرسلة")}
                    </a>
                </li>
        </ul>
        </div>
       <div className="w-3/4 flex justify-center">
            <div className="flex flex-col w-4/5 p-6 border border-gray-100 bg-main-bg rounded-xl mt-4" style={{height:"80vh"}}>
                    <div className="w-full flex justify-center  items-center">
                        <h2 className="text-gray-700 font-medium text-xl">{user.lang=="eng" ? "Message Box" : (user.lang=="fr" ? "Boite de messagerie" : "صندوق الرسائل")}</h2>
                    </div>
                <div className="w-full flex mt-6">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>

                        <input type="search" id="default-search" class="block w-72 py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}/>

                    </div>
                </div>
                <ul className="mt-10 flex flex-col w-full">
                    {reception ? listMails : listMailsSent}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default ListMails;
