
# About SLIFTEX

SLIFTEX -> Similarity and LInguistic Filtering for Title EXamination




## Backend

Folder Structure 

    backend
    |-> api
    |-> data_collection_and_uploading
    |-> requirements.txt


## Requirements

Ollama Application should be installed on machine for accessing and using llama3.2 embeddings

    pip install -r /path_to/requirements.txt 


Overall Implementations of String and Seamntic Search

![Image](https://i.pinimg.com/736x/0f/f5/3f/0ff53fb915b656b22f51eccf71e77dd9.jpg)


# Data Collection and Uploading


This folder is completely for before hand implementation and data uplaoding or processing

### Semantic and lexical similarity Search
File1 : pinecone.ipynb 

**Step 1: Preprocessing Datas and other preliminary steps**

**Step 2: RecursiveCharacterTextSplitter (Splitting the text into chunks )**

RecursiveCharacterTextSplitter is a utility provided by libraries like LangChain, primarily used in Natural Language Processing (NLP) and Large Language Model (LLM) workflows. It helps split large text documents into smaller, manageable chunks while preserving semantic coherence. This is particularly useful when dealing with LLMs that have input size constraints (e.g., OpenAI's GPT models).

**Step 3: Initializing the pinecone vector db (The Pinecone db should be configured from the site)**



**Step 4: Sparse Encoding using BM25 Encoder**

BM25 encoding, also known as sparse encoding, is a method used in information retrieval to represent documents and queries in a sparse vector space for ranking and retrieval tasks. It is commonly associated with BM25 (Best Match 25), a ranking algorithm that scores the relevance of documents to a query based on term frequency, inverse document frequency, and normalization.


It will generate the encoding and store them in the document.json file that will be later required to create the HybridSearchRetriever

 
**Step 5: Creating PineconeHybridSearchRetriever**  


(!!Important)   

The PineconeHybridSearchRetriever is a feature provided by Pinecone, a vector database service, that enables hybrid search capabilities. It combines dense vector search (used in neural or semantic embeddings) with sparse search (like BM25 or keyword-based retrieval). This hybrid approach enhances the retrieval of relevant documents by leveraging both semantic meaning and keyword matches.

alpha value used here = 0.8  
top_k = 30 

![representation_of_HybridSearch](https://www.pinecone.io/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fvr8gru94%2Fproduction%2Fe2f1743b7850ceb47e883387edd934c1e45cc4bc-1798x1081.png&w=1920&q=75)

[Medium Article on how it works and the mathematics behind it](https://medium.com/@alexrodriguesj/hybrid-search-rag-revolutionizing-information-retrieval-9905d3437cdd#:~:text=alpha%20controls%20the%20balance%2C%20with,keyword%20search%20(sparse%20relevance).)


[Llama Index Ai Blog ](https://www.llamaindex.ai/blog/llamaindex-enhancing-retrieval-performance-with-alpha-tuning-in-hybrid-search-in-rag-135d0c9b8a00)

[Weaviate Article](https://weaviate.io/blog/hybrid-search-explained)

**Step 6: Upload the Data to the vector DB**

```
retriever = PineconeHybridSearchRetriever(
    index=index, 
    sparse_encoder=encoded_docs, 
    embeddings=embeddings, 
    top_k=30, 
    alpha=0.8
)
```

```
retriever.add_texts(
    corpus
)
```

**Step 7: Testing on Random Title**

The invoke method is used to query the database

```
documents=retriever.invoke(input_text)
```

**Step 8: Fuzzy Matching**

To enforce slightly better lexical matching fuzzy matching is implemented again on the data provided by the retriever.

**Step 9: Scoring** 

*Note :- This part of final scoring has been implemented in the semantic.py file in api folder*

The score of each individual entity is calculated using two parameters

A. Fuzzy Similarity Score out of 100 
B. Similarity Score provided by the retriever

```
if A>85 then final score = A
else final score = avg(A,B)
```




    
## Pine Cone Setup

The Pinecone Database should have the follwing config:

Dimension : 3072 (for llama3.2 2GB variant)
metrics : dotproduct (as we are using HybridSearchRetreiver)

*HybridSearchRetreiver works only with dotproduct cause there are two embeddings one sparse and the other dense*

## Ollama Setup

Go to 
[Ollama Website Download](https://ollama.com/download)

After installing Ollama

```
ollama pull llama3.2
```
for downloading the embedding model 

## Phonatic Search

File 2: phonatic.ipynb

**Step 1: Basic Preprocessing**


**Step 2: Metaphone Conversion**

All the words are converted into their double Metaphone representation and then stored in two columns 

**Step 3: This is then exported**

This data is saved and exported into phonatics.csv so that they can be used to query later

**Step 4: Fuzzy Search**

Fuzzy Search is performed and a data is considered match here if the score is above 70 for any one of their Metaphone representation.


**Step 5: Ngram**

A comaparitive study was performed for ngram but it had not been implemented in the final api.


# API

#### File 1 : api.py  


  
Main entry point for the api call (FastAPI)

There are two routes created:- 

    1. /sliftex/similarity 
    2. /sliftex/update


/sliftex/similarity

This one calls few functions :

    1. check_disallowed_words
    2. semantic_search
    3. phonatic_search
    4. get_top_15
    5. remove_newlines
    6. calc_suggestions

*__check_disallowed_words__* 

It checks for the presence of any disallowed words


__*semantic_search*__

Calls in semantic_search function from the respective file to perform semantic and lexical search


__*phonatic_search*__

Calls in phonatic_search function from the respective file to perform phonatic matching.


__*get_top_15*__

The above function return a lot of data including metadata so the get_top_15 function performs filtering, sorts the output and sends the top 15 results of both the above function to the llm to get the suggestions generated

__*calc_suggestions*__

This function passes the output from the above two function and passes it to the llm to produce suggestions for those 


__*remove_newlines*__

This is a fucntion used for formatting and removing unnecessary spaces and other data and making it fit to the format the output of the api is generated


Sample output:-

```
{
    "semantic_search": {
        "similar titles": {
            "Satya Times": {
                "score": 95.65217391304348
            },
            "Satya Yug Times": {
                "score": 65.12106104074076
            },
            "Satya Pran Times": {
                "score": 64.45924723571429
            },
            "Satya Kiran Times": {
                "score": 62.63590508275862
            },
            "Satya Bharat Times": {
                "score": 62.13875631666667
            },
            "Satya Samrat Times": {
                "score": 61.502259166666676
            },
            "Satya Prakash Times": {
                "score": 59.59718331774194
            },
            "Satya Shikhar Times": {
                "score": 58.76132096774194
            },
            "Neta Times": {
                "score": 55.86691241363637
            },
            "Satyanvisechi": {
                "score": 52.675903169230764
            },
            "Satya Vansh": {
                "score": 52.23238260869566
            },
            "Shiv Times": {
                "score": 51.24929451818181
            },
            "Satya": {
                "score": 51.14975150588236
            },
            "Styavenshi Aaj": {
                "score": 50.135413375925935
            },
            "U K Times": {
                "score": 48.06249162142856
            },
            "Satya No Awaz": {
                "score": 47.447532300000006
            },
            "Bigul Times": {
                "score": 45.51394607173913
            },
            "Vansh Satya": {
                "score": 43.84114068478261
            },
            "Kripa Mohan Laal": {
                "score": 35.32637509827586
            }
        }
    },
    "phonatic_search": {
        "similar titles": {
            "city times": {
                "score": 100.0
            },
            "satta times": {
                "score": 100.0
            },
            "satya times": {
                "score": 100.0
            },
            "sayyad times": {
                "score": 100.0
            },
            "sew auto times": {
                "score": 100.0
            },
            "saidai times": {
                "score": 100.0
            },
            "sidhua times": {
                "score": 100.0
            },
            "sudha times": {
                "score": 100.0
            },
            "coasta times": {
                "score": 90.9090909090909
            },
            "state times": {
                "score": 90.9090909090909
            },
            "costa times": {
                "score": 90.9090909090909
            },
            "saladi times": {
                "score": 90.9090909090909
            },
            "subodh times": {
                "score": 90.9090909090909
            },
            "hasdeo times": {
                "score": 90.9090909090909
            },
            "sindh times": {
                "score": 90.9090909090909
            },
            "sandhya times": {
                "score": 90.9090909090909
            },
            "satyen times": {
                "score": 90.9090909090909
            },
            "sidra times": {
                "score": 90.9090909090909
            },
            "g s t a times": {
                "score": 90.9090909090909
            },
            "sobti times": {
                "score": 90.9090909090909
            },
            "study times": {
                "score": 90.9090909090909
            },
            "sudhir times": {
                "score": 90.9090909090909
            },
            "satija times": {
                "score": 90.9090909090909
            },
            "style times": {
                "score": 90.9090909090909
            },
            "sahayata times": {
                "score": 90.9090909090909
            },
            "samta times": {
                "score": 90.9090909090909
            },
            "asiad times": {
                "score": 90.9090909090909
            },
            "spet times": {
                "score": 90.9090909090909
            },
            "society times": {
                "score": 90.9090909090909
            },
            "satyajay times": {
                "score": 90.9090909090909
            },
            "sanidhya times": {
                "score": 90.9090909090909
            },
            "suket times": {
                "score": 90.9090909090909
            },
            "star times": {
                "score": 90.9090909090909
            },
            "zodiac times": {
                "score": 90.9090909090909
            },
            "azad times": {
                "score": 90.9090909090909
            },
            "ziraat times": {
                "score": 90.9090909090909
            },
            "sadaf times": {
                "score": 90.9090909090909
            },
            "swadeshi times": {
                "score": 90.9090909090909
            }
            "badaun times": {
                "score": 72.72727272727273
            },
            "bilsi times": {
                "score": 72.72727272727273
            },
            "tanesh times": {
                "score": 72.72727272727273
            },
            "baughpat times": {
                "score": 72.72727272727273
            },
            "sazal times": {
                "score": 72.72727272727273
            }
            "pichhada varg times": {
                "score": 57.14285714285714
            },
            "yashasvi news times": {
                "score": 57.14285714285714
            }
        },
    }
    "suggestions": {
        "suggestions": {
            "1.": "The word 'Times' is a commonly used suffix, consider replacing it with a unique suffix to improve title distinctiveness",
            "2.": "The title 'Satya Times' has a high similarity score with existing titles, consider adding a prefix or modifier to make it more unique",
            "3.": "The use of the word 'Satya' is repeated in many existing titles, consider replacing it with a synonym or a related word to reduce similarity",
            "4.": "The title 'Satya Times' has a high phonetic similarity with titles like 'Satta Times' and 'Satta' is a commonly used word, consider changing the title to avoid confusion",
            "5.": "Consider removing the word 'Times' and replacing it with a descriptive phrase that provides more context about the title's content or focus"
        }
    }
}
```

### File 2: semantic_search.py

Loads all the environment variables and then initialises the pinecone db 

It converts all the input title into the dense embeddings first and then find outs the semantic score based on the query results.

After that to enforce a slightly stricter lexical matching fuzzy matching is implemented and the final score is obtained for each entry on the basis of the method mentioned eariler

### File 3: phonatic_search.py

Loads the phonatic.csv that was exported eariler and then converts the input title into their double metaphone and then produce a score on the basis of the method mentioned above 

### File 4: suggestions.py

Here we are using ChatGroq and the llm model is llama-3.3-70b-versatile

A RAG type application is created where it recieves the top 15 matching results from the retrievers and then generates responses according to it 

### File 5: Update.py

In case a title has been marked accepted by then it needs to be updated 

Few steps have to be performed

    1. The new data needs to be appended to the entire dataset
    2. The sparse encoding of the combined data needs to be    produced 
    3. Then the data needs to be appended in the pinecone db
    4. The double metaphone of this also needs to be appended

All these tasks are performed Here




