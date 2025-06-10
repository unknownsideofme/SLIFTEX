import jellyfish
import pandas as pd
import re

# Load CSV
data = pd.read_csv('./phonatics.csv')

# Drop old phonetic columns if they exist
columns_to_drop = ['metaphoneA', 'metaphoneB', 'soundex', 'metaphone', 'nysiis', 'match_rating_codex']
data.drop(columns=[col for col in columns_to_drop if col in data.columns], inplace=True)

# Clean title to keep only alphabetical characters (for match_rating_codex)
def clean_alpha(text):
    return re.sub(r'[^A-Za-z ]', '', str(text))

# Define phoneme generator
def phoneme_gen(title):
    if pd.isnull(title):
        return "", "", "", ""

    clean_title = clean_alpha(title)
    return (
        jellyfish.soundex(clean_title),
        jellyfish.metaphone(clean_title),
        jellyfish.nysiis(clean_title),
        jellyfish.match_rating_codex(clean_title)
    )

# Apply to each title and assign new columns
data[['soundex', 'metaphone', 'nysiis', 'match_rating_codex']] = data['title'].apply(
    lambda t: pd.Series(phoneme_gen(t))
)

# Save back to CSV
data.to_csv('./phonatics.csv', index=False)

print("✅ Phonetic columns added successfully.")
