import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tilstede.css';
import { BarChart, PieChart, Pie, XAxis, YAxis, Legend, CartesianGrid, Bar, Tooltip } from 'recharts';

const DEFAULT_PROFILE_IMAGE = 'Default_Profile_Picture.jpg';

function Tilstede() {
  const [filterDate, setFilterDate] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [message, setMessage] = useState('Velg en dato for å se aktive brukere');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (!filterDate) {
      setMessage('Velg en dato for å se aktive brukere');
      return;
    }

    const fetchMembersByDate = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/digital_medlemsordning/get_member_attendance/?date=${filterDate}`);
        setRegisteredMembers(response.data.members_present || []);
        setMessage(
          response.data.members_present && response.data.members_present.length === 0
            ? 'Ingen registrerte folk :('
            : ''
        );
      } catch (error) {
        console.error("Error fetching members by date:", error);
        setMessage('Feil ved henting av data.');
      }
    };

    fetchMembersByDate();
  }, [filterDate]);

  useEffect(() => {
    const savedFilterDate = localStorage.getItem('filterDate');
    const savedMembers = JSON.parse(localStorage.getItem('registeredMembers'));

    if (savedFilterDate) {
      setFilterDate(savedFilterDate);
    }
    if (savedMembers) {
      setRegisteredMembers(savedMembers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('filterDate', filterDate);
    localStorage.setItem('registeredMembers', JSON.stringify(registeredMembers));
  }, [filterDate, registeredMembers]);

  const clearData = () => {
    setFilterDate('');
    setRegisteredMembers([]);
    setMessage('Velg en dato for å se aktive brukere');
  };

  const handleDateFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const getProfileImage = (imagePath) => {
    return imagePath ? `http://127.0.0.1:8000${imagePath}` : DEFAULT_PROFILE_IMAGE;
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchStatsByDateRange = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/digital_medlemsordning/member_attendance_stats/?start_date=${startDate}&end_date=${endDate}`);
        const data = response.data;
        const attendanceByGender = data.attendance_by_gender;
        const totalAttendance = data.total_attendance;

        const formattedBarData = [
          { gender: "Total", Antall: totalAttendance },
          { gender: "Gutt", Antall: attendanceByGender["gutt"] || 0 },
          { gender: "Jente", Antall: attendanceByGender["jente"] || 0 },
          { gender: "Ikke-binær", Antall: attendanceByGender["ikke-binær"] || 0 },
          { gender: "Vil ikke si", Antall: attendanceByGender["vil ikke si"] || 0 }
        ];

        setBarData(formattedBarData);

        const formattedPieData = [
          { name: "Gutt", value: attendanceByGender["gutt"] || 0, fill: '#0088FE' },
          { name: "Jente", value: attendanceByGender["jente"] || 0, fill: '#00C49F' },
          { name: "Ikke-binær", value: attendanceByGender["ikke-binær"] || 0, fill: '#FFBB28' },
          { name: "Vil ikke si", value: attendanceByGender["vil ikke si"] || 0, fill: '#FF8042' }
        ];

        setPieData(formattedPieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStatsByDateRange();
  }, [startDate, endDate]);

  const clearStatistics = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="tilstede-container">
      <div className="section registrerte-medlemmer">
        <h2 className="section-title">Registrerte Medlemmer</h2>
        <div className="date-filter-container">
          <label htmlFor="dateFilter" className="date-filter-label">Filtrer etter dato:</label>
          <input
            id="dateFilter"
            type="date"
            className="date-filter-input"
            value={filterDate}
            onChange={handleDateFilterChange}
          />
          <button onClick={clearData} className="button-clear">Tøm</button>
        </div>
        <div className="members-list">
          {message && <p className="no-members-message">{message}</p>}
          {registeredMembers.map((member, index) => (
            <div key={index} className="member-item">
              <img src={getProfileImage(member.profile_pic)} alt={`${member.name}`} className="member-photo" />
              <span className="member-name">{member.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section statistikk">
        <h2 className="section-title">Statistikk</h2>
        <div className="date-filter-container">
          <label htmlFor="startDate" className="date-filter-label">Start Dato:</label>
          <input
            id="startDate"
            type="date"
            className="date-filter-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate" className="date-filter-label">Slutt Dato:</label>
          <input
            id="endDate"
            type="date"
            className="date-filter-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={clearStatistics} className="reset-button">Tøm</button>
        </div>
        <div className="statistikk-message">
          {startDate === '' && endDate === '' && (
            <p>Velg en start dato og slutt dato for å se statistikken.</p>
          )}
        </div>
        {(startDate !== '' && endDate !== '') && (
          <div style={{ display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap" }}>
            <BarChart
              width={600} // Adjusted width to fit the container better
              height={300} // Height should be enough to display the bars properly
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={20}
            >
              <XAxis dataKey="gender" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="Antall" fill="#8884d8" background={{ fill: "#eee" }} />
            </BarChart>

            <PieChart
              width={400} 
              height={300} 
            >
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100} 
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  // Display percentage only if it's above 0%
                  if (percent > 0) {
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  } else {
                    return null; // Return null if percentage is 0%
                  }
                }}
                fill="#8884d8"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tilstede;
