import React, { useEffect, useState } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import './ProgressBar.css';

// Progress Component (Individual Speedometer)
const Progress = ({ progress, name, strokeColor = "#4a90e2", radius = 70 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Reset animation when progress changes
    setAnimatedProgress(0);
    
    const animateProgress = () => {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev < progress) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return progress;
          }
        });
      }, 10); // Speed of animation
      
      return () => clearInterval(interval);
    };

    const timeoutId = setTimeout(animateProgress, 100);
      return () => clearTimeout(timeoutId);
    }, [progress]);

    // Define custom color segments and needle color based on name/progress
    const getNeedleColor = () => {
      if (name === "Accepted") return "#10b981";
      if (name === "Rejected") return "#ef4444";
      if (name === "Pending") return "#f59e0b";
      
      // For similarity types, use color based on progress value
      if (progress >= 80) return "#ef4444"; // Red for high similarity
      if (progress > 70) return "#f59e0b";  // Yellow for medium similarity
      return "#10b981"; // Green for low similarity
    };

    const getStatusIndicator = () => {
      if (name === "Accepted") return "active";
      if (name === "Rejected") return "inactive";
      if (name === "Pending") return "pending";
      
      // For similarity types
      if (progress >= 80) return "inactive"; // High similarity is bad
      if (progress > 70) return "pending";   // Medium similarity is pending
      return "active"; // Low similarity is good
    };

    const getSegmentColors = () => {
      // Custom color segments for better visualization
      return [
        "#10b981", // Green (0-20)
        "#22c55e", // Light Green (20-40)
        "#eab308", // Yellow (40-60)
        "#f97316", // Orange (60-80)
        "#ef4444"  // Red (80-100)
      ];
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
          segmentColors={getSegmentColors()}
          needleColor={getNeedleColor()}
          textColor="#2c5aa0"
          currentValueText={`${animatedProgress}%`}
          ringWidth={25}
          width={radius * 3}
          height={radius * 2}
          needleHeightRatio={0.7}
          forceRender={true}
        />
      </div>
    </div>
  );
};

export default Progress;