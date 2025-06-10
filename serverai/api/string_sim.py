import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import nltk
from rapidfuzz import fuzz

# Download NLTK data if not already downloaded
nltk.download('punkt')
nltk.download('stopwords')

# Load stopwords
stop_words = set(stopwords.words('english'))

# Read CSV
data = pd.read_csv('./phonatics.csv')

# Function to clean text
def clean_text(text):
    if pd.isnull(text):
        return ""
    tokens = word_tokenize(text)
    cleaned = [
        word.lower() for word in tokens
        if word.lower() not in stop_words and word not in string.punctuation
    ]
    return " ".join(cleaned)  # use space to preserve word boundaries

# Function to compute string similarity
def string_score(input_text, df , threshold = 60):
    match = []
    # Clean input and title
    cleaned_input = clean_text(input_text)
    for _, row in df.iterrows():
        cleaned_title = clean_text(row['title'])
        # Calculate similarity score
        score = fuzz.ratio(cleaned_input, cleaned_title)
        if score >= threshold:
            match.append({
                "title": row['title'],
                "similarity_score": score
            })
    
    match.sort(key=lambda x: x["similarity_score"], reverse=True)        
    return match


#ngrams 


def generate_ngrams(tokens, n):
    return [" ".join(tokens[i:i+n]) for i in range(len(tokens)-n+1)]

# Function to compute string similarity with n-gram presence check
def ng_score(input_text, df , threshold = 60):
    matches = []

    input_tokens = clean_text(input_text)

    # Generate n-grams (for example, unigrams and bigrams)
    input_ngrams = set(generate_ngrams(input_tokens, 1) + generate_ngrams(input_tokens, 2))

    for _, row in df.iterrows():
        title_tokens = clean_text(row['title'])
        title_ngrams = set(generate_ngrams(title_tokens, 1) + generate_ngrams(title_tokens, 2))

        # Check for any common n-grams
        if not input_ngrams.intersection(title_ngrams):
            continue  # skip if no meaningful substring match

        # Join tokens back for similarity
        input_cleaned = " ".join(input_tokens)
        title_cleaned = " ".join(title_tokens)

        # Calculate similarity score
        score = fuzz.ratio(input_cleaned, title_cleaned)
        if score >= threshold:
            matches.append({
                "title": row['title'],
                "similarity_score": score
            })
            
            
    matches.sort(key=lambda x: x["similarity_score"], reverse=True)

    return matches

def combined_score(input_text, df):
    # Get individual scores
    fuzzy_matches = string_score(input_text, df)
    ng_matches = ng_score(input_text, df)

    # Convert to dicts for quick lookup
    fuzzy_dict = {m["title"]: m["similarity_score"] for m in fuzzy_matches}
    ng_dict = {m["title"]: m["similarity_score"] for m in ng_matches}

    # Set of all titles from either result
    all_titles = set(fuzzy_dict) | set(ng_dict)

    combined = []
    for title in all_titles:
        if title in fuzzy_dict and title in ng_dict:
            final_score = (fuzzy_dict[title] + ng_dict[title]) / 2
        elif title in fuzzy_dict:
            final_score = fuzzy_dict[title]
        else:
            final_score = ng_dict[title]
        
        combined.append({
            "title": title,
            "final_score": final_score*0.95
        })

    # Sort by score descending
    combined.sort(key=lambda x: x["final_score"], reverse=True)
    return combined



import json

def format_to_json(matches, top_n=15):
    # Sort already done in combined_score, but we re-sort to be safe
    sorted_matches = sorted(matches, key=lambda match: match["final_score"], reverse=True)

    # Limit to top_n
    top_matches = sorted_matches[:top_n]

    # Construct final JSON structure
    formatted_output = {"similar titles": {}}
    for match in top_matches:
        formatted_output["similar titles"][match["title"]] = {
            "score": match["final_score"]
        }

    # Convert to pretty JSON string
    return json.dumps(formatted_output, indent=4)



#api fn call 

def string_search(input_text):
    # Call the combined scoring function
    matches = combined_score(input_text, data)
    
    # Format the results to JSON
    formatted_matches = format_to_json(matches, top_n=15)
    
    return formatted_matches



