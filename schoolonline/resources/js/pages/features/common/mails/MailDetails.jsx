import React from 'react';
import Button from '../../../components/reusable/button';

const MailDetails = ({user,mail,mailUser,handleMainClick,receptionFromListMails}) => {
    const createdDate = new Date(mail.created_at);
    const date = createdDate.toLocaleDateString();
    const time = createdDate.toLocaleTimeString();
  return (

    <div className="w-full flex justify-center mx-auto -mt-16 bg-gray-100" style={{height : '88vh'}}>
        {/* MailSideBar */}
        <div className="w-1/4 flex flex-col bg-gray-100 pt-6">
            <div className="w-full flex justify-center">
                <Button buttonText={user.lang=="eng" ? "New mail" : (user.lang=="fr" ? "Nouveau message" : "رسالة جديدة")} variableClassName="w-2/3 py-3 flex items-center justify-start"/>
            </div>
            <ul className="flex flex-col items-start w-full mx-12 mt-6">
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} w-48 gap-4  cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${receptionFromListMails ? "bg-slate-300" : ""} `} onClick={()=>{handleMainClick("ListMails",true)}}>
                    <a className={`text-sm text-slate-800 ${receptionFromListMails ? "font-medium" : ""}`} >
                        {user.lang=="eng" ? "Reception box" : (user.lang=="fr" ? "Boite de reception" : "صندوق الاستقبال")}
                    </a>
                </li>
                <li className={`flex items-center ${user.lang=="عربي" ? "justify-end" : "justify-start"} w-48 gap-4 cursor-pointer py-3 px-4 rounded-lg hover:bg-slate-300 ${!receptionFromListMails ? "bg-slate-300" : ""}`} onClick={()=>{handleMainClick("ListMails",false)}}>
                    <a className={`text-sm text-slate-800 ${!receptionFromListMails ? "font-medium" : ""}`}>
                        {user.lang=="eng" ? "Mails sent" : (user.lang=="fr" ? "Messages envoyés" : "رسالة مرسلة")}
                    </a>
                </li>
            </ul>
        </div>
        {/* MailBox */}
        <div className="w-3/4 flex justify-center">
            <div className="flex flex-col w-4/5 p-6 bg-main-bg border-gray-100 rounded-xl" style={{height:"80vh"}}>
                    <div className="mx-14 mt-14">
                        <h2 className="text-lg">{mail.subject}</h2>
                    </div>
                    <div className="mt-6 flex items-center justify-between w-full">
                        <div className="flex items-center">
                        {!receptionFromListMails && (
                        <span className="font-semibold text-sm mr-4 mx-14">To </span>
                        )}
                        <img className='w-10 bg-slate-700 rounded-full mr-4' src={`http://localhost:8000/storage/${mailUser.userProfil}`}/>
                        <span className="font-semibold text-sm mr-1">{mailUser.lastName} {mailUser.firstName} </span>
                        <span className='text-xsm text-gray-600'>{"<"+mailUser.email+">"}</span>
                        </div>
                        <div>
                        <span className='text-xsm text-gray-600'>{date + " " + time}</span>
                        </div>
                    </div>
                    <p className='mt-6 mx-14 text-sm'>{mail.content}</p>
                    <div className='w-full mt-6 mx-6'>
                    {receptionFromListMails && (
                    <button type="submit" className="text-white bg-slate-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center m-8" onClick={()=>{handleMainClick("NewMail",mailUser)}}>Respond</button>
                    )}
                    </div>
            </div>
        </div>
    </div>
  );
};

export default MailDetails;
