import logging
from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Path
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.chat_engine.types import ChatMode
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.vector_stores.qdrant import QdrantVectorStore

from backend.config import logger
from backend.database import qdrant_client, redis_chat_store, research_collection
from backend.models import ChatRequest
from backend.prompts import (
    CONTEXT_PROMPT_TEMPLATE,
    QA_FORMAT,
    STUDY_GUIDE_FORMAT,
    SUMMARY_FORMAT,
    SYSTEM_PROMPT,
)

DEFAULT_SUMMARY_QUERY = "Summarize al sources"
DEFAULT_STUDY_GUIDE_QUERY = "Create a study guide based on all sources"
DEFAULT_QA_QUERY = "Create Q&A based on all sources"


router = APIRouter()


async def get_study_guide_query(research_id: str) -> str:
    return await generate_query(
        research_id=research_id,
        default_query=DEFAULT_STUDY_GUIDE_QUERY,
        format_template=STUDY_GUIDE_FORMAT,
        prompt="Using the following sources to generate a comprehensive study guide:\n",
    )


async def get_summarization_query(research_id: str) -> str:
    return await generate_query(
        research_id=research_id,
        default_query=DEFAULT_SUMMARY_QUERY,
        format_template=SUMMARY_FORMAT,
        prompt="Analyze and synthesize the following sources in detail:\n",
    )


async def get_qa_query(research_id: str) -> str:
    return await generate_query(
        research_id=research_id,
        default_query=DEFAULT_QA_QUERY,
        format_template=QA_FORMAT,
        prompt="Generate Q&A based on the following sources:\n",
    )


async def get_sources_list(research_id: str) -> List[str] | None:
    if not research_id or not ObjectId.is_valid(research_id):
        return None

    research_id_obj = ObjectId(research_id)
    research = await research_collection.find_one({"_id": research_id_obj})

    if not research or not research.get("sources"):
        return None

    def extract_source_name(source: dict) -> str:
        return source.get("filename") or source.get("url", "")

    return [extract_source_name(source) for source in research["sources"]]


async def generate_query(
    research_id: str, default_query: str, format_template: str, prompt: str
) -> str:
    sources_names = await get_sources_list(research_id)
    if not sources_names:
        return default_query

    sources_str = "\n- ".join(sources_names)

    query = f"""{prompt}

- {sources_str}

{format_template}
"""

    return query


# TODO: Use agent
# TODO: Transform query
# TODO: Use proper summary index and Improve summary generation
@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        research_id = request.research_id
        query = request.query

        vector_store = QdrantVectorStore(
            client=qdrant_client, collection_name=research_id
        )

        if query.strip().lower() == "summarize sources":
            query = await get_summarization_query(research_id=research_id)
        elif query.strip().lower() == "create a study guide":
            query = await get_study_guide_query(research_id=research_id)
        elif query.strip().lower() == "create q&a":  # Add this condition
            query = await get_qa_query(research_id=research_id)

        logging.info(f"Chat query: {query}")

        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(
            vector_store, storage_context=storage_context
        )

        chat_memory = ChatMemoryBuffer.from_defaults(
            token_limit=512,
            chat_store=redis_chat_store,
            chat_store_key=research_id,
        )

        chat_engine = index.as_chat_engine(
            memory=chat_memory,
            chat_mode=ChatMode.CONTEXT,
            system_prompt=SYSTEM_PROMPT,
            context_template=CONTEXT_PROMPT_TEMPLATE,
        )

        response = chat_engine.chat(query)

        return {"response": response.response}
    except Exception as e:
        logger.error(f"Error processing chat query: {e}")
        raise HTTPException(status_code=500, detail="Error processing chat query")


@router.get("/chat/{research_id}")
async def get_all_chat(research_id: str = Path(...)):
    try:
        messages = await redis_chat_store.aget_messages(key=research_id)
        return messages
    except Exception as e:
        logger.error(f"Error processing chat query: {e}")
        raise HTTPException(status_code=500, detail="Error processing chat query")


@router.get("/chat/suggestions/{research_id}")
async def generate_suggestions(research_id: str = Path(...)):
    try:
        vector_store = QdrantVectorStore(
            client=qdrant_client, collection_name=research_id
        )

        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(
            vector_store, storage_context=storage_context
        )

        sources_list = await get_sources_list(research_id=research_id)
        sources = "\n- ".join(sources_list)

        messages = await redis_chat_store.aget_messages(key=research_id)
        token_count = 0
        limited_messages = []

        for message in reversed(messages):
            message_tokens = len(message.content.split()) * 1.3
            if token_count + message_tokens > 512:
                break
            limited_messages.insert(0, message)
            token_count += message_tokens

        messages = limited_messages

        query_engine = index.as_query_engine()

        chat_history = "\n".join([f"- {message.content}" for message in messages])

        query = (
            "Please generate three one-line follow up questions strictly based on the following sources and chat history:\n\n"
            f"Sources:\n-{sources}\n\n"
            f"Chat history:\n{chat_history}\n\n"
            "Each question should be concise, focus on a specific aspect of the information provided, "
            "and be formulated in less than 6 words."
            "Strictly only respond with questions and nothing else. Don't mention question number."
        )

        logger.info(f"Generating questions: {query}")

        response = query_engine.query(query)

        return {"response": response.response}

    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        raise HTTPException(status_code=500, detail="Error generating questions")
