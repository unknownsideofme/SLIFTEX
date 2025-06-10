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
def string_score(input_text, df):
    match = []
    # Clean input and title
    cleaned_input = clean_text(input_text)
    for _, row in df.iterrows():
        cleaned_title = clean_text(row['title'])
        # Calculate similarity score
        score = fuzz.ratio(cleaned_input, cleaned_title)
        if score >= 60:
            match.append({
                "title": row['title'],
                "similarity_score": score
            })
            
    return match


# Example usage
input_text = "example title"
matches = string_score(input_text, data)

# Print matches
print(matches)
