import { useEffect, useState } from 'react';
import './App.css';
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = Papa.parse(csvText, { header: true });
        // Remove empty rows
        const filteredData = parsedData.data.filter(
          (row) => Object.values(row).some((value) => value && value.trim() !== "")
        );
        // Add extra fields
        const enrichedData = filteredData.map((row) => ({
          ...row,
          logoName: "",
          logoColor: "",
          placement: "",
          decoMethod: "",
        }));
        setData(enrichedData);
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  // Export updated CSV
  const updateCsv = () => {
    const headers = [
      "Reference Code",
      "Image URL",
      "logoName",
      "logoColor",
      "placement",
      "decoMethod"
    ];

    const csv = Papa.unparse(data, { columns: headers }); // ensure all columns
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "updated_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (

    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 4 equal columns
          gap: "1rem", // space between items
          padding: "1rem",
        }}
      >
        {data.map((row, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginBottom: "15px",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              <input
                disabled
                type="text"
                value={row["Reference Code"] || ""}
                style={{ padding: "0.5rem" }}
                onChange={(e) =>
                  handleChange(index, "Reference Code", e.target.value)

                }
              />
              {/* New inputs for logo info */}
              <input
                type="text"
                placeholder="Logo Name"
                value={row.logoName}
                style={{ padding: "0.5rem" }}
                onChange={(e) => handleChange(index, "logoName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Logo Color"
                value={row.logoColor}
                style={{ padding: "0.5rem" }}
                onChange={(e) => handleChange(index, "logoColor", e.target.value)}
              />
              <input
                type="text"
                placeholder="Placement"
                value={row.placement}
                style={{ padding: "0.5rem" }}
                onChange={(e) => handleChange(index, "placement", e.target.value)}
              />
              <input
                type="text"
                placeholder="Deco Method"
                value={row.decoMethod}
                style={{ padding: "0.5rem" }}
                onChange={(e) => handleChange(index, "decoMethod", e.target.value)}
              />
            </div>
            {/* Reference Code */}

            {/* Image */}
            {row["Image URL"] && (
              <img
                src={row["Image URL"]}
                alt={row["Reference Code"]}
                style={{ width: "400px", height: "auto", border: "1px solid #ccc" }}
              />
            )}
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <button
          onClick={updateCsv}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          Update CSV
        </button>
      )}
    </>
  );
}

export default App;