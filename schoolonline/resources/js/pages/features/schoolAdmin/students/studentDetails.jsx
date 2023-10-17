import React from "react";
import { useState } from "react";
import Button from "../../../components/reusable/button";

const StudentDetails = ({student,handleMainClick}) => {
    const buttonSvg = (
        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  className="w-4 h-4 mr-2"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M15 19l-7-7 7-7"
  />
</svg>
    )

    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
      setIsPrinting(true); // Show the printable card
      window.print(); // Open the browser's print dialog
      setIsPrinting(false); // Hide the printable card after printing (optional)
    };
    return (
        <div className="w-full flex flex-col items-center print:-ml-28">
            <div className="w-full flex justify-center items-center">
                <div className="w-1/2 flex justify-end ml-40 print:justify-center print:ml-0">
                    <img src={`http://localhost:8000/images/${student.user.userProfil}`} className="w-16 h-16 rounded-full object-cover bg-slate-800"/>
                </div>
                <div className="print:hidden w-1/2 flex justify-end mx-20">
                    <Button type="button" buttonText="Print" onClick={handlePrint}/>
                </div>
            </div>

            <div className="w-full flex justify-center gap-8 text-sm">
                <div className="w-[40%] flex flex-col gap-6 mx-6">
                    <div className="w-full flex justify-center">
                        <h2 className="text-gray-700 font-medium text-lg">Student</h2>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Lastname :</span> <span className="font-medium">{student.user.lastName}</span>
                        </div>
                        <div>
                            <span className="text-slate-800">Firstname :</span> <span className="font-medium">{student.user.firstName}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                        <span className="text-slate-800">Arab lastname :</span><span className="font-medium"> {student.arabLastName}</span>
                        </div>
                        <div>
                        <span className="text-slate-800">Arab firstname :</span> <span className="font-medium">{student.arabFirstName}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Code Massar :</span> <span className="font-medium">{student.user.code}</span>
                        </div>
                        <div>
                            <span className="text-slate-800">Birthday :</span><span className="font-medium"> {student.user.birthDay}</span>
                        </div>

                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Password :</span> <span className="font-medium">{student.user.code}</span>
                        </div>
                        <div>
                            <span className="text-slate-800 ">Gender :</span><span className="font-medium"> {student.user.gender}</span>
                        </div>
                    </div>
                </div>

                <div className="w-[40%] flex flex-col gap-6 mx-6">
                    <div className="w-full flex justify-center">
                        <h2 className="text-gray-700 font-medium text-lg">Tutor 1</h2>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Lastname :</span><span className="font-medium"> {student.parents[0].user.lastName}</span>
                        </div>
                        <div>
                            <span className="text-slate-800">Firtsname :</span><span className="font-medium"> {student.parents[0].user.firstName}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Email :</span><span className="font-medium"> {student.parents[0].user.email}</span>
                        </div>
                        <div>
                            <span className="text-slate-800">Phone :</span><span className="font-medium"> {student.parents[0].user.phone}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <div>
                            <span className="text-slate-800">Cin :</span><span className="font-medium"> {student.parents[0].cin}</span>
                        </div>
                        <div>
                            <span className="text-slate-800">Job :</span><span className="font-medium"> {student.parents[0].job}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[40%] flex flex-col gap-6 text-sm mt-8">
                     <div className="w-full flex justify-center">
                        <h2 className="text-gray-700 font-medium text-lg">Tutor 2</h2>
                    </div>
                <div className="w-full flex justify-between">
                    <div>
                        <span className="text-slate-800">Lastname :</span><span className="font-medium"> {student.parents[1]?.user.lastName || ''}</span>
                    </div>
                    <div>
                        <span className="text-slate-800">Firstname :</span><span className="font-medium"> {student.parents[1]?.user.firstName || ''}</span>
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div>
                        <span className="text-slate-800">Email:</span><span className="font-medium"> {student.parents[1]?.user.email || ''}</span>
                    </div>
                    <div>
                        <span className="text-slate-800">Phone :</span><span className="font-medium"> {student.parents[1]?.user.phone || ''}</span>
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div>
                        <span className="text-slate-800">Cin :</span><span className="font-medium"> {student.parents[1]?.cin || ''}</span>
                    </div>
                    <div>
                        <span className="text-slate-800">Job :</span><span className="font-medium"> {student.parents[1]?.job ||''}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default StudentDetails;
