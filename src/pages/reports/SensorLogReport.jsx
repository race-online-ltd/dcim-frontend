

// import React, { useEffect, useState, useContext } from "react";
// import DataTable from "../../components/table/DataTable";
// import { getUserDataCenters } from "../../api/settings/dataCenterApi";
// import { userContext } from '../../context/UserContext';
// import moment from "moment";
// import { fetchSensorTypeLists, fetchSensorLocations } from "../../api/sensorListApi";
// import { SensorLogReport as fetchSensorLogReport } from "../../api/reportApi";

// // 🔥 Excel
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const SensorLogReport = () => {
//   const { user } = useContext(userContext);

//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [totalRows, setTotalRows] = useState(0);

//   const [filters, setFilters] = useState({
//     data_center_id: "",
//     sensor_type_list_id: "",
//     from_date: "",
//     to_date: ""
//   });

//   const [datacenters, setDatacenters] = useState([]);
//   const [sensorTypes, setSensorTypes] = useState([]);
//   const [sensorLocations, setSensorLocations] = useState([]);
//   // 🔥 Datacenters
//   useEffect(() => {
//     if (user?.id) {
//       getUserDataCenters(user.id)
//         .then(res => setDatacenters(res.data || []))
//         .catch(err => console.error(err));
//     }
//   }, [user?.id]);

//   // 🔥 Sensor Types
//   useEffect(() => {
//     fetchSensorTypeLists()
//       .then(res => setSensorTypes(res || []))
//       .catch(err => console.error(err));
//   }, []);

//   // 🔥 Fetch Data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchSensorLogReport({
//         from_date: filters.from_date,
//         to_date: filters.to_date,
//         data_center_id: filters.data_center_id || undefined,
//         sensor_type_list_id: filters.sensor_type_list_id || undefined,
//       });

//       setRows(res.data || []);
//       setTotalRows(res.count || 0);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 Submit
//   const handleSubmit = () => {
//     if (!filters.from_date || !filters.to_date) {
//       alert("Date is required");
//       return;
//     }
//     fetchData();
//   };

//   // 🔥 Export Excel
//   const handleExport = () => {
//     if (!rows.length) {
//       alert("No data to export");
//       return;
//     }

//     const exportData = rows.map(row => ({
//       "Sensor ID": row.sensor_id,
//       "Data Center": row.datacenter_name,
//       "Sensor Name": row.sensor_name,
//       "Value": row.value,
//       "Status": row.status,
//       "Sensor Type": row.sensor_type_name,
//       "Location": row.location,
//       "Date Time": moment(row.created_at).format("DD MMM YYYY, hh:mm:ss A"),
//       "End Time": moment(row.end_at).format("DD MMM YYYY, hh:mm:ss A"),
//       "Duration": row.duration_seconds,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Logs");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array"
//     });

//     const file = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(file, `sensor_logs_${Date.now()}.xlsx`);
//   };

//   const columns = [
//     { key: "sensor_id", header: "Sensor ID" },
//     { key: "datacenter_name", header: "Data Center" },
//     { key: "sensor_name", header: "Sensor Name" },
//     { key: "value", header: "Value" },
//     {
//       key: "status",
//       header: "Status",
//       render: (val) => (
//         <span style={{
//           color: val === "High" ? "red" : val === "Normal" ? "green" : "orange",
//           fontWeight: "bold"
//         }}>
//           {val}
//         </span>
//       )
//     },
//     { key: "sensor_type_name", header: "Sensor Type" },
//     { key: "location", header: "Location" },
//     {
//       key: "created_at",
//       header: "Date & Time",
//       render: (val) =>
//         val ? moment(val).format("DD MMM YYYY, hh:mm:ss A") : "-"
//     },
//     {
//       key: "end_at",
//       header: "End Time",
//       render: (val) =>
//         val ? moment(val).format("DD MMM YYYY, hh:mm:ss A") : "-"
//     },
//     { key: "duration_seconds", header: "Duration (seconds)" }
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Sensor Log Report</h2>

//       <DataTable
//         title="Sensor Logs"
//         data={rows}
//         columns={columns}
//         totalRows={totalRows}
//         page={page}
//         pageSize={pageSize}
//         setPage={setPage}
//         setPageSize={setPageSize}
//         loading={loading}

//         filterComponent={
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             flexWrap: "wrap",
//             gap: "15px",
//             width: "100%"
//           }}>

//             {/* LEFT SIDE */}
//             <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>

//               <div>
//                 <label style={labelStyle}>From Date</label>
//                 <input type="date"
//                   value={filters.from_date}
//                   onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
//                   style={inputStyle}
//                 />
//               </div>

//               <div>
//                 <label style={labelStyle}>To Date</label>
//                 <input type="date"
//                   value={filters.to_date}
//                   onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
//                   style={inputStyle}
//                 />
//               </div>

//               <div>
//                 <label style={labelStyle}>Data Center</label>
//                 <select
//                   value={filters.data_center_id}
//                   onChange={(e) => setFilters({ ...filters, data_center_id: e.target.value })}
//                   style={inputStyle}
//                 >
//                   <option value="">All</option>
//                   {datacenters.map(dc => (
//                     <option key={dc.id} value={dc.id}>{dc.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label style={labelStyle}>Sensor Type</label>
//                 <select
//                   value={filters.sensor_type_list_id}
//                   onChange={(e) => setFilters({ ...filters, sensor_type_list_id: e.target.value })}
//                   style={inputStyle}
//                 >
//                   <option value="">All</option>
//                   {sensorTypes.map(st => (
//                     <option key={st.id} value={st.id}>{st.name}</option>
//                   ))}
//                 </select>
//               </div>

//             </div>

//             {/* RIGHT SIDE BUTTONS */}
//             <div style={{ display: "flex", gap: "10px" }}>

//               <button onClick={handleSubmit} style={btnPrimary}>
//                 Submit
//               </button>

//               <button onClick={handleExport} style={btnSecondary}>
//                 Export Excel
//               </button>

//             </div>
//           </div>
//         }
//       />
//     </div>
//   );
// };

// // 🔥 Styles
// const labelStyle = {
//   fontSize: "12px",
//   fontWeight: "bold",
//   marginBottom: "5px",
//   display: "block"
// };

// const inputStyle = {
//   padding: "8px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   minWidth: "150px"
// };

// const btnPrimary = {
//   padding: "8px 16px",
//   borderRadius: "4px",
//   border: "none",
//   backgroundColor: "#2a67eb",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: "bold"
// };

// const btnSecondary = {
//   padding: "8px 16px",
//   borderRadius: "4px",
//   border: "1px solid #2a67eb",
//   backgroundColor: "#fff",
//   color: "#2a67eb",
//   cursor: "pointer",
//   fontWeight: "bold"
// };

// export default SensorLogReport;






import React, { useEffect, useState, useContext } from "react";
import DataTable from "../../components/table/DataTable";
import { getUserDataCenters } from "../../api/settings/dataCenterApi";
import { userContext } from '../../context/UserContext';
import moment from "moment";
import { fetchSensorTypeLists, fetchSensorLocations } from "../../api/sensorListApi";
import { SensorLogReport as fetchSensorLogReport } from "../../api/reportApi";

// 🔥 Excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SensorLogReport = () => {
  const { user } = useContext(userContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [filters, setFilters] = useState({
    data_center_id: "",
    sensor_type_list_id: "",
    location: "",
    from_date: "",
    to_date: ""
  });

  const [datacenters, setDatacenters] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [sensorLocations, setSensorLocations] = useState([]);

  // 🔥 Datacenters
  useEffect(() => {
    if (user?.id) {
      getUserDataCenters(user.id)
        .then(res => setDatacenters(res.data || []))
        .catch(err => console.error(err));
    }
  }, [user?.id]);

  // 🔥 Sensor Types
  useEffect(() => {
    fetchSensorTypeLists()
      .then(res => setSensorTypes(res || []))
      .catch(err => console.error(err));
  }, []);

  // 🔥 Fetch Sensor Locations
  useEffect(() => {
    if (filters.data_center_id && filters.sensor_type_list_id) {
      fetchSensorLocations(filters.data_center_id, filters.sensor_type_list_id)
        .then(res => setSensorLocations(res.data || []))
        .catch(err => console.error(err));
    } else {
      setSensorLocations([]);
    }
  }, [filters.data_center_id, filters.sensor_type_list_id]);

  // 🔥 Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchSensorLogReport({
        from_date: filters.from_date,
        to_date: filters.to_date,
        data_center_id: filters.data_center_id || undefined,
        sensor_type_list_id: filters.sensor_type_list_id || undefined,
        location: filters.location || undefined,
      });

      setRows(res.data || []);
      setTotalRows(res.count || 0);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Submit
  const handleSubmit = () => {
    if (!filters.from_date || !filters.to_date) {
      alert("Date is required");
      return;
    }
    fetchData();
  };

  // 🔥 Export Excel
  const handleExport = () => {
    if (!rows.length) {
      alert("No data to export");
      return;
    }

    const exportData = rows.map(row => ({
      "Sensor ID": row.sensor_id,
      "Data Center": row.datacenter_name,
      "Sensor Name": row.sensor_name,
      "Value": row.value,
      "Status": row.status,
      "Sensor Type": row.sensor_type_name,
      "Location": row.location,
      "Date Time": moment(row.created_at).format("DD MMM YYYY, hh:mm:ss A"),
      "End Time": moment(row.end_at).format("DD MMM YYYY, hh:mm:ss A"),
      "Duration": row.duration_seconds,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Logs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `sensor_logs_${Date.now()}.xlsx`);
  };

  const columns = [
    { key: "sensor_id", header: "Sensor ID" },
    { key: "datacenter_name", header: "Data Center" },
    { key: "sensor_name", header: "Sensor Name" },
    { key: "value", header: "Value" },
    {
      key: "status",
      header: "Status",
      render: (val) => (
        <span style={{
          color: val === "High" ? "red" : val === "Normal" ? "green" : "orange",
          fontWeight: "bold"
        }}>
          {val}
        </span>
      )
    },
    { key: "sensor_type_name", header: "Sensor Type" },
    { key: "location", header: "Location" },
    {
      key: "created_at",
      header: "Date & Time",
      render: (val) =>
        val ? moment(val).format("DD MMM YYYY, hh:mm:ss A") : "-"
    },
    {
      key: "end_at",
      header: "End Time",
      render: (val) =>
        val ? moment(val).format("DD MMM YYYY, hh:mm:ss A") : "-"
    },
    { key: "duration_seconds", header: "Duration (seconds)" }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sensor Log Report</h2>

      <DataTable
        title="Sensor Logs"
        data={rows}
        columns={columns}
        totalRows={totalRows}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        loading={loading}

        filterComponent={
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "15px",
            width: "100%"
          }}>

            {/* LEFT SIDE */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>

              <div>
                <label style={labelStyle}>From Date</label>
                <input type="date"
                  value={filters.from_date}
                  onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>To Date</label>
                <input type="date"
                  value={filters.to_date}
                  onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Data Center</label>
                <select
                  value={filters.data_center_id}
                  onChange={(e) => setFilters({ ...filters, data_center_id: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">All</option>
                  {datacenters.map(dc => (
                    <option key={dc.id} value={dc.id}>{dc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Sensor Type</label>
                <select
                  value={filters.sensor_type_list_id}
                  onChange={(e) => setFilters({ ...filters, sensor_type_list_id: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">All</option>
                  {sensorTypes.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  style={inputStyle}
                  disabled={!filters.data_center_id || !filters.sensor_type_list_id}
                >
                  <option value="">All</option>
                  {sensorLocations.map((loc, index) => (
                    <option key={index} value={loc.location}>{loc.location}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div style={{ display: "flex", gap: "10px" }}>

              <button onClick={handleSubmit} style={btnPrimary}>
                Submit
              </button>

              <button onClick={handleExport} style={btnSecondary}>
                Export Excel
              </button>

            </div>
          </div>
        }
      />
    </div>
  );
};

// 🔥 Styles
const labelStyle = {
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "5px",
  display: "block"
};

const inputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  minWidth: "150px"
};

const btnPrimary = {
  padding: "8px 16px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#2a67eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold"
};

const btnSecondary = {
  padding: "8px 16px",
  borderRadius: "4px",
  border: "1px solid #2a67eb",
  backgroundColor: "#fff",
  color: "#2a67eb",
  cursor: "pointer",
  fontWeight: "bold"
};

export default SensorLogReport;