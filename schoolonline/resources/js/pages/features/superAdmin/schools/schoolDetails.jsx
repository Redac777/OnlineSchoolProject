import React from "react";
import Button from "../../../components/reusable/button";
export default function SchoolDetails({ school ,handleMainClick}) {
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

  return (
    <div className="w-full flex flex-col justify-center items-center">
        <div className="rounded-full"><img src={`http://localhost:8000/images/${school.logo}`} className="w-36 rounded-full p-5 bg-main-bg shadow-md"/></div>
        <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-14">
        <thead class="text-xs bg-slate-300 text-slate-800 uppercase ">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Manager
                </th>
                <th scope="col" class="px-6 py-3">
                    City
                </th>
                <th scope="col" class="px-6 py-3">
                    Address
                </th>
                <th scope="col" class="px-6 py-3 w-1/6">
                    Phone
                </th>
            </tr>
        </thead>
        <tbody>
                <tr>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {school.name}
                </td>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {school.manager}
                </td>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {school.city}
                </td>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {school.address}
                </td>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {school.phone}
                </td>
                </tr>
        </tbody>
    </table>
<div className="flex justify-center items-center my-14">
<Button type="button" svgContent={buttonSvg} buttonText="Back" onClick={()=>{handleMainClick("ListSchools")}}/>
</div>
    </div>
  );
}
