import React from "react";
import "./StepByStepGuide.css";

function StepByStepGuide() {
  return (
     <div className="guide">
        <div className="guide-text">
            <h2>Step By Step Guide to  Using<br /> our Service</h2>
        </div>

        <div className="process">
            <div className="process-row">
                <div className="pro-1 card">
                <h3>1.Input Name</h3>
                <p>Enter the name you want to check into the input field</p>
                </div>
                <div className="pro-2 card">
                <h3>2.View Results</h3>
                <p>Receive a probability score and insights instantly.</p>
                </div>
            </div>

            <div className="pro-3 card">
            <h3>3.Suggestions</h3>
            <p>Using Chatbot can enhance the title.</p>
            </div>
        </div>
     </div>
  );
}

export default StepByStepGuide;



