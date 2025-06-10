from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
import json
from dotenv import load_dotenv
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000 , chunk_overlap=100)
import json

def reformat_suggestions(output):
    try:
        # Check if the input is a string
        if isinstance(output, str):
            # Remove any triple backticks
            output = output.strip('`')
            # Parse the input JSON string
            parsed_output = json.loads(output)
        else:
            # If input is not a string, assume it's already a dict
            parsed_output = output

        # Check if the key is wrapped in an unnecessary string
        if isinstance(parsed_output, dict) and "suggestions" in parsed_output:
            suggestions = parsed_output["suggestions"]

            # Ensure keys are formatted correctly
            reformatted_suggestions = {
                key.strip().rstrip(".") + ".": value.strip()
                for key, value in suggestions.items()
            }

            return {"suggestions": reformatted_suggestions}

    except json.JSONDecodeError:
        # If JSON parsing fails, return the original output
        return output

    return output  # Return untouched if format doesn't matc




def calc_suggestions(res, title , llm) :
    # Convert JSON string into a Document object
    if isinstance(res, str):
        res = json.loads(res)

    # Convert `res` into LangChain-compatible Document objects
    res_document = [
        Document(page_content=json.dumps(value), metadata={"type": key})
        for key, value in res.items()
    ]
    docs = []
    for doc in res_document:
    # Split the page_content of the document
        chunks = text_splitter.split_text(doc.page_content)
    # Recreate Document objects for each chunk, keeping the original metadata
        for chunk in chunks:
            docs.append(Document(page_content=chunk, metadata=doc.metadata))
    # Define the prompt template
    prompt = ChatPromptTemplate.from_template(
        """
        You are a title verification assistant for the Press Registrar General of India.

        1. You will be given a response that stores the list of **phonetically and semantically similar existing titles** corresponding to a proposed input title.

        2. Your task is to generate **specific, actionable suggestions** for modifying the proposed title, with the goal of improving its uniqueness and acceptance likelihood.

        3. Use the provided context to analyze repeated words, common prefixes/suffixes, and overlapping semantic or phonetic patterns. Avoid giving **generic advice** like "replace Udyog with a unique term" unless you **clearly reference evidence** from the provided similar titles.

        4. Suggestions **must not propose exact title alternatives**, but should focus on:
        - Highlighting specific repeated words or stems in similar titles.
        - Identifying common prefixes/suffixes and advising replacement/removal.
        - Pointing out overlapping patterns (phonetic or semantic) across the retrieved results.
        - Encouraging uniqueness by avoiding overused formats or structures found in similar titles.

        5. All suggestions must be **concrete, evidence-based, and non-redundant**. Avoid repeating the same reasoning using different phrasing.

        6. Return only the suggestions, formatted as a JSON **object**, not string. Use the structure below.

        7. Do not include any greetings, disclaimers, or general-purpose assistance.

        Output Format:
        {{
            "suggestions": {{
                "1.": "Suggestion 1",
                "2.": "Suggestion 2",
                ...
            }}
        }}

        Input Title: {input}
        Retrieved Similar Titles Context: {context}
        """

    )
    
    # Create the document chain
    document_chain = create_stuff_documents_chain(llm, prompt)
    
    # Invoke the document chain
    response = document_chain.invoke({"input": title, "context": docs})
    response = reformat_suggestions(response)
    
    # Parse the response and return suggestions
    return response
