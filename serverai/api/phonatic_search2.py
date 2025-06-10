import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import nltk
from rapidfuzz import fuzz  
import json

import jellyfish


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
from rapidfuzz import fuzz

def find_phonatic_match(title, input_soundex, input_metaphone, input_nysiis, input_codex, data, threshold=50):
    matches = []

    for _, row in data.iterrows():
        # Extract fields safely
        row_soundex = str(row.get('soundex', ''))
        row_metaphone = str(row.get('metaphone', ''))
        row_nysiis = str(row.get('nysiis', ''))
        row_codex = str(row.get('match_rating_codex', ''))
        row_title = str(row.get('title', ''))

        # Compute phonetic similarity scores (0–100 scale)
        soundex_score = fuzz.ratio(input_soundex, row_soundex) if row_soundex else 0
        metaphone_score = fuzz.ratio(input_metaphone, row_metaphone) if row_metaphone else 0
        nysiis_score = fuzz.ratio(input_nysiis, row_nysiis) if row_nysiis else 0
        codex_score = fuzz.ratio(input_codex, row_codex) if row_codex else 0
        title_score = fuzz.ratio(title, row_title) if row_title else 0

        # Compute average phonetic similarity (excluding title)
        phonetic_avg = (soundex_score + metaphone_score + nysiis_score + codex_score +title_score ) / 5

        if phonetic_avg >= threshold:
            matches.append({
                "title": row_title,
                "similarity_score":phonetic_avg ,
            })

    # Sort matches by phonetic average score in descending order
    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches





def format_to_json(matches):
    # Sort matches by their similarity score in descending order
    sorted_matches = sorted(matches, key=lambda match: match["similarity_score"], reverse=True)

    # Prepare the output dictionary
    formatted_output = {"similar titles": {}}

    for match in sorted_matches:
        formatted_output["similar titles"][match["title"]] = {
            "score": match["similarity_score"]
        }

    # Keep only the top 15
    top_15_items = list(formatted_output["similar titles"].items())[:15]
    formatted_output["similar titles"] = dict(top_15_items)

    # Return as JSON string
    return json.dumps(formatted_output, indent=4)




def phonatic_search(title):
    title_clean = clean_text(title)
    title_soundex = jellyfish.soundex(title_clean)
    title_metaphone = jellyfish.metaphone(title_clean)
    title_nysiis = jellyfish.nysiis(title_clean)
    title_codex = jellyfish.match_rating_codex(title_clean)

    matches = find_phonatic_match(
        title_clean,
        title_soundex,
        title_metaphone,
        title_nysiis,
        title_codex,
        data
    )
    return format_to_json(matches)


print(phonatic_search("Mahila"))




