import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import cardStyles from "../../styles/cards.module.css";

const DonorSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/donor_summary/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setSummary(data.summary || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <p className={cardStyles.card}>Loading summary...</p>;
  if (!summary.length) return <p className={cardStyles.card}>No donors found.</p>;

  return (
    <div className={cardStyles.card}>
      <h3>Donor Summary by District</h3>

      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, index) => {
              const showDistrict = index === 0 || row.district !== summary[index - 1].district;
              return (
                <React.Fragment key={index}>
                  
                  {showDistrict && (
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          background: "#f5f5f5",
                          textAlign: "center",
                        }}
                      >
                        📍 {row.district} - {row.state}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>🩸 {row.blood_group}</td>
                    <td>{row.count}</td>
                  </tr>

                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

     <div className={cardStyles.mobileCards}>
        {summary.map((row, index) => {
                    const showDistrict = index === 0 || row.district !== summary[index - 1].district;
                      return (
                      <div key={row.id}>
        
                      {showDistrict && (
                      <div style={{
                        fontWeight: "bold",
                        background: "#f5f5f5",
                        padding: "8px",
                        margin: "10px",
                        textAlign: "center"
                      }}>
                        📍 {row.district} - {row.state}
                      </div>
                    )}
                      
                      <div className={cardStyles.requestcard}>
                        <p>🩸 {row.blood_group}</p>
                        <p>{row.count}</p>
                      </div>
                   </div>);
        })}
      </div>
    </div>
  );
};

export default DonorSummary;