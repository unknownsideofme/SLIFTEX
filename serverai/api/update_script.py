import pandas as pd
import numpy as np
import pickle 
import os

print("Starting the script...")

# Step 1: Open the file in read-binary mode
with open('data.pkl', 'rb') as file:
    # Step 2: Load the data from the file
    data = pickle.load(file)

# Now, `data` contains the deserialized Python object
print("data loaded successfully.")

data = data.str.lower()

data = pd.DataFrame(data)
data = data.drop_duplicates().dropna()

data.rename(columns={'Title Name': 'title'}, inplace=True)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document  # Import Document class

# Initialize the text splitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

# Assuming your DataFrame `data` has a column 'title' containing the titles or documents
# Create a list of Document objects
documents = [Document(page_content=row['title']) for index, row in data.iterrows()]

# Split the documents
split_docs = text_splitter.split_documents(documents)


# Extract content from split_docs
texts = [doc.page_content for doc in split_docs]


from langchain_ollama.embeddings import OllamaEmbeddings
embeddings = OllamaEmbeddings(model ="llama3.2" )


res = embeddings.embed_query("The Jagran Times")
print(len(res)) # checking the dimension of the embeddings so that the pinecone vector db can be configured accordingly 

from dotenv import load_dotenv
load_dotenv()
import os
api_key = os.getenv("PINECONE_API_KEY")

from pinecone import Pinecone
index_name = "titles"
pc = Pinecone(api_key=api_key)
index = pc.Index(index_name)
# Setting up the pinecone index the index name in this case is llama 



from pinecone_text.sparse import BM25Encoder


import nltk
nltk.download('punkt')  # force correct download
nltk.download('stopwords')

# Initialize the BM25 encoder
encoder = BM25Encoder().default()

# Your data and BM25 encoding process
# Ensure the data column is converted to a list of strings
corpus = data['title'].tolist()  # Convert the column to a list

# Fit the encoder
encoder.fit(corpus)

# Save the encoded data
encoder.dump("document.json")


encoded_docs = BM25Encoder().load("document.json")
alpha= 0.7


from langchain_community.retrievers import PineconeHybridSearchRetriever
retriever = PineconeHybridSearchRetriever(index=index, sparse_encoder=encoded_docs, embeddings=embeddings , top_k=30 , alpha = 0.8)

try:
    retriever.add_texts(corpus)
    print("✅ Uploaded texts.")
except Exception as e:
    print("❌ Failed to upload texts:", e)

print("✅ Script completed.")


