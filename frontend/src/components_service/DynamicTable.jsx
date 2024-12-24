import React, { useState, useEffect } from 'react';
import './Table.css';
import Axios from 'axios';
import Progress from './ProgressBar';

const CACHE_EXPIRATION_TIME = 120000; // 120 seconds

let cache = async function getApiData(title) {
  const cacheKey = `title_cache_${encodeURIComponent(title)}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

  if (cachedData && cacheTimestamp) {
    const currentTime = new Date().getTime();
    if (currentTime - cacheTimestamp < CACHE_EXPIRATION_TIME) {
      console.log('Returning cached data');
      return JSON.parse(cachedData);
    } else {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_timestamp`);
    }
  }

  console.log('Fetching new data from API');
  try {
    const response = await fetch(`http://98.70.48.163/sliftex/similarity`, {
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
    if(data.error){
      alert("Restricted Keyword is Entered")
      setLoading(false);
      setInputDisabled(false);
      return;
    }
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime());
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const DynamicTable = () => {
  const [formData, setFormData] = useState({ title: '' });
  const [tableData, setTableData] = useState({
    stringSimilar: [],
    phoneticSimilar: [],
    suggestions: []
  });
  const [readMore, setReadMore] = useState({
    stringSimilar: false,
    phoneticSimilar: false
  });
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [calculatedVerdict, setCalculatedVerdict] = useState('');
  const [showVerdict, setShowVerdict] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progres, setProgres] = useState(0);
  const [progre, setProgre] = useState(0); // State for progress
  const [inside, setInside] = useState('');

  const userId = localStorage.getItem("_id");
  const username = localStorage.getItem("username");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({ title: '' });
    setTableData({
      stringSimilar: [],
      phoneticSimilar: [],
      suggestions: []
    });
    setDataFetched(false);
    setVerdict('');
    setCalculatedVerdict('');
    setShowVerdict(false);
    setInputDisabled(false);
    setShowResetPopup(false);
    setProgress(0);
    setProgres(0);
    setProgre(0);
    setInside('');

  };

  const handleSearch = async () => {
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
          stringSimilar: data.semantic_search?.["similar titles"] || [],
          phoneticSimilar: data.phonatic_search?.["similar titles"] || [],
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
    const scores = Object.values(data).map(item => item.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    return { average, max };
  };

  const calculateAndSetVerdict = (data) => {
    const stringScores = calculateScores(data.semantic_search["similar titles"]);
    const phoneticScores = calculateScores(data.phonatic_search["similar titles"]);

    // Calculate the progress based on stringScores.max * 100
    setProgress(stringScores.max);
    
    setProgre(phoneticScores.max);
    setProgres(Math.max(stringScores.max , phoneticScores.max)); 
    setCalculatedVerdict(progres>=80?"Rejected":progres>70?"Pending":"Accepted");
    if ( progres <=70) {
      sendTitleToUpdateAPI(formData.title);}


    // let verdict;
    // if (progres < 65) {
    //   verdict = 'Approved';
    // } else if (progres <= 75) {
    //   verdict = 'Pending';
    // } else if (progres < 100) {
    //   verdict = 'Rejected';
    // } else if (progres === 100) {
    //   verdict = 'Already Exists';
    // }
    // setInside(verdict);
    // setCalculatedVerdict(verdict);

 
  };

  const sendTitleToUpdateAPI = (title) => {
    Axios.post(`http://98.70.48.163/sliftex/update`, 
      { title: title }, 
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

  const closePopup = () => {
    setShowPopup(false);
  };

  const renderTable = (data, key) => {
    const dataArray = Object.entries(data);
    const visibleRows = readMore[key] ? dataArray : dataArray.slice(0, 5);

    return (
      <div className="table-section">
        <h3>
          {key === "stringSimilar" ? "String Similar Titles" : "Phonetic Similar Titles"}
        </h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Similarity Score</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map(([title, item], index) => (
                <tr key={index}>
                  <td>{title}</td>
                  <td>
                    {key === "stringSimilar" ? (item.score ).toFixed(0) : (item.score).toFixed(0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
        {dataArray.length > 5 && (
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
      <form>
        <div>
          <label>Title Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Title"
            disabled={inputDisabled}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={dataFetched ? handleFinalVerdict : handleSearch}
            disabled={loading}
            className={dataFetched ? "final-verdict-btn" : ""}>
            {loading ? "Submitting..." : dataFetched ? "Final Verdict" : "Search"}
          </button>
          <button type="reset" onClick={() => handleReset()} disabled={loading}>
            Reset
          </button>
        </div>
      </form>

      {showVerdict && (
        <div className="triangle-container">
          <div className="progress-bar-wrapper">
            <Progress progress={progress} name="Semantic-Similarity" strokeColor="#01959a" radius={70} />
          </div>
          <div className="progress-bar-wrapper">
            <Progress progress={progres} name={progres==100?"Already Taken":progres>=80?"Rejected":progres>70?"Pending":"Accepted" } strokeColor="#f47a08" radius={90} />
          </div>
          <div className="progress-bar-wrapper">
            <Progress progress={progre} name="Phonetic-Similarity" strokeColor="#6c757d" radius={70} />
          </div>
        </div>
      )}

      {progres >= 70 && (
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
      </div>

     
    </div>
  );
};

export default DynamicTable;
