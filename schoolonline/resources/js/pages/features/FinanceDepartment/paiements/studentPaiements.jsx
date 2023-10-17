import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/reusable/button';
import Toast from '../../../components/reusable/toast';
const StudentPayments = ({ student,year,schoolToEdit,handleMainClick }) => {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [paidMonths,setPaidMonths] = useState([]);
  const [paidMonthsDiscounts,setPaidMonthsDiscounts] = useState([]);
  const [paidMonthsTotal,setPaidMonthsTotal] = useState([]);
  const [discounts, setDiscounts] = useState(Array.from({ length: 10 }, () => 0)); // Tableau pour stocker les réductions pour chaque mois
  const [totals, setTotals] = useState(Array.from({ length: 10 }, () => 0)); // Tableau pour stocker les totaux pour chaque mois
  const [services, setServices] = useState([]);
  const [studentPaiements,setStudentPaiements] = useState([]);
  const [startIndex, setStartIndex] = useState(null);
  const [total,setTotal] = useState(0);
  const [totalPaid,setTotalPaid] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDangerToast, setShowDangerToast] = useState(false);

  const monthNames = [
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];
  useEffect(() => {
    if (showSuccessToast || showDangerToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowDangerToast(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showDangerToast]);
  const handleAlert = (type) => {
    if (type === "success") setShowSuccessToast(true);
    else setShowDangerToast(true);
  };
  useEffect(() => {
    // Récupérer les services affectés à l'étudiant
    axios
      .get(`/api/studentServices?studentId=${student.id}`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
      axios
      .get(`/student-payments/${student.id}/details`)
      .then((response) => {
        setStudentPaiements(response.data);
        const monthsAlreadyPaid= [];
        const monthsAlreadyPaidDiscounts = [];
        const monthsAlreadyPaidTotal = [];
        response.data.map((studentPaiement) => {
            studentPaiement.details.map(detail => {
                monthsAlreadyPaid.push(detail.month);
                monthsAlreadyPaidDiscounts.push(detail.discount);
                monthsAlreadyPaidTotal.push(detail.paidAmount);
            })
        })
        setPaidMonths(monthsAlreadyPaid);
        setPaidMonthsDiscounts(monthsAlreadyPaidDiscounts);
        setPaidMonthsTotal(monthsAlreadyPaidTotal);
        let somme = 0;
        monthsAlreadyPaidTotal.map(paidPrice => {
        somme+=parseFloat(paidPrice);
        })
        setTotalPaid(somme);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, [student.id]);








  // Cette fonction calcule le total de la ligne pour un mois donné
  const calculateTotalForRow = (monthIndex) => {

    let total = 0;
    services.forEach((service) => {
      const price = parseFloat(service.price);
      total+=price;
    });



    const discount = discounts[monthIndex] || 0; // Obtenez la réduction pour ce mois
    total -= discount * total /100;
    totals[monthIndex] = total;
    let somme = 0;
    totals.map((t) => {
        somme+=t;
    })
    setTotal(somme);

  };

  // Fonction pour gérer la sélection d'un mois
  const handleMonthSelect = (monthIndex) => {
    // Mettez à jour les mois sélectionnés en fonction de la case à cocher

    let updatedSelectedMonths;

    // Mettez à jour les mois sélectionnés en fonction de la case à cocher
    if (selectedMonths.includes(monthIndex)) {
      updatedSelectedMonths = selectedMonths.filter((index) => index !== monthIndex);
      totals[monthIndex] = 0;
      let somme = 0;
      totals.map((t) => {
        somme+=t;
    })
    setTotal(somme);
    } else {
      updatedSelectedMonths = [...selectedMonths, monthIndex];
      calculateTotalForRow(monthIndex);
    }
    setSelectedMonths(updatedSelectedMonths);
  };

  // Fonction pour gérer les changements de réduction pour un mois donné
  const handleDiscountChange = (monthIndex, value) => {
    // Convertissez la valeur en nombre (utilisez parseFloat pour prendre en charge les décimales)
    const discountValue = parseFloat(value);
    // Mettez à jour le tableau des réductions en fonction de la saisie de l'utilisateur
    const newDiscounts = [...discounts];
    newDiscounts[monthIndex] = discountValue;
    setDiscounts(newDiscounts);
  };

  const handleSavePayments = () => {
    // Créez un objet de paiement à envoyer au backend
    const paymentData = {
      student_id: student.id,
      school_id :schoolToEdit.id,
      year_id : year,
      payments: selectedMonths.map((monthIndex) => {
        const monthName = monthNames[monthIndex];
        const totalForMonth = totals[monthIndex];
        const discountForMonth = discounts[monthIndex] || 0;

        return {
          month: monthName,
          total: totalForMonth,
          discount: discountForMonth,
        };
      }),
    };

    // Envoyez les données au backend via une requête POST
    axios
      .post('/api/student-paiements', paymentData)
      .then((response) => {
        if (response.data.success) {
          console.log('Payment saved successfully');
          handleAlert("success");
          setTimeout(() => {
            handleMainClick("ListStudentsToManage");
          },1500);

          // Réinitialisez les sélections ou effectuez d'autres actions nécessaires
        } else {
            handleAlert("danger");
            setTimeout(() => {
                console.error('Failed to save payment');
              },1500);

        }
      })
      .catch((error) => {
        console.error('Error saving payment:', error);
      });
  };

  return (
    <div className="w-full flex  flex-col items-center">
         <div>
        {showSuccessToast && <Toast type="success" message="Student fees updated successfully." />}
        {showDangerToast && <Toast type="danger" message="Error updating student fees" />}
      </div>
        <div className="w-full flex justify-center items-center">
            <h2 className="text-gray-700 font-medium text-xl">Student Payments</h2>
        </div>
      <table class="w-5/6 text-sm text-left text-gray-500 shadow-md mt-2">
        <thead class="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th scope="col" class="px-6 py-3">Month</th>
            {services.map((service) => (
              <th key={service.id}>{service.name}</th>
            ))}
            <th scope="col" class="px-6 py-3">Discount (%)</th>
            <th scope="col" class="px-6 py-3">Total</th>
            <th scope="col" class="px-6 py-3">Select</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, monthIndex) => (
            <tr key={monthIndex}>
              <td className="px-6 py-3">{monthNames[monthIndex]}</td>
              {services.map((service) => (
                <td className="px-6 py-3" key={service.id}>{service.price}</td>
              ))}
              <td className="px-6 py-3">
{
    paidMonths.includes(monthNames[monthIndex]) ? (paidMonthsDiscounts[paidMonths.indexOf(monthNames[monthIndex])]) : (<input
        type="number"
        value={discounts[monthIndex] || ''}
        onChange={(e) => {
          handleDiscountChange(monthIndex, e.target.value);
        }}
      />
    )
}
</td>

<td className="px-6 py-3">{

              paidMonths.includes(monthNames[monthIndex]) ? (paidMonthsTotal[paidMonths.indexOf(monthNames[monthIndex])]) :
              (totals[monthIndex])
              }</td>
              <td className="px-6 py-3">
                {
                    paidMonths.includes(monthNames[monthIndex]) ? ("paid") : (<input
                        type="checkbox"
                        checked={selectedMonths.includes(monthIndex)}
                        onChange={() => handleMonthSelect(monthIndex)}
                      />)
                }

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-center gap-12 mt-4">
        <span className="font-medium">Total Paid: {totalPaid}</span>
        <span className="font-medium">Total to pay: {total}</span>
      </div>
      <div className="w-full flex mt-4 justify-center items-center">
            <Button  onClick={handleSavePayments}   buttonText="Save" />
          </div>
    </div>
  );
};

export default StudentPayments;
