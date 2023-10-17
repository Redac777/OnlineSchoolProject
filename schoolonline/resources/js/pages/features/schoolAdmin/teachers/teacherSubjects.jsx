import React, { useState, useEffect } from "react";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import axios from "axios";

export default function TeacherSubjects({ teacher, handleMainClick }) {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [attachedSubjects, setAttachedSubjects] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);

  useEffect(() => {
    // Fetch available subjects not associated with the teacher
    axios.get(`/teacher/${teacher.id}/subjects-not-associated`).then((response) => {
      setAvailableSubjects(response.data.availableSubjects);
    });
    setAttachedSubjects(teacher.subjects);
  }, [teacher]);

  const handleAttachSubject = async (subjectId) => {
    try {
      // Send a request to attach the subject to the teacher
      await axios.post(`/teacher/${teacher.id}/attach-subject/${subjectId}`);

      // Update the list of attached subjects
      setAttachedSubjects((prevAttachedSubjects) => {
        const attachedSubject = availableSubjects.find((subj) => subj.id === subjectId);
        return [...prevAttachedSubjects, attachedSubject];
      });

      // Update the list of available subjects by removing the attached subject
      setAvailableSubjects((prevAvailableSubjects) =>
        prevAvailableSubjects.filter((subj) => subj.id !== subjectId)
      );

      // Display a success notification
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 1500);
    } catch (error) {
      // Handle errors here
      setShowDangerToast(true);
      setTimeout(() => {
        setShowDangerToast(false);
      }, 1500);
      console.error("Error attaching subject:", error);
    }
  };

  const handleDetachSubject = async (subjectId) => {
    const confirmation = window.confirm("Please confirm delete action");
    if (confirmation) {
      try {
        // Send a request to detach the subject from the teacher
        await axios.delete(`/teacher/${teacher.id}/detach-subject/${subjectId}`);

        // After successful deletion, update the list of attached subjects
        setAttachedSubjects((prevAttachedSubjects) =>
          prevAttachedSubjects.filter((subj) => subj.id !== subjectId)
        );

        // Update the list of available subjects by adding the detached subject back
        setAvailableSubjects((prevAvailableSubjects) => {
          const detachedSubject = attachedSubjects.find((subj) => subj.id === subjectId);
          return [...prevAvailableSubjects, detachedSubject];
        });

        // Display a success notification
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 1500);
      } catch (error) {
        // Handle errors here
        setShowDangerToast(true);
        setTimeout(() => {
          setShowDangerToast(false);
        }, 1500);
        console.error("Error detaching subject:", error);
      }
    }
  };

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
            <h3 className="font-medium">Attached Subjects</h3>
          </div>
          <table className="w-full text-left shadow-md mt-6">
            <thead className="text-xs bg-slate-300 text-slate-800 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Subject Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {attachedSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 h-fit">{subject.name}</td>
                  <td>
                    <div className="flex w-full h-full items-center">
                      <a
                        href="#"
                        className="font-medium text-red-500 hover:underline px-6"
                        onClick={() => handleDetachSubject(subject.id)}
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
            <h3 className="font-medium">Available Subjects</h3>
          </div>
          <table className="w-full text-left shadow-md mt-6">
            <thead className="text-xs bg-slate-300 text-slate-800 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Subject Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {availableSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6">{subject.name}</td>
                  <td>
                    <div className="flex w-full h-full items-center">
                      <a
                        href="#"
                        className="font-medium hover:underline px-6 text-green-600"
                        onClick={() => handleAttachSubject(subject.id)}
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
      <div className="flex justify-center gap-6 items-center my-14 w-full">
        <Button
          type="button"
          svgContent={buttonSvg}
          buttonText="Back"
          onClick={() => {
            handleMainClick("ListTeachers");
          }}
        />
      </div>
    </div>
  );
}
