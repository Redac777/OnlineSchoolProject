import React, { useState, useEffect } from "react";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import axios from "axios";

export default function TeacherClasses({ teacher, handleMainClick }) {
  const [availableClasses, setAvailableClasses] = useState([]);
const [attachedClasses, setAttachedClasses] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  useEffect(() => {
    // Fetch available classes not associated with the teacher
    axios.get(`/teacher/${teacher.id}/classes-not-associated`).then((response) => {
      setAvailableClasses(response.data.availableClasses);
    });
    setAttachedClasses(teacher.classes);
  }, [teacher]);

  const buttonSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-4 h-4 mr-2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );


  const handleAttachClass = async (classId) => {
    try {
      // Envoyez une requête pour attacher la classe au professeur
      await axios.post(`/teacher/${teacher.id}/attach-class/${classId}`);

      // Mettez à jour la liste des classes attachées
      setAttachedClasses((prevAttachedClasses) => {
        const attachedClass = availableClasses.find((cls) => cls.id === classId);
        return [...prevAttachedClasses, attachedClass];
      });
      console.log(attachedClasses);
      // Mettez à jour la liste des classes disponibles en supprimant la classe attachée
      setAvailableClasses((prevAvailableClasses) =>
        prevAvailableClasses.filter((cls) => cls.id !== classId)
      );

      // Affichez une notification de succès
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 1500);
    } catch (error) {
      // Gérez les erreurs ici
      setShowDangerToast(true);
      setTimeout(() => {
        setShowDangerToast(false);
      }, 1500);
      console.error("Error attaching class:", error);
    }
  };

  const handleDetachClass= async (classId) => {
    console.log(classId);
    const confirmation = confirm("Please confirm delete action");
    if(confirmation){
    try {
      await axios.delete(`/teacher/${teacher.id}/detach-classe/${classId}`);
      // After successful deletion, update the classes list
      setShowSuccessToast(true);
      setAttachedClasses((prevAttachedClasses) =>
      prevAttachedClasses.filter((cls) => cls.id !== classId)
    );

    // Update the list of available classes by adding the detached class back
    setAvailableClasses((prevAvailableClasses) => {
      const detachedClass = attachedClasses.find((cls) => cls.id === classId);
      return [...prevAvailableClasses, detachedClass];
    });
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 1500);
    } catch (error) {
      setShowDangerToast(true);
      setTimeout(() => {
        setShowDangerToast(false);
      }, 1500);
      console.error("Error deleting classe:", error);
    }
}
  };


  return (
    <div className="w-full flex flex-col justify-center items-center">
      {showSuccessToast && <Toast type="success" message="Details updated successfully." />}
      {showDangerToast && <Toast type="danger" message="Error updating details" />}
      <div className="rounded-full">
        <h2 className="w-48 rounded-full p-4 bg-main-bg text-slate-700 shadow-md flex justify-center items-center">
          {teacher.user.lastName + " " + teacher.user.firstName}
        </h2>
      </div>
      <div className="w-5/6 flex justify-between text-sm text-slate-700 mt-16">
        <div className="flex flex-col w-1/3">
            <div className="w-full flex justify-center items-center">
                <h3 className="font-medium">Attached Classes</h3>
            </div>
            <table className="w-full text-left shadow-md mt-6">
                <thead className="text-xs bg-slate-300 text-slate-800 uppercase ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                        Class Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                        Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                {attachedClasses.map((classe) => (
                    <tr key={classe.id}>
                    <td className="px-6 h-fit">{classe.name}</td>
                    <td>
                        <div className="flex w-full h-full items-center">
                        <a
                            href="#"
                            className="font-medium text-red-500 hover:underline px-6"
                            onClick={() => handleDetachClass(classe.id)}
                        >
                            Detach
                        </a>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="flex flex-col w-1/3">
            <div className="w-full flex justify-center items-center">
                <h3 className="font-medium">Available Classes</h3>
            </div>
            <table className="w-full text-left shadow-md mt-6">
                <thead className="text-xs bg-slate-300 text-slate-800 uppercase ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                        Class Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                        Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {availableClasses.map((classe) => (
                        <tr key={classe.id}>
                        <td className="px-6">{classe.name}</td>
                        <td>
                            <div className="flex w-full h-full items-center">
                            <a
                                href="#"
                                className="font-medium hover:underline px-6 text-green-600"
                                onClick={() => handleAttachClass(classe.id)}
                            >
                                Attach
                            </a>
                            </div>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    <div className="flex justify-center gap-6 items-center my-14 w-full ">
        <Button type="button" svgContent={buttonSvg} buttonText="Back" onClick={() => { handleMainClick("ListTeachers") }} />
    </div>
    </div>
  );
}
