import pandas as pd

# Try reading with a different encoding
df = pd.read_csv('Registered Title.csv', encoding='latin1')  # or encoding='cp1252'

# Remove rows where the TITLE contains any digits
df = df[~df['TITLE'].str.contains(r'\d', na=False)]

# Save the cleaned data
df.to_csv('filtered_titles.csv', index=False)
