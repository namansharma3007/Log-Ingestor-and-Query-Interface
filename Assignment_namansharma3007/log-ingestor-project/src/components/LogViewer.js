import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import socketIOClient from 'socket.io-client';


const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestampStart: '',
    timestampEnd: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
  });

  // Set up WebSocket connection using Socket.IO
  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000');

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Update logs when a new log is received through WebSocket
    socket.on('logUpdate', (updatedLogs) => {
      setLogs((prevLogs) => [...prevLogs, updatedLogs]);
    });

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      console.log('Component unmounted. Closing WebSocket connection.');
      socket.disconnect();
    };
  }, []);

  // Fetch logs when 'logs' state changes
  useEffect(() => {
    fetchLogs();
  }, [logs]);


  // Fetch all logs from the server
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLogs');
      const data = await response.json();
      setLogs(data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Apply filters for the initial data fetching
  useEffect(() => {
    applyFilters()
  }, [])


  // Fetch filtered logs from the server based on filter
  const applyFilters = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLogsByQuery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      })
      const data = await response.json();
      setFilteredLogs(data.data)
    } catch (error) {
      console.error('Error fetching filtered logs:', error);
    }
  };

  // Handle changes in filter
  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  // Clear all filters and display all logs
  const clearFilters = () => {
    setFilter({
      level: '',
      message: '',
      resourceId: '',
      timestampStart: '',
      timestampEnd: '',
      traceId: '',
      spanId: '',
      commit: '',
      parentResourceId: '',
    });
    setFilteredLogs(logs)
  };


  return (
    <div className="container-fluid">
      {/* Filters Section */}
      <div className="row mb-2 gap-1">
        <div className="col-md-2">
          {/* Level Filter */}
          <label htmlFor='level'>Level</label>
          <select
            className="form-control"
            value={filter.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            id="level"
          >
            <option value="">Select Level</option>
            {[...new Set(logs.map((log) => log.level))].map((uniqueLevel, index) => (
              <option key={index} value={uniqueLevel}>
                {uniqueLevel}
              </option>
            ))}

          </select>
        </div>
        <div className="col-md-2">
          {/* Message Filter */}
          <label htmlFor='message'>Message</label>
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Message"
            value={filter.message}
            onChange={(e) => handleFilterChange('message', e.target.value)}
            id="message"
          />
        </div>
        <div className="col-md-2">
          {/* Resource ID Filter */}
          <label htmlFor='commitId'>Commit</label>
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Commit"
            value={filter.commit}
            onChange={(e) => handleFilterChange('commit', e.target.value)}
            id="commitId"
          />
        </div>
        <div className="col-md-3">
          {/* Timestamp Range Filter */}
          <label htmlFor='timestamp'>Timestamp</label>
          <div className="d-flex gap-1">
            <DatePicker
              selected={filter.timestampStart ? new Date(filter.timestampStart) : null}
              onChange={(date) => handleFilterChange('timestampStart', date)}
              placeholderText="Start Date"
              className="form-control"
              id="timestamp"
            />
            <DatePicker
              selected={filter.timestampEnd ? new Date(filter.timestampEnd) : null}
              onChange={(date) => handleFilterChange('timestampEnd', date)}
              placeholderText="End Date"
              className="form-control ml-2"
              id="timestamp"
            />
          </div>
        </div>

      </div>

      <div className="row mb-2 gap-1">
        <div className="col-md-2">
          {/* Commit Filter */}
          <label htmlFor='resourceId'>Resource ID</label>
          <select
            className="form-control"
            value={filter.resourceId}
            onChange={(e) => handleFilterChange('resourceId', e.target.value)}
            id="resourceId"
          >
            <option value="">Select Resource ID</option>
            {[...new Set(logs.map((log) => log.resourceId))].map((uniqueResourceId, index) => (
              <option key={index} value={uniqueResourceId}>
                {uniqueResourceId}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          {/* Trace ID Filter */}
          <label htmlFor='traceId'>Trace ID</label>
          <select
            className="form-control"
            value={filter.traceId}
            onChange={(e) => handleFilterChange('traceId', e.target.value)}
            id="traceId"
          >
            <option value="">Select Trace ID</option>
            {[...new Set(logs.map((log) => log.traceId))].map((uniqueTraceId, index) => (
              <option key={index} value={uniqueTraceId}>
                {uniqueTraceId}
              </option>
            ))}

          </select>
        </div>
        <div className="col-md-2">
          {/* Span ID Filter */}
          <label htmlFor='spanId'>Span ID</label>
          <select
            className="form-control"
            value={filter.spanId}
            onChange={(e) => handleFilterChange('spanId', e.target.value)}
            id="spanId"
          >
            <option value="">Select Span ID</option>
            {[...new Set(logs.map((log) => log.spanId))].map((uniqueSpanId, index) => (
              <option key={index} value={uniqueSpanId}>
                {uniqueSpanId}
              </option>
            ))}

          </select>
        </div>

        <div className="col-md-3">
          {/* Parent Resource ID Filter */}
          <label htmlFor='parent-resource-id'>Parent Resource ID</label>
          <input
            type="text"
            id="parent-resource-id"
            className="form-control"
            placeholder="Filter by Parent Resource ID"
            value={filter.parentResourceId}
            onChange={(e) => handleFilterChange('parentResourceId', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          {/* Apply and Clear Filters Buttons */}
          <div className="d-flex gap-1">
            <button className="btn btn-primary ml-2" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-secondary ml-2" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Display Filtered Logs */}

      <h2>Filtered Logs</h2>
      {
        filteredLogs.length <= 0 ? <h1 className='text-center'>No Logs Available</h1> :
          <table className='table table-striped table-bordered table-sm'>
            <thead>
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Message</th>
                <th scope="col">Resource ID</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Trace ID</th>
                <th scope="col">Span ID</th>
                <th scope="col">Commit</th>
                <th scope="col">Parent Resource ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (

                <tr key={index}>
                  <td>{log.level}</td>
                  <td>{log.message}</td>
                  <td>{log.resourceId}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.traceId}</td>
                  <td>{log.spanId}</td>
                  <td>{log.commit}</td>
                  <td>{log.metadata?.parentResourceId}</td>
                </tr>

              ))}
            </tbody>
          </table>
      }
    </div>
  );
};

export default LogViewer;
