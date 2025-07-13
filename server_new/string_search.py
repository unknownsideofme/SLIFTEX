import os 
from pinecone import Pinecone
from dotenv import load_dotenv
import joblib
import json
from typing import Optional, Dict, Any
import time 

load_dotenv()
import os
api_key = os.getenv("PINECONE_API_KEY2")
index_name = "titles"
pinecone = Pinecone(api_key=api_key)
index = pinecone.Index(index_name)



vectorizer = joblib.load("tfidf_vectorizer.pkl")   
       
    
    


def find_match(title):
    """
    Return top-k similar documents from Pinecone.
    """
    vector_dense = vectorizer.transform([title]).toarray()[0]
    indices = [i for i, val in enumerate(vector_dense) if val != 0]
    values = [float(val) for val in vector_dense if val != 0]


    response = index.query(
        sparse_vector={"indices": indices, "values": values},
        top_k=20,
        include_metadata=True,
    )

    if response.matches:
        results = []
        for match in response.matches:
            results.append({
                "score": match.score*100,
                "title": match.metadata.get("title"),
                "state": match.metadata.get("state"),
                "language": match.metadata.get("language"),
                "owner": match.metadata.get("owner"),
                "periodicity": match.metadata.get("periodicity"),
                "city": match.metadata.get("city"),
                "reg_no": match.metadata.get("reg_no")
            })
        return results
    else:
        return []

    


def format_match_as_json(match_result: Optional[list]) -> str:
    formatted = {"similar titles": {}}

    for item in match_result:
        title = item.get("title", "UNKNOWN TITLE")
        formatted["similar titles"][title] = {
            "score": item.get("score", 0),
            "city": item.get("city", ""),
            "state": item.get("state", ""),
            "owner": item.get("owner", ""),
            "periodicity": item.get("periodicity", ""),
            "regn_no": item.get("reg_no", ""),
            "language": item.get("language", "")
        }

    return json.dumps(formatted, indent=4)


    

def string_search (title) :
    start_time = time.time()
    """
    Perform a string match to find the most similar document based on title, state, language, and owner.
    
    Args:
        title (str): The title of the document.
        state (str): The state of the document.
        language (str): The language of the document.
        owner (str): The owner of the document.
        
    Returns:
        str: JSON-formatted string with match results.
    """
    
    match_result = find_match(title)
    end_time = time.time()
    print(f"Time taken for string match: {end_time - start_time} seconds")
    return format_match_as_json(match_result)


#Example Usage

# print(string_match("Kerela Baina", "California", "English", "John Doe"))


