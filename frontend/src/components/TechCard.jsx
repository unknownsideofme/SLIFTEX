import React from "react";
import "./TechCardStyle.css"; 

const TechCard = () => {
    const cards = [
        {
          id: 1,
          title: "Instant Feedback on Name Success",
          technology:
            "Receive immediate insights into the potential success of your chosen name helping you make quick and informed decisions",
          image: "https://media.istockphoto.com/id/1398473177/photo/questionnaire-with-checkboxes-filling-survey-form-online-answer-questions.jpg?s=1024x1024&w=is&k=20&c=A38N141knXQRDuPUZCsj_dIKkJa-pnsT_lz3QK3_6n4=",
        },
        {
          id: 2,
          title: "Chatbot Assistance",
          technology:
            "A chatbot assistant for title suggestions analyzes your prompt to generate relevant, creative options instantly. It saves time and helps you make quick decisions with tailored, impactful titles.",
          image: "https://plus.unsplash.com/premium_photo-1725326157274-4677383431eb?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 3,
          title: "Advanced LLM model",
          technology:
            "Leveraging advanced Large Language Models (LLMs), this technology delivers precise and context-aware responses in a matter of seconds, ensuring efficiency and accuracy.",
          image: "https://media.istockphoto.com/id/2149059417/photo/llm-ai-large-language-model-concept-businessman-working-on-laptop-with-llm-icons-on-virtual.jpg?s=1024x1024&w=is&k=20&c=Nia5VMiTZEOCRdL61hEH2-n63sD55x6TlD21sHSnuLk=",
        },
      ];
    
      return (
        <div className="main-container">
          <h1 className="heading">Discover the Key Features</h1>
          <div className="card-container">
            {cards.map((card) => (
              <div key={card.id} className="card">
                <img src={card.image} alt={card.title} className="card-image" />
                <div className="card-content">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-tech">{card.technology}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

export default TechCard;
