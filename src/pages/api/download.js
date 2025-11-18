// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Papa from "papaparse";
import JSZip from "jszip";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "invalid request method" });
  }

  const data = req.body;
  const zip = new JSZip();

  const csvData = data.map(row => ({
    "Reference Code": row.ReferenceCode,
    "Image URL": row.ImageURL,
    "Logo Name": row.logoName,
    "Logo Color": row.logoColor,
    "Placement": row.placement,
    "Deco Method": row.decoMethod,
    "No Logo": row.noLogo,
  }));

  const csv = Papa.unparse(csvData);

  // Put CSV under zip/products/products.csv
  zip.folder("products").file("products.csv", csv);

  // ---------- 2. Download images & add to zip ----------
  const imagesFolder = zip.folder("images");

  for (const row of data) {
    const url = row.ImageURL;
    const filename = `${row.ReferenceCode}.jpg`;

    if (!url) continue;

    try {
      const imageResponse = await fetch(url);

      if (!imageResponse.ok) {
        console.warn("Failed to fetch", url);
        continue;
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      imagesFolder.file(filename, buffer);
    } catch (err) {
      console.error("Image fetch error:", err);
    }
  }
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=export.zip");
  res.send(zipBuffer);
}