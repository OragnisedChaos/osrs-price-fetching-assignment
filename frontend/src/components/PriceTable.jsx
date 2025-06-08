import React, { useState, useEffect } from "react";

const dataDummy = [
  {
    name: "A powdered wig",
    buyLimit: 4,
    members: true,
    buyPrice: 66000,
    sellPrice: 15750,
    margin: 50250,
    dailyVolume: 38,
    potentialProfit: 201000,
    marginVolume: 1909500,
  },
  {
    name: "Abyssal ashes",
    buyLimit: 7500,
    members: true,
    buyPrice: 2008,
    sellPrice: 1985,
    margin: 23,
    dailyVolume: 108859,
    potentialProfit: 172500,
    marginVolume: 2503757,
  },
  // Add more data here...
];

export default function PriceTable() {
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/items-with-prices");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    // setData(dataDummy);
  }, []);
  //   const formatNumber = (num) => num.toLocaleString("en-US");

  const toggleFavorite = (itemName) => {
    setFavorites((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  // Filter and paginate data
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const changePage = (dir) => {
    setCurrentPage((prev) =>
      dir === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1
  };

  const handleDate = (isoString) => {
    // Trim to milliseconds if input contains microseconds
    const trimmed = isoString.length > 23 ? isoString.slice(0, 23) : isoString;

    const date = new Date(trimmed);

    if (isNaN(date)) return "Invalid Date";

    // You can format this to anything you like
    return date.toLocaleString(); // Example: "6/8/2025, 5:03:45 PM"
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      {/* Heading + Search + Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Prices from the OSRS Wiki</h1>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 w-full md:max-w-xs"
          />

          <select
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-2">Item Id</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Buy limit</th>
            <th className="p-2">Members</th>
            <th className="p-2">Buy price</th>
            <th className="p-2">Most Recent Buy</th>
            <th className="p-2">Sell price</th>
            <th className="p-2">Most Recent Sell</th>
            <th className="p-2">Margin</th>
            <th className="p-2">Last Price Fetched</th>
            <th className="p-2">Favorite</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan="10" className="p-4 text-center text-gray-400">
                No items found.
              </td>
            </tr>
          ) : (
            paginatedData.map((item, idx) => {
              const isFav = favorites[item.name];
              return (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } transition-colors`}
                >
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.examine}</td>
                  <td className="p-2">{item.limit}</td>
                  <td className="p-2">{item.members ? "⭐" : "☆"}</td>
                  <td className="p-2">{item.low}</td>
                  <td className="p-2">{item.lowTime}</td>
                  <td className="p-2">{item.high}</td>
                  <td className="p-2">{item.highTime}</td>
                  <td
                    className={`p-2 font-semibold ${
                      item.low - item.high >= 0
                        ? "text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {item.low - item.high}
                  </td>
                  <td className="p-2">{handleDate(item.last_updated)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleFavorite(item.name)}
                      className={`w-8 h-8 flex items-center justify-center rounded border transition ${
                        isFav
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-400 text-white hover:bg-gray-600"
                      }`}
                      title="Toggle favorite"
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-400 text-sm">
          Showing {indexOfFirstRow + 1} to{" "}
          {Math.min(indexOfLastRow, filteredData.length)} of{" "}
          {filteredData.length} items
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => changePage("prev")}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => changePage("next")}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
