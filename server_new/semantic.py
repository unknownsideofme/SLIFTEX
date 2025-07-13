from dotenv import load_dotenv
import os
import getpass
from pinecone import Pinecone
from pinecone_text.sparse import BM25Encoder
from langchain_openai import OpenAIEmbeddings
from langchain_community.retrievers import PineconeHybridSearchRetriever
import heapq
from rapidfuzz.fuzz import token_set_ratio
from itertools import count
import json
import time






load_dotenv()
api_key = os.getenv("PINECONE_API_KEY")
openai = os.getenv("OPENAI_API_KEY")




pc = Pinecone(api_key=api_key)
index_name = "semantic"
index = pc.Index(index_name)
encoded_docs = BM25Encoder().load("document.json")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=openai)
retriever = PineconeHybridSearchRetriever(index=index, sparse_encoder=encoded_docs, embeddings=embeddings , top_k = 20 , alpha = 0.4 
                                          , text_key="title")


def build_json (docs , iptitle):
        
    scored_docs = []

    for doc in docs:
        title = doc.page_content
        metadata = dict(doc.metadata)

        pinecone_score = metadata.get("score", 0) * 100
        fuzzy_score = token_set_ratio(iptitle, title)
        combined_score = round(pinecone_score + fuzzy_score, 4)

        metadata_cleaned = {
            "score": combined_score,
            "city": str(metadata.get("city", "")).strip(),
            "state": str(metadata.get("state", "")).strip(),
            "owner": str(metadata.get("owner", "")).strip(),
            "periodicity": str(metadata.get("periodicity", "")).strip(),
            "regn_no": str(metadata.get("reg_no", "")),
            "language": str(metadata.get("language", "")).strip()
        }

        scored_docs.append((combined_score, title, metadata_cleaned))

    # Sort descending
    scored_docs.sort(key=lambda x: x[0], reverse=True)
    top_docs = scored_docs[:20]

    # Prepare final output
    result_json = {"similar titles": {
        title: meta for score, title, meta in top_docs
    }}



    return json.dumps(result_json, indent=4, ensure_ascii=False)


def semantic_search (title):
    start_time = time.time()
    docs  = retriever.invoke(title) 
    result = build_json(docs, title)
    end_time = time.time()
    print(f"Search completed in {end_time - start_time:.2f} seconds")
    return result


#print(semantic_search("Mahila"))
    

