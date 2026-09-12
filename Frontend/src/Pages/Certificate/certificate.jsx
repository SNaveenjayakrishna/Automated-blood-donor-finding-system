import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BACKEND_URL } from "../../config/apiConfig";

export const handleDownload = async (user_id, name, donation_id) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/certificate?user_id=${user_id}&donation_id=${donation_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch certificate");

    const data = await res.json();

    if (!data.certificate) {
      alert("Certificate not found");
      return;
    }

    const certificate = data.certificate;

    const container = document.createElement("div");
    container.style.position = "absolute";
    {/*The element is removed from normal page flow and can be placed anywhere manually.*/}
    container.style.left = "-9999px";
    {/*Move this element 9999 pixels to the left — far outside the visible screen. */}
    container.style.width = "800px";
    container.style.height = "500px";
    container.style.padding = "40px";
    container.style.backgroundColor = "#fefefe";
    container.style.border = "5px solid #4caf50";

    container.innerHTML = `
      <h1 style="color:#4caf50;text-align:center;">Certificate of Appreciation</h1>
      <p style="font-size:18px;text-align:center;">This is proudly presented to</p>
      <h2 style="margin:20px 0;color:#ff0000;text-align:center;">${name || "User"}</h2>
      <p style="font-size:18px;text-align:center;">For generously donating blood and saving lives.</p>
      <p style="font-size:16px;text-align:center;">${certificate.hs_name || "Unknown"}</p>
      <p style="font-size:16px;text-align:center;">${certificate.address || "Unknown"}</p>
      <p style="margin-top:20px;font-size:16px;text-align:center;">Date: ${certificate.donation_date || "Unknown"}</p>
    `;

    document.body.appendChild(container);

    html2canvas(container, { scale: 2 }).then((canvas) => {

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      pdf.save("BloodDonationCertificate.pdf");

      document.body.removeChild(container);
      
    });
  } catch (err) {
    console.error(err);
    alert("Failed to download certificate");
  }
};
