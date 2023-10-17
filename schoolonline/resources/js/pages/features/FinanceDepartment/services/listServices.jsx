import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/reusable/button";
import Toast from "../../../components/reusable/toast";
import Select from "react-select";

// ...
const ListServices = ({ handleMainClick, year, schoolToEdit }) => {
    const [services, setServices] = useState([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDangerToast, setShowDangerToast] = useState(false);
    const [deleteShowSuccessToast,setDeleteShowSuccessToast] = useState(false);
    const [deleteShowDangerToast,setDeleteShowDangerToast] = useState(false);
    const [editablePrices, setEditablePrices] = useState({});
    const [editMode, setEditMode] = useState(null); // Utiliser null pour identifier la ligne en cours d'édition
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterActive, setIsFilterActive] = useState(false);
    const updatedPrices = {};


    useEffect(() => {
        setEditMode(null);
        if (showSuccessToast || showDangerToast) {
          const timer = setTimeout(() => {
            setShowSuccessToast(false);
            setShowDangerToast(false);
            setDeleteShowDangerToast(false);
            setDeleteShowSuccessToast(false);

          }, 1500);

          return () => clearTimeout(timer);
        }
      }, [showSuccessToast, showDangerToast,deleteShowDangerToast,deleteShowSuccessToast]);

      const handleAlert = (type) => {
        if (type === "successUpdate") setShowSuccessToast(true);
        else if (type === "dangerUpdate") setShowDangerToast(true);
        else if (type === "dangerDelete") setDeleteShowDangerToast(true);
        else setDeleteShowSuccessToast(true);
      };

    const toggleEditMode = (serviceId) => {
      setEditMode((prevServiceId) =>
        prevServiceId === serviceId ? null : serviceId
      ); // Activez/désactivez le mode d'édition
    };
    const fetchServiceList = () => {
        // Faites une requête API pour récupérer la liste des services
        axios.get(`/listServices?selectedYear=${year}&school=${schoolToEdit.id}`).then((response) => {
          // Mettez à jour l'état local avec la nouvelle liste de services
          setServices(response.data); // Supposons que "response.data" contient la liste des services mise à jour
        });
      };
    const handleSavePrices = (serviceId) => {
      const updatedPricesArray = editablePrices[serviceId];
      axios
        .put(`/updateServicePrices/${serviceId}`, {
          updatedPrices: updatedPricesArray,
        })
        .then((response) => {
          if (response.data.success) {
            handleAlert("successUpdate");
            setTimeout(() => {
                setEditMode(null);
                fetchServiceList();
                handleMainClick("ListServices");

            },1500);

          } else {
            handleAlert("dangerUpdate");
          }
        })
        .catch((error) => {
          setShowDangerToast(true);
          console.error("Error updating prices:", error);
        });
    };

    useEffect(() => {
        setEditMode(null);
      axios
        .get(`/listServices?selectedYear=${year}&school=${schoolToEdit.id}`)
        .then((response) => {
          setServices(response.data);
          const initialEditablePrices = {};
          response.data.forEach((service) => {
            initialEditablePrices[service.id] = {};
            service.levels.forEach((level) => {
              initialEditablePrices[service.id][level.id] = level.pivot.price;
            });
          });
          setEditablePrices(initialEditablePrices);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
    }, [year, schoolToEdit.id]);



    const handleDeleteService = (id) => {
        const confirmation = confirm("Please confirm delete action");
        if(confirmation){
        axios.delete(`/deletedService/${id}`)
          .then((response) => {
            if(response.data.message =="service not found")
            handleAlert("dangerDelete");
            else{
            handleAlert("successDelete");
            setServices((prevServices) => prevServices.filter((service) => service.id !== id));
        }
            // Refresh your classe list or perform other actions as needed
          })
          .catch((error) => {
            handleAlert("dangerDelete");
          });
        }
      };
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      let currentPosts = [];
      if(services.length > 0)
      currentPosts = services.slice(indexOfFirstPost, indexOfLastPost);

const listServices = currentPosts.filter((service) =>
service.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => {return (
    <tr key={service.id} className="bg-white border-b">
      <td className="px-6 py-3">{service.name}</td>
      {service.levels.map((level) => (
        <td key={level.id} className="px-6 py-3">
          {editMode === service.id ? (
            <input
              type="number"
              className="w-16"
              value={editablePrices[service.id][level.id]}
              onChange={(e) =>
                setEditablePrices((prevState) => ({
                  ...prevState,
                  [service.id]: {
                    ...prevState[service.id],
                    [level.id]: e.target.value,
                  },
                }))
              }
            />
          ) : (
            level.pivot.price
          )}
        </td>
      ))}
      <td className="px-6 py-3">
        {editMode === service.id ? (
          <button
            onClick={() => handleSavePrices(service.id)}
            className="text-blue-600 font-medium"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => toggleEditMode(service.id)}
            className="text-green-600 font-medium"
          >
            Edit
          </button>
        )}

        <a href="#" className="font-medium text-yellow-600 hover:underline pl-5" onClick={()=>{handleDeleteService(service.id)}}>Delete</a>

      </td>
    </tr>
  ) });

  const totalPages = Math.ceil(services.length / postsPerPage);
  const handlePageChange = (newPage) => {
      if(newPage>0 && newPage<=totalPages)
          setCurrentPage(newPage);
  };
  const renderPagination = () => {
      const pageButtons = [];

      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? "active flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-100 border rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white " : "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}
          >
            {i}
          </button>
        );
      }

      return (
        <div className="flex justify-center">
          <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage - 1)}>Précédent</button>
          {pageButtons}
          <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handlePageChange(currentPage + 1)}>Suivant</button>
        </div>
      );
    };
    return (
      <div className="w-full flex flex-col justify-center items-center -mt-12">
        {showSuccessToast && (
          <Toast type="successUpdate" message="Prices updated successfully." />
        )}
        {showDangerToast && (
          <Toast type="dangerUpdate" message="Error updating prices" />
        )}
        {deleteShowSuccessToast && (
          <Toast type="successDelete" message="Service deleted successfully." />
        )}
        {deleteShowDangerToast && (
          <Toast type="dangerDelete" message="Error deleting service" />
        )}
        <div className="w-full flex justify-center gap-2 items-center text-gray-700 text-xl mt-6">
            <span className="font-medium text-xl">Services fees per month</span>
        </div>

        <div className="flex justify-start items-center w-5/6 mt-12">

          <div className="w-3/4 flex justify-between">
            <Button
              buttonText="Add"
              type="button"
              onClick={() => {
                handleMainClick("NewService");
              }}
            />
            <div>
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full py-3 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-gray-50 focus:outline-none focus:border-slate-700" placeholder="Search Service"  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
        </div>
          </div>
          <div className="w-5/6">
            <form>
              <label
                for="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="flex justify-center items-center">
                  {/* Ajoutez ici votre Select pour filtrer par niveau */}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <table className="w-1/2 text-sm text-left text-gray-500 shadow-md mt-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Service Name
                </th>
                {services.length > 0 &&
                  services[0].levels.map((level) => (
                    <th key={level.id} scope="col" className="px-6 py-3">
                      {level.name}
                    </th>
                  ))}
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {listServices}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    );
  };

  export default ListServices;
