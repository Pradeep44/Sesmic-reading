import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './Dashboard.css';

function Dashboard() {
    const [seismicData, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState({});

    const fetchData = async (customQuery) => {
        try {
        const fetchURL = "http://localhost:9797/api/get-data";
        let queryString = `year=${customQuery.year}`;

        if(customQuery.month) {
            queryString = `${queryString}&month=${customQuery.month}`;
        }

        if(customQuery.day) {
            queryString = `${queryString}&day=${customQuery.day}`;
        }

        const response = await fetch(fetchURL+"?"+queryString);
        const responseData = await response.json();

        if (response.status === 200) {
            setData(responseData.data);
        } else if(response.status === 404) {
            setData([]);
        } else {
            throw new Error(`Error: ${responseData.data.message}`);
        }
        } catch (error) {
          console.error('Error fetching data:', error.message);
          setError(`Error: ${error.message}`);
        }
    };

    const handleYearChange = (date) => {
        const year = new Date(date).getFullYear();
        const month = selectedMonth !== null ? selectedMonth + 1 : null;
        const day = selectedDay !== null ? selectedDay.getDate() : null;

        setQuery({year, month, day});
        setSelectedYear(date);
    }

    const handleMonthChange = (e) => {
        const month = parseInt(e.target.value, 10);
        const year = new Date(selectedYear).getFullYear();
        const updatedDay = selectedDay !== null ? selectedDay.getDate(): null;
        const selectedDate = new Date(year, month);
    
        setQuery({ year, month: month + 1, day: updatedDay });
        setSelectedMonth(month);
        setSelectedDay(selectedDate);
    };

    const handleDayChange = (date) => {
        const year = query.year || new Date(selectedYear).getFullYear();
        const month = query.month || new Date(selectedYear).getMonth() + 1;
        const day = date.getDate();
        
        setQuery({ year, month, day});
        setSelectedDay(date);
      };

    const handleClick = () => {
        fetchData(query);
    };

    const handleClear = async () => {
        const defaultQuery = {
            year: new Date().getFullYear(),
            month: null,
            day: null,
        };
    
        setQuery(defaultQuery);
        setSelectedYear(new Date());
        setSelectedMonth(null);
        setSelectedDay(null);
        fetchData(defaultQuery);
    };

    useEffect(() => {
        const newQuery = {
            year: new Date(selectedYear).getFullYear(),
            month: selectedMonth !== null ? selectedMonth + 1 : null,
            day: null,
        }
        setQuery(newQuery);
        fetchData(newQuery);
    }, []);
  
    return (
      <div className="dashboard-container">
        <h2>Seismic Data</h2>

        <div className="filter-button-container">
            <div className="filter-container">
                <div className="filter-item">
                    <label>Select Year:</label>
                    <DatePicker
                        selected={selectedYear}
                        onChange={handleYearChange}
                        showYearPicker
                        dateFormat="yyyy"
                    />
                </div>
                <div className="filter-item">
                    <label>Select Month:</label>
                    <select
                        value={selectedMonth !== null ? selectedMonth : ''}
                        onChange={handleMonthChange}
                    >
                        <option value="">-- All Months --</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString('en-US', {
                                    month: 'long',
                                })}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedMonth !== null && (
                    <div className="filter-item">
                        <label>Select Day:</label>
                        <DatePicker selected={selectedDay} onChange={handleDayChange} />
                    </div>
                )}
            </div>

            <div className="button-container">
                <button className="fetch-button" onClick={handleClick}>
                    Fetch Data
                </button>
                <button className="clear-button" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </div>
        <table>
            <thead>
            <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Day</th>
                <th>Max</th>
                <th>Min</th>
                <th>Count</th>
            </tr>
            </thead>
            <tbody>
                {seismicData.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="no-data-message">
                            No data available for the selected time period.
                        </td>
                    </tr>
                ) : (seismicData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.year}</td>
                        <td>{item.month}</td>
                        <td>{item.day}</td>
                        <td>{item.max}</td>
                        <td>{item.min}</td>
                        <td>{item.count}</td>
                    </tr>
                    ))
                )}
            </tbody>
        </table>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

export default Dashboard;