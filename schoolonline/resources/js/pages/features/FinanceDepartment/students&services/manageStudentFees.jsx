import React, { useState, useEffect } from 'react';
import Button from '../../../components/reusable/button';
import axios from 'axios';
import Toast from '../../../components/reusable/toast';

const ManageStudentFees = ({ student, levelId, handleMainClick }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [discounts, setDiscounts] = useState({});
  const [total, setTotal] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [totalAttachedServices, setTotalAttachedServices] = useState(0.00);
  const [attachedServices, setAttachedServices] = useState([]);



  // Listes pour les services affectés et disponibles

useEffect(() => {
    let totalAmount = 0;
    attachedServices.forEach((service) => {
      totalAmount += parseFloat(service.price);
    });
    setTotalAttachedServices(totalAmount.toFixed(2));
},[attachedServices]);

  useEffect(() => {
    if (showSuccessToast || showDangerToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast]);

  useEffect(() => {
    // Charger la liste des services en fonction du levelId
    axios
      .get(`/availableServices/${levelId}/${student.id}`)
      .then((response) => {
        const initialServices = {};
        const initialDiscounts = {};
        response.data.forEach((service) => {
          initialServices[service.id] = false;
          initialDiscounts[service.id] = 0;
        });
        setServices(response.data);
        setSelectedServices(initialServices);
        setDiscounts(initialDiscounts);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });

    // Charger les services déjà affectés à l'étudiant
    axios
      .get(`/api/studentServices?studentId=${student.id}`)
      .then((response) => {
        setAttachedServices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attached services:', error);
      });
  }, [levelId, student.id]);


  const handleServiceSelect = (serviceId) => {
    setSelectedServices((prevSelectedServices) => ({
      ...prevSelectedServices,
      [serviceId]: !prevSelectedServices[serviceId],
    }));
  };

  const handleDiscountChange = (serviceId, event) => {
    const discountValue = event.target.value;
    setDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [serviceId]: discountValue,
    }));
  };

  useEffect(() => {
    // Calculer le total des frais en fonction des services sélectionnés et des remises
    let totalAmount = 0;
    services.forEach((service) => {
      if (selectedServices[service.id]) {
        const price = service.price;
        const discount = parseFloat(discounts[service.id]);
        totalAmount += price - (price * discount) / 100;
      }
    });
    setTotal(totalAmount);
  }, [selectedServices, discounts]);

  const detachService = (serviceId) => {
    // Détacher le service de l'étudiant
    axios
      .delete(`/api/detachService?studentId=${student.id}&serviceId=${serviceId}`)
      .then((response) => {
        if (response.data.success) {
          // Actualiser la liste des services déjà affectés
          setAttachedServices((prevAttachedServices) =>
            prevAttachedServices.filter((service) => service.id !== serviceId)
          );

          axios
          .get(`/availableServices/${levelId}/${student.id}`)
          .then((response) => {
            const initialServices = {};
            const initialDiscounts = {};
            response.data.forEach((service) => {
              initialServices[service.id] = false;
              initialDiscounts[service.id] = 0;
            });
            setServices(response.data);
            setSelectedServices(initialServices);
            setDiscounts(initialDiscounts);

          })
          .catch((error) => {
            console.error('Error fetching services:', error);
          });
        //   setShowSuccessToast(true);
        } else {
        //   setShowDangerToast(true);
          console.error('Failed to detach service');
        }
      })
      .catch((error) => {
        // setShowDangerToast(true);
        console.error('Error detaching service:', error);
      });
  };

  const attachServices = () => {
    // Attacher les services sélectionnés à l'étudiant
    const feesData = [];
    services.forEach((service) => {
      if (selectedServices[service.id]) {
        const price = service.price;
        const discount = parseFloat(discounts[service.id]);
        const finalPrice = price - (price * discount) / 100;
        feesData.push({
          serviceId: service.id,
          price: finalPrice,
        });
      }
    });

    axios
      .post(`/api/attachServices/${student.id}`, feesData)
      .then((response) => {
        if (response.data.success) {
          // Actualiser la liste des services déjà affectés
          setAttachedServices([...attachedServices, ...response.data.attachedServices]);
          setShowSuccessToast(true);
          // Réinitialiser la sélection des services
          setSelectedServices({});
          setDiscounts({});
          setTotal(0);

          axios
          .get(`/availableServices/${levelId}/${student.id}`)
          .then((response) => {
            const initialServices = {};
            const initialDiscounts = {};
            response.data.forEach((service) => {
              initialServices[service.id] = false;
              initialDiscounts[service.id] = 0;
            });
            setServices(response.data);
            setSelectedServices(initialServices);
            setDiscounts(initialDiscounts);
          })
          .catch((error) => {
            console.error('Error fetching services:', error);
          });
        } else {
          setShowDangerToast(true);
          console.error('Failed to attach services');
        }
      })
      .catch((error) => {
        setShowDangerToast(true);
        console.error('Error attaching services:', error);
      });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div>
        {showSuccessToast && <Toast type="success" message="Student attached services updated successfully." />}
        {showDangerToast && <Toast type="danger" message="Error updating student attached services fees" />}
      </div>
      <div className="w-full flex justify-center gap-2 items-center text-gray-700 text-xl">
        <span className="">Manage Student Fees for </span>
        <span className="font-bold">
          {student.user.lastName} {student.user.firstName}
        </span>
      </div>
      <div className="flex w-full justify-center mt-14 gap-[10%]">
        <div className="w-[35%]">
          <h2 className="text-xl font-semibold mb-2 flex justify-center">Attached Services</h2>
          <table className="w-full text-sm text-left text-gray-500 shadow-md mt-6">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Service name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price(Month)
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            {attachedServices.map((service) => (
            <tr key={service.id}>
                  <td className="px-6 py-3">{service.name}</td>
                  <td className="px-6 py-3">{service.price}</td>
                  <td className="px-6 py-3">
                  <div className="flex w-full h-full items-center">
                    <a href="#" className="font-medium text-footerColor hover:underline"  onClick={() => detachService(service.id)}>Detach</a>
                </div>
                  </td>
                </tr>
                 ))}
            </tbody>
          </table>
          <div className="flex justify-center">
          <p className="mt-6 font-medium">Total: {totalAttachedServices}</p>
          </div>
        </div>
        <div className="w-[45%]">
            <div className="flex justify-center">
                <h2 className="text-xl font-semibold mb-2">Available Services</h2>
            </div>
          <table className="w-full text-sm text-left text-gray-500 shadow-md mt-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Service name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Discount (%)
                </th>
                <th scope="col" className="px-6 py-3">
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3">{service.name}</td>
                  <td className="px-4 py-3">{service.price}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={discounts[service.id]}
                      onChange={(e) => handleDiscountChange(service.id, e)}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedServices[service.id]}
                      onChange={() => handleServiceSelect(service.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center">
          <p className="mt-6 font-medium">Total: {total}</p>
          </div>

          <div className="w-full flex mt-6 justify-center items-center">
            <Button onClick={attachServices} buttonText="Attach Services" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentFees;
