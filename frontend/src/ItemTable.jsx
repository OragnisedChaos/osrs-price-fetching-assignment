import React, { useEffect, useState, useMemo } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import debounce from "lodash.debounce";

// Create cleaner dark theme
createTheme("osrsWikiDark", {
  text: {
    primary: "#eaeaea",
    secondary: "#ccc",
  },
  background: {
    default: "#1e1e1e",
  },
  context: {
    background: "#333",
    text: "#FFFFFF",
  },
  divider: {
    default: "#444",
  },
  button: {
    default: "#4b4b4b",
    hover: "#5e5e5e",
    focus: "#6f6f6f",
    disabled: "#3a3a3a",
  },
  highlightOnHover: {
    default: "#2c2c2c",
    text: "#ffffff",
  },
});

const ItemTable = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetch("http://127.0.0.1:8000/items-with-prices")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const debouncedSetFilterText = useMemo(
    () => debounce(setFilterText, 300),
    []
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const filteredItems = data.filter((item) => {
    const searchText = filterText.toLowerCase();
    return !filterText || item.name?.toLowerCase().includes(searchText);
  });

  const columns = [
    {
      name: "",
      button: true,
      cell: (row) => (
        <button
          onClick={() => toggleFavorite(row.id)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
          }}
        >
          {favorites.has(row.id) ? "❤️" : "🤍"}
        </button>
      ),
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {row.icon && (
            <img src={row.icon} alt={row.name} width="24" height="24" />
          )}
          {row.name}
        </div>
      ),
    },
    {
      name: "Members",
      selector: (row) => (row.members ? "★" : ""),
      width: "80px",
    },
    {
      name: "Buy price",
      selector: (row) => row.low,
      sortable: true,
      format: (row) => row.low?.toLocaleString() ?? "-",
    },
    {
      name: "Sell price",
      selector: (row) => row.high,
      sortable: true,
      format: (row) => row.high?.toLocaleString() ?? "-",
    },
    {
      name: "Margin",
      selector: (row) => row.high - row.low,
      sortable: true,
      format: (row) => {
        const margin = row.high - row.low;
        return margin > 0 ? (
          <span style={{ color: "#00ff00" }}>{margin.toLocaleString()}</span>
        ) : (
          "-"
        );
      },
    },
    {
      name: "Daily volume",
      selector: (row) => row.volume,
      sortable: true,
      format: (row) => row.volume?.toLocaleString() ?? "-",
    },
    {
      name: "Potential profit",
      selector: (row) => row.volume * (row.high - row.low),
      sortable: true,
      format: (row) => {
        const value =
          row.volume && row.high && row.low
            ? row.volume * (row.high - row.low)
            : 0;
        return value > 0 ? (
          <span style={{ color: "#00ff00" }}>{value.toLocaleString()}</span>
        ) : (
          "-"
        );
      },
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        color: "#eaeaea",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        OSRS Item Prices
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Search for an item..."
          onChange={(e) => debouncedSetFilterText(e.target.value)}
          style={{
            padding: "10px",
            width: "400px",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#2c2c2c",
            color: "#eaeaea",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ overflowX: "auto", borderRadius: "8px" }}>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationPerPage={50}
          paginationRowsPerPageOptions={[50, 100, 250]}
          progressPending={loading}
          highlightOnHover
          striped
          dense
          theme="osrsWikiDark"
        />
      </div>
    </div>
  );
};

export default ItemTable;
