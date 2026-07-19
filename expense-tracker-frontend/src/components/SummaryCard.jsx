function SummaryCard({ title, amount, color , isCurrency = true  }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <h2
        className={`text-3xl font-bold mt-3 ${color}`}
      >
        {isCurrency ? `₹${amount}` : amount}
      </h2>

    </div>
  );
}

export default SummaryCard;