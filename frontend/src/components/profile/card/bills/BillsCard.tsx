const BillsCard = () => {
  return (
    <div className="col-start-1 md:row-start-3 max-h-[300px] min-h-[300px] space-y-2 overflow-y-auto rounded-2xl bg-white p-6 shadow-lg md:col-start-1">
    <h3 className="text-lg font-semibold">My Bills</h3>
    <div className="mt-4 space-y-2">
      {[
        { name: "Phone bill", status: "paid" },
        { name: "Internet bill", status: "not paid" },
        { name: "House rent", status: "paid" },
        { name: "Income tax", status: "paid" },
      ].map((bill, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between text-sm">
          <p>{bill.name}</p>
          <span
            className={`rounded-full px-3 py-1 ${
              bill.status === "paid"
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}>
            {bill.status === "paid" ? "Paid" : "Not paid"}
          </span>
        </div>
      ))}
    </div>
  </div>
  )
};

export default BillsCard;