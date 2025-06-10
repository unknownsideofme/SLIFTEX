import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import nltk
from metaphone import doublemetaphone
from rapidfuzz import fuzz  
import json



#read csv

data = pd.read_csv('./phonatics.csv')

# clean and remove stopwords

nltk.download('stopwords' )
nltk.download('punkt' )

# Get English stopwords
stop_words = set(stopwords.words('english'))

# Function to clean text by removing stopwords and punctuation
def clean_text(text):
    if pd.isnull(text):
        return ""
    # Tokenize text into words
    tokens = word_tokenize(text)
    # Convert to lowercase and remove punctuation and stopwords
    cleaned = [
        word.lower() for word in tokens
        if word.lower() not in stop_words and word not in string.punctuation
    ]
    return "".join(cleaned) 


#fuzzy search
def find_double_metaphone_matches(title ,input_metaphoneA, input_metaphoneB, data, threshold=60):
    matches = []
    for _, row in data.iterrows():
        # Calculate similarity scores for both metaphones
        
        score_A = fuzz.ratio(input_metaphoneA, row['metaphoneA']) if row['metaphoneA'] else 0
        score_B = fuzz.ratio(input_metaphoneB, row['metaphoneB']) if row['metaphoneB'] else 0
        score_C = fuzz.ratio(title, row['title']) if row['title'] else 0
        
        cons_A = (score_C+score_A)/2
        cons_B = (score_C+score_B)/2
        # Check if either score exceeds the threshold
        if cons_A >= threshold or cons_B >= threshold:
            matches.append({
                "title": row['title'],
                "metaphoneA": row['metaphoneA'],
                "metaphoneB": row['metaphoneB'],
                "similarity_score_A": cons_A,
                "similarity_score_B": cons_B
            })
        elif score_A >= threshold or score_B >= threshold:
            matches.append({
                "title": row['title'],
                "metaphoneA": row['metaphoneA'],
                "metaphoneB": row['metaphoneB'],
                "similarity_score_A": score_A,
                "similarity_score_B": score_B
            })
        elif score_C >= threshold:
            matches.append({
                "title": row['title'],
                "metaphoneA": row['metaphoneA'],
                "metaphoneB": row['metaphoneB'],
                "similarity_score_A": score_C,
                "similarity_score_B": score_C
            })
        
            
    
    return matches


import json

def format_to_json(matches):
    # Sort matches by the maximum similarity score in descending order
    sorted_matches = sorted(
        matches,
        key=lambda match: max(match["similarity_score_A"], match["similarity_score_B"]),
        reverse=True
    )

    # Prepare the full output dictionary with all matches first
    formatted_output = {"similar titles": {}}

    for match in sorted_matches:
        formatted_output["similar titles"][match["title"]] = {
            "score": max(match["similarity_score_A"], match["similarity_score_B"])
        }

    # Apply the top-15 filter at the end
    top_15_items = list(formatted_output["similar titles"].items())[:15]
    formatted_output["similar titles"] = dict(top_15_items)

    # Return the formatted JSON
    return json.dumps(formatted_output, indent=4)



def phonatic_search(title):
    title = clean_text(title)
    title_metaphoneA, title_metaphoneB = doublemetaphone(title) 
    matches = find_double_metaphone_matches(title, title_metaphoneA, title_metaphoneB, data)
    matches = format_to_json(matches)
    return matches




