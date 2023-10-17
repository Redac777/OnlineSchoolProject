
import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
function ListStudentAbsences({user,schoolToEdit,year}) {

const [studentAbsences , setstudentAbsences] = useState([]);
const [student ,setStudent] = useState(null);


useEffect(()=>{
    axios.get(`/studentAbsenceDetails?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
        setstudentAbsences(response.data.absenceReports);
      });
      axios.get(`/getAuthenticatedStudent`).then((response) => {
        setStudent(response.data.student);});
},[schoolToEdit,year]);
let studentDetails = [];
if(studentAbsences && student){
    studentAbsences.map(absence => {
        absence.details.map(detail => {
            if(detail.student_id == student.id)
            studentDetails.push(detail);
        })
    })
}

if(studentDetails)
  return (
    <div className="w-full flex flex-col justify-center items-center">

        <div className="w-full flex justify-center items-center">
            <h2 className="text-gray-700 font-medium text-xl">Absences</h2>
        </div>
      {/* Render the report details in a table */}
      <table className="w-5/6 text-sm text-left text-gray-500 shadow-md mt-12">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr >
            <th scope="col" className="px-6 py-3">Retard</th>
            <th scope="col" className="px-6 py-3">Absence</th>
            <th scope="col" className="px-6 py-3">Remark</th>
            <th scope="col" className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {studentDetails.map((detail) =>{
            const createdDate = new Date(detail.created_at);
            const date = createdDate.toLocaleDateString();
            const time = createdDate.toLocaleTimeString();
            return (
                <tr  className="bg-white border-b">
                  <td scope="col" className="px-6 py-3">{detail.attendance=="retard" ? 'Yes' : 'No'}</td>
                  <td scope="col" className="px-6 py-3">{detail.attendance=="absence" ? 'Yes' : 'No'}</td>
                  <td scope="col" className="px-6 py-3">{detail.remark}</td>
                  <td scope="col" className="px-6 py-3">{date + " " + time}</td>
                </tr>
              )
          } )}
        </tbody>
      </table>

    </div>
  );
  else return null;
}

export default ListStudentAbsences;
