import Button from "../../../components/reusable/button";
import { useState } from "react";
export default function SchoolAdmin({schoolAdmin,handleMainClick}) {
    const [isPrinting, setIsPrinting] = useState(false);
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
    if(!schoolAdmin)
    return null;
    console.log(schoolAdmin);

    const handlePrint = () => {
        setIsPrinting(true); // Show the printable card
        window.print(); // Open the browser's print dialog
        setIsPrinting(false); // Hide the printable card after printing (optional)
      };
    return (

        <div className="flex flex-col">
            <div className="print:hidden w-full flex justify-end -ml-40">
                <Button type="button" buttonText="Print" onClick={handlePrint}/>
            </div>
            <div className="w-full print:-ml-28 flex justify-center mt-10">
                <div className="w-3/5 rounded-lg bg-main-bg shadow-sm shadow-slate-500 flex flex-col justify-center items-center px-5 py-6">
                    <div className="shadow-md rounded-full bg-main-bg mt-6">
                        <img src={`http://localhost:8000/images/${schoolAdmin.userProfil}`} className="w-20 h-20 rounded-full object-cover bg-slate-800"/>
                    </div>
                    <div className="w-full flex justify-between items-center pt-8 text-sm">
                        <div className="flex flex-col items-center w-1/2">
                            <p className="py-3 text-slate-800"><span>Code : </span> <span className="font-medium">{schoolAdmin.code}</span></p>
                            <p className="py-3 text-slate-800"><span>Password : </span> <span className="font-medium">{schoolAdmin.code}</span></p>
                            <p className="py-3 text-slate-800"><span>Last Name : </span > <span className="font-medium">{schoolAdmin.lastName}</span></p>
                            <p className="py-3 text-slate-800"><span>First Name : </span><span className="font-medium">{schoolAdmin.firstName}</span></p>
                        </div>
                        <div className="flex flex-col items-center w-1/2">
                            <p className="py-3 text-slate-800"><span>Account : </span><span className="font-medium">{schoolAdmin.account}</span> </p>
                            <p className="py-3 text-slate-800"><span>Email : </span> <span className="font-medium">{schoolAdmin.email}</span></p>
                            <p className="py-3 text-slate-800"><span>Phone : </span> <span className="font-medium">{schoolAdmin.phone}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="print:hidden flex justify-center items-center my-14">
                <Button type="button" svgContent={buttonSvg} buttonText="Back" onClick={()=>{
                    if(schoolAdmin.user_type=="admin-ecole")
                    handleMainClick("ListSchools")
                    else if(schoolAdmin.user_type=="admin-department")
                    handleMainClick("ListDepartments")
                }}
                    />
            </div>
        </div>

    )
}
