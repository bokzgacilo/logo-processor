import { useState } from 'react';
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);

  // Handle CSV upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out any empty rows
        const filtered = results.data.filter(
          (row) => Object.values(row).some(v => v && v.toString().trim() !== "")
        );
        // Ensure all extra fields exist (even if missing in CSV)
        const enriched = filtered.map(row => ({
          ReferenceCode: row["Reference Code"] || "",
          ImageURL: row["Image URL"] || "",
          logoName: row.logoName || "",
          logoColor: row.logoColor || "",
          placement: row.placement || "",
          decoMethod: row.decoMethod || "",
        }));
        setData(enriched);
      }
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const updateCsv = () => {
    const csvData = data.map(row => ({
      "Reference Code": row.ReferenceCode,
      "Image URL": row.ImageURL,
      logoName: row.logoName,
      logoColor: row.logoColor,
      placement: row.placement,
      decoMethod: row.decoMethod
    }));

    const csv = Papa.unparse(csvData);
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
    <div style={{ padding: "1rem" }}>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "20px"
        }}
      >
        {data.map((row, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <input
                disabled
                type="text"
                value={row.ReferenceCode}
                style={{ padding: "0.5rem" }}
              />
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

            {row.ImageURL && (
              <img
                src={row.ImageURL}
                alt={row.ReferenceCode}
                style={{ width: "100%", maxWidth: "400px", height: "auto", border: "1px solid #ccc" }}
              />
            )}
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <button
          onClick={updateCsv}
          style={{ marginTop: "20px", padding: "1rem", fontSize: "14px" }}
        >
          Update CSV
        </button>
      )}
    </div>
  );
}

export default App;
