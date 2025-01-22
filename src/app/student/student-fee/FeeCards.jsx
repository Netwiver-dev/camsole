import { FaUserGraduate, FaTools, FaFileAlt, FaHome, FaBus, FaStethoscope, FaMapMarkerAlt, FaEllipsisH } from 'react-icons/fa';

export default function FeeCards() {
  const fees = [
    {
      title: "Student Fee",
      amount: "#500,000",
      color: "bg-blue-100",
      textColor: "text-blue-800",
      icon: <FaUserGraduate className="text-lg" />,
    },
    {
      title: "Development Fee",
      amount: "#300,000",
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <FaTools className="text-lg" />,
    },
    {
      title: "Exam Fee",
      amount: "#40,000",
      color: "bg-purple-100",
      textColor: "text-purple-800",
      icon: <FaFileAlt className="text-lg" />,
    },
    {
      title: "Hostel Fee",
      amount: "#45,000",
      color: "bg-red-100",
      textColor: "text-red-800",
      icon: <FaHome className="text-lg" />,
    },
    {
      title: "Transportation Fee",
      amount: "#34,000",
      color: "bg-green-100",
      textColor: "text-green-800",
      icon: <FaBus className="text-lg" />,
    },
    {
      title: "Medical Fee",
      amount: "#650,500",
      color: "bg-blue-100",
      textColor: "text-blue-800",
      icon: <FaStethoscope className="text-lg" />,
    },
    {
      title: "Excursion Fee",
      amount: "#65,000",
      color: "bg-orange-100",
      textColor: "text-orange-800",
      icon: <FaMapMarkerAlt className="text-lg" />,
    },
    {
      title: "Others",
      amount: "#500,000",
      color: "bg-purple-200",
      textColor: "text-purple-900",
      icon: <FaEllipsisH className="text-lg" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {fees.map((fee, index) => (
        <div key={index} className={`p-4 rounded-lg shadow ${fee.color}`}>
          <div className="flex items-center">
            {/* Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow ${fee.textColor}`}
            >
              {fee.icon}
            </div>
            {/* Fee Details */}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">{fee.title}</p>
              <p className={`text-lg font-bold ${fee.textColor}`}>
                {fee.amount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}