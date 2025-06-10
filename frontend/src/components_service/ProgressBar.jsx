import React, { useEffect, useState } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import './ProgressBar.css';

// Progress Component (Individual Speedometer)
const Progress = ({ progress, name }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animatedProgress < progress) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev < progress) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 10); // Speed of animation
      return () => clearInterval(interval);
    }
  }, [progress, animatedProgress]);

  // Define custom color segments and ranges if needed
  const getNeedleColor = () => {
    switch (name) {
      case "Accepted": return "#10b981";
      case "Rejected": return "#ef4444";
      case "Pending": return "#f59e0b";
      case "Already Taken": return "#6b7280";
      default: return "#4a90e2";
    }
  };

  const getStatusIndicator = () => {
    switch (name) {
      case "Accepted": return "active";
      case "Rejected": return "inactive";
      case "Pending": return "pending";
      case "Already Taken": return "inactive";
      default: return "pending";
    }
  };

  return (
    <div className="progress-item">
      <div className="progress-header">
        <div className={`status-indicator ${getStatusIndicator()}`}></div>
        <h4 className="progress-title">{name}</h4>
      </div>
      <div className="speedometer-container">
        <ReactSpeedometer
          value={animatedProgress}
          minValue={0}
          maxValue={100}
          segments={5}
          needleColor={getNeedleColor()}
          startColor="#ff471a"
          endColor="#10b981"
          textColor="#2c5aa0"
          currentValueText={`${name}: ${animatedProgress}%`}
          ringWidth={25}
          width={220}
          height={140}
        />
      </div>
    </div>
  );
};

// Main Dashboard Component
const ProgressDashboard = () => {
  const [progressData, setProgressData] = useState([
    { name: "Accepted", progress: 75 },
    { name: "Rejected", progress: 15 },
    { name: "Pending", progress: 60 },
    { name: "Already Taken", progress: 30 }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Reset all progress to 0 first
    setProgressData(prev => prev.map(item => ({ ...item, progress: 0 })));
    
    setTimeout(() => {
      setProgressData(prev => prev.map(item => ({
        ...item,
        progress: Math.floor(Math.random() * 100)
      })));
      setIsLoading(false);
    }, 1000);
  };

  const totalProgress = progressData.reduce((sum, item) => sum + item.progress, 0);
  const averageProgress = Math.round(totalProgress / progressData.length);

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="dashboard-title">Application Progress Dashboard</h1>
        <p className="dashboard-subtitle">Government Portal - Real-time Application Status</p>
      </div>

      {/* Control Section */}
      <div className="control-section">
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="refresh-btn"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Progress Grid */}
      <div className="progress-grid">
        {progressData.map((item, index) => (
          <Progress 
            key={index}
            progress={item.progress}
            name={item.name}
          />
        ))}
      </div>

      

      {isLoading && (
        <div className="spinner">
          <div className="loading-text">Updating progress data...</div>
        </div>
      )}
    </div>
  );
};

// Export both components
export { Progress, ProgressDashboard };
export default ProgressDashboard;