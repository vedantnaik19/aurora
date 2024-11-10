from datetime import datetime
from typing import Dict, List

from bson import ObjectId
from fastapi import APIRouter, File, HTTPException, Path, UploadFile
from llama_index.core import StorageContext, VectorStoreIndex
from llama_index.core.vector_stores.types import (
    FilterOperator,
    MetadataFilter,
    MetadataFilters,
)
from llama_index.vector_stores.qdrant import QdrantVectorStore
from pydantic import HttpUrl

from backend.config import logger
from backend.database import qdrant_client, research_collection
from backend.models import FileSource, FileSourcesResponse, SourceType, URLRequest
from backend.processors.process_files import process_files
from backend.processors.process_url import process_url

router = APIRouter()


async def add_source_to_mongodb(
    research_id: str,
    reference_id: str,
    url: str = None,
    filename: str = None,
    source_type: SourceType = None,
) -> None:
    source_data = {
        "reference_id": reference_id,
        "type": source_type.value,
        "created_at": datetime.utcnow().isoformat(),
    }
    if url:
        source_data["url"] = url
    if filename:
        source_data["filename"] = filename

    await research_collection.update_one(
        {"_id": ObjectId(research_id)},
        {"$push": {"sources": source_data}},
    )


async def remove_source_from_mongodb(research_id: str, reference_id: str) -> bool:
    try:
        research_id_obj = ObjectId(research_id)
        result = await research_collection.update_one(
            {"_id": research_id_obj},
            {"$pull": {"sources": {"reference_id": reference_id}}},
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error removing source: {e}", exc_info=True)
        return False


async def process_link_source(research_id: str, url: HttpUrl) -> Dict[str, str]:
    url_str = str(url)
    reference_id = str(ObjectId())

    try:
        research = await research_collection.find_one({"_id": ObjectId(research_id)})
        if not research:
            raise HTTPException(status_code=404, detail="Research not found")

        documents = await process_url(
            url=url_str, research_id=research_id, reference_id=reference_id
        )
        if not documents:
            raise ValueError("No content could be extracted from URL")

        vector_store = QdrantVectorStore(
            client=qdrant_client, collection_name=research_id
        )

        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        VectorStoreIndex.from_documents(
            documents=documents,
            storage_context=storage_context,
        )

        await add_source_to_mongodb(
            research_id, reference_id, url_str, source_type=SourceType.LINK
        )

        return {"reference_id": reference_id}

    except Exception as e:
        logger.error(f"Error processing URL {url_str}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing URL: {str(e)}")


@router.post("/research/{research_id}/sources/link")
async def add_source(
    research_id: str = Path(...), url_request: URLRequest = None
) -> Dict[str, str]:
    try:
        result = await process_link_source(research_id, url_request.url)
        return {
            "message": "URL processed successfully",
            "reference_id": result["reference_id"],
        }
    except Exception as e:
        logger.error(f"Error adding source: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/research/{research_id}/sources/files", response_model=FileSourcesResponse
)
async def add_file_sources(
    research_id: str = Path(...), files: List[UploadFile] = File(...)
) -> FileSourcesResponse:
    try:
        processed_files = []
        for file in files:
            reference_id = str(ObjectId())
            documents = await process_files(
                files=[file], research_id=research_id, reference_id=reference_id
            )

            if not documents:
                logger.error("No content could be extracted from files")
                continue

            vector_store = QdrantVectorStore(
                client=qdrant_client, collection_name=research_id
            )

            storage_context = StorageContext.from_defaults(vector_store=vector_store)

            VectorStoreIndex.from_documents(
                documents=documents,
                storage_context=storage_context,
            )

            await add_source_to_mongodb(
                research_id,
                reference_id,
                filename=file.filename,
                source_type=SourceType.FILE,
            )

            processed_files.append(
                FileSource(
                    filename=file.filename,
                    research_id=research_id,
                    reference_id=reference_id,
                )
            )

        return {"message": "Files processed successfully", "files": processed_files}

    except Exception as e:
        logger.error(f"Error adding file sources: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research/{research_id}/sources")
async def get_sources(research_id: str = Path(...)):
    try:
        research_id_obj = ObjectId(research_id)
        research = await research_collection.find_one({"_id": research_id_obj})

        if not research:
            raise HTTPException(status_code=404, detail="Research not found")

        sources = research.get("sources", [])
        return sources if sources else []

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sources: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/research/{research_id}/sources/{reference_id}")
async def delete_source(research_id: str = Path(...), reference_id: str = Path(...)):
    try:
        logger.info(
            f"Delete source request - Research ID: {research_id}, Reference ID: {reference_id}"
        )

        try:
            research_id_obj = ObjectId(research_id)
        except Exception as e:
            logger.error(f"Invalid research ID format: {research_id}")
            raise HTTPException(status_code=400, detail="Invalid research ID format")

        research = await research_collection.find_one({"_id": research_id_obj})
        if not research:
            logger.error(f"Research not found: {research_id}")
            raise HTTPException(status_code=404, detail="Research not found")

        # Delete from MongoDB first
        removed = await remove_source_from_mongodb(research_id, reference_id)
        if not removed:
            logger.error(f"Source not found in MongoDB: {reference_id}")
            raise HTTPException(status_code=404, detail="Source not found")

        # Delete from Qdrant if collection exists
        if qdrant_client.collection_exists(research_id):
            try:
                vector_store = QdrantVectorStore(
                    client=qdrant_client, collection_name=research_id
                )

                filters = MetadataFilters(
                    filters=[
                        MetadataFilter(
                            key="reference_id",
                            operator=FilterOperator.EQ,
                            value=reference_id,
                        ),
                    ]
                )

                vector_store.delete_nodes(filters=filters)

                logger.info(
                    f"Successfully deleted vectors for reference_id: {reference_id}"
                )
            except Exception as e:
                logger.error(f"Error deleting from Qdrant: {e}", exc_info=True)
                # Don't raise here since MongoDB deletion was successful
        else:
            logger.warning(f"Qdrant collection not found: {research_id}")

        return {"message": "Source deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting source: {e}")
        raise HTTPException(status_code=500, detail=str(e))
