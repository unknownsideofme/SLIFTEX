import React, { useState, useEffect } from 'react';
import './Table.css';
import Axios from 'axios';
import Progress from './ProgressBar';
import { URL_FETCH, URL_POST, CACHE_EXPIRATION_TIME } from '../constant.js';

// Cache function with in-memory storage instead of localStorage
let memoryCache = {};

let cache = async function getApiData(title) {
  const cacheKey = `title_cache_${encodeURIComponent(title)}`;
  const cachedData = memoryCache[cacheKey];
  const cacheTimestamp = memoryCache[`${cacheKey}_timestamp`];

  if (cachedData && cacheTimestamp) {
    const currentTime = new Date().getTime();
    if (currentTime - cacheTimestamp < CACHE_EXPIRATION_TIME) {
      console.log('Returning cached data');
      return cachedData;
    } else {
      delete memoryCache[cacheKey];
      delete memoryCache[`${cacheKey}_timestamp`];
    }
  }

  console.log('Fetching new data from API');
  try {
    const response = await fetch(URL_FETCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.error) {
      alert("Restricted Keyword is Entered");
      return null;
    }
    memoryCache[cacheKey] = data;
    memoryCache[`${cacheKey}_timestamp`] = new Date().getTime();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const DynamicTable = () => {
  const [formData, setFormData] = useState({ 
    title: '',
    ownerName: '',
    language: '',
    state: ''
  });
  const [tableData, setTableData] = useState({
    stringSimilar: [],
    phoneticSimilar: [],
    semanticSimilar: [],
    suggestions: []
  });
  const [readMore, setReadMore] = useState({
    stringSimilar: false,
    phoneticSimilar: false,
    semanticSimilar: false,
  });
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [calculatedVerdict, setCalculatedVerdict] = useState('');
  const [showVerdict, setShowVerdict] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetPopup, setShowResetPopup] = useState(false);
  
  // Only 4 progress states needed
  const [stringProgress, setStringProgress] = useState(0);
  const [phoneticProgress, setPhoneticProgress] = useState(0);
  const [semanticProgress, setSemanticProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({ 
      title: '',
      ownerName: '',
      language: '',
      state: ''
    });
    setTableData({
      stringSimilar: [],
      phoneticSimilar: [],
      semanticSimilar: [],
      suggestions: []
    });
    setDataFetched(false);
    setVerdict('');
    setCalculatedVerdict('');
    setShowVerdict(false);
    setInputDisabled(false);
    setShowResetPopup(false);
    setStringProgress(0);
    setPhoneticProgress(0);
    setSemanticProgress(0);
    setOverallProgress(0);
    setReadMore({
      stringSimilar: false,
      phoneticSimilar: false,
      semanticSimilar: false,
    });
  };

  const handleSearch = async () => {
    // Validate all required fields
    if (!formData.ownerName.trim()) {
      alert("Owner Name is required.");
      return;
    }
    if (!formData.language.trim()) {
      alert("Language is required.");
      return;
    }
    if (!formData.state.trim()) {
      alert("State is required.");
      return;
    }
    if (formData.title.length < 3) {
      alert("Title must be at least 3 characters long.");
      return;
    }
    
    setLoading(true);
    setInputDisabled(true);
    const { title } = formData;

    try {
      const data = await cache(title);
      if (data) {
        setTableData({
          stringSimilar: data.string_search?.["similar titles"] || [],
          phoneticSimilar: data.phonatic_search?.["similar titles"] || [],
          semanticSimilar: data.semantic_search?.["similar titles"] || [],
          suggestions: data.suggestions?.suggestions || [],
        });

        setLoading(false);
        setDataFetched(true);
        calculateAndSetVerdict(data);
      } else {
        setLoading(false);
        setInputDisabled(false);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false);
      setInputDisabled(false);
    }
  };

  const calculateScores = (data) => {
    if (!data || Object.keys(data).length === 0) return { average: 0, max: 0
     };
    const scores = Object.values(data).map(item => item.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    return { average, max };
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (dataFetched) {
        handleFinalVerdict();
      } else {
        handleSearch();
      }
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (dataFetched) {
      handleFinalVerdict();
    } else {
      handleSearch();
    }
  };

  const calculateAndSetVerdict = (data) => {
    const stringScores = calculateScores(data.string_search?.["similar titles"]);
    const phoneticScores = calculateScores(data.phonatic_search?.["similar titles"]);
    const semanticScores = calculateScores(data.semantic_search?.["similar titles"]);

    // Convert to percentage and set individual progress
    const stringPercent = Math.round(stringScores.max *100);
    const phoneticPercent = Math.round(phoneticScores.max *100);
    const semanticPercent = Math.round(semanticScores.max *100);
    
    setStringProgress(stringPercent);
    setPhoneticProgress(phoneticPercent);
    setSemanticProgress(semanticPercent);
    
    // Calculate overall similarity (maximum of all three)
    const overall = Math.max(stringPercent, phoneticPercent, semanticPercent);
    setOverallProgress(overall);
    
    // Determine verdict based on overall score
    let verdict;
    if (overall >= 60) {
      verdict = 'Rejected';
    } else if (overall > 55) {
      verdict = 'Pending';
    } else {
      verdict = 'Accepted';
    }
    
    setCalculatedVerdict(verdict);
    
    // Send to API if accepted
    if (overall <= 55) {
      sendTitleToUpdateAPI(formData.title);
    }
  };

  const sendTitleToUpdateAPI = (title) => {
    Axios.post(URL_POST, 
      { 
        title: title,
        ownerName: formData.ownerName,
        language: formData.language,
        state: formData.state
      }, 
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then((response) => {
        if (response.data.status) {
          console.log("Title sent to update API successfully:", response.data.message);
        } else {
          console.error("Failed to send title to update API:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error sending title to update API:", err);
      });
  };

  const handleFinalVerdict = () => {
    setVerdict(calculatedVerdict);
    setShowVerdict(true);
  };

  const renderTable = (data, key) => {
    const dataArray = Object.entries(data);
    const filteredData = dataArray.filter(([_, item]) => item.score > 40);
    const visibleRows = readMore[key] ? filteredData : filteredData.slice(0, 5);
  
    return (
      <div className="table-section">
        <h3>
          {key === "stringSimilar" ? "String Similar Titles" : 
           key === "phoneticSimilar" ? "Phonetic Similar Titles" : 
           "Semantic Similar Titles"}
        </h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th>State</th>
              <th>Similarity Score</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map(([title, item], index) => (
                <tr key={index}>
                  <td>{title}</td>
                  <td>{formData.language}</td>
                  <td>{formData.state}</td>
                  <td>{(item.score).toFixed(0)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredData.length > 5 && (
          <button
            className="read-more-btn"
            onClick={() => setReadMore((prev) => ({ ...prev, [key]: !prev[key] }))}>
            {readMore[key] ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };
  

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="Enter Owner Name"
            disabled={inputDisabled}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div>
          <label>Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="Enter Language"
            disabled={inputDisabled}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Enter State"
            disabled={inputDisabled}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div>
          <label>Title Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Title"
            disabled={inputDisabled}
            onKeyDown={handleKeyPress}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={loading}
            className={dataFetched ? "final-verdict-btn" : ""}>
            {loading ? "Submitting..." : dataFetched ? "Final Verdict" : "Search"}
          </button>
          <button type="reset" onClick={() => handleReset()} disabled={loading}>
            Reset
          </button>
        </div>
      </form>

      {dataFetched && (
        <div className="user-input-summary">
          <h3>Search Details</h3>
          <div className="input-details">
            <div className="detail-item">
              <strong>Owner Name:</strong> {formData.ownerName}
            </div>
            <div className="detail-item">
              <strong>Language:</strong> {formData.language}
            </div>
            <div className="detail-item">
              <strong>State:</strong> {formData.state}
            </div>
            <div className="detail-item">
              <strong>Title:</strong> {formData.title}
            </div>
          </div>
        </div>
      )}

      {showVerdict && (
        <div className="triangle-container">
          <div className="progress-bar-wrapper">
            <Progress progress={stringProgress/100} name="String Similarity" strokeColor="#01959a" radius={70} />
          </div>
          <div className="progress-bar-wrapper">
            <Progress progress={phoneticProgress/100} name="Phonetic Similarity" strokeColor="#6c757d" radius={70} />
          </div>
          <div className="progress-bar-wrapper">
            <Progress progress={semanticProgress/100} name="Semantic Similarity" strokeColor="#01959a" radius={70} />
          </div>
          <div className="progress-bar-wrapper">
            <Progress 
              progress={overallProgress/100} 
              name={overallProgress/100 >= 65 ? "Rejected" : overallProgress/100 > 55 ? "Pending" : "Accepted"} 
              strokeColor="#f47a08" 
              radius={90} 
            />
          </div>
        </div>
      )}

      {overallProgress/100 >= 55 && (
        <div className="suggestions">
          <h3>Suggestions</h3>
          <ol>
            {Object.values(tableData.suggestions).map((suggestion, index) => (
              <li key={index}><b>{index+1}.</b> {suggestion}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="tables">
        {renderTable(tableData.stringSimilar, "stringSimilar")}
        {renderTable(tableData.phoneticSimilar, "phoneticSimilar")}
        {renderTable(tableData.semanticSimilar, "semanticSimilar")}
      </div>
    </div>
  );
};

export default DynamicTable;