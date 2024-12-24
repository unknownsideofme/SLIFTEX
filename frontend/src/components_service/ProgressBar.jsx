import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-customizable-progressbar';
import './ProgressBar.css';

const Progress = ({ progress, name, strokeColor, radius = 100 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animatedProgress < progress) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev < progress) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 10); // Adjust speed here (milliseconds)
    }
  }, [progress, animatedProgress]);

  return (
    <div className="item">
      <ProgressBar
        radius={radius}
        progress={progress<=55 && name=="Accepted"?"100":progress<=60 && name=="Accepted"?"90":progress<=65 && name=="Accepted"?"80":progress<=70 && name=="Accepted"?"70":progress<=73 && name=="Pending"?"60":progress<=75 && name=="Pending"?"50":progress<=80 && name=="Rejected"?"40":progress<=85 && name=="Rejected"?"30":progress<=90 && name=="Rejected"?"20":progress<=99 && name=="Rejected"?"10":progress>=100 && name=="Already Taken"?"100":`${animatedProgress}`}
        strokeWidth={18}
        strokeColor={name === "Already Taken" ? "#000000" : name === "Rejected" ? "#FF3333" : name === "Pending" ? "#FEC20C" : name === "Accepted" ? "#1FD655" : strokeColor}
        strokeLinecap="square"
        trackStrokeWidth={18}
      >
        <div className="indicator">
          <div>{progress<=55 && name=="Accepted"?"10/10":progress<=60 && name=="Accepted"?"9/10":progress<=65 && name=="Accepted"?"8/10":progress<=70 && name=="Accepted"?"7/10":progress<=73 && name=="Pending"?"6/10":progress<=75 && name=="Pending"?"5/10":progress<=80 && name=="Rejected"?"4/10":progress<=85 && name=="Rejected"?"3/10":progress<=90 && name=="Rejected"?"2/10":progress<=99 && name=="Rejected"?"1/10":progress>=100 && name=="Already Taken"?"0/10":`${animatedProgress}%`}</div>
          {<div className="name">{name}</div>}
        </div>
      </ProgressBar>
    </div>
  );
};

export default Progress;
