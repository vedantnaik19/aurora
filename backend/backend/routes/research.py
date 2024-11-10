from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Path, Query

from backend.config import logger
from backend.database import qdrant_client, redis_chat_store, research_collection
from backend.models import PaginatedResearch, Research, UpdateResearch

router = APIRouter()


@router.post("/research")
async def create_research():
    try:
        title = f"Untitled Research - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
        research = {
            "title": title,
            "created_at": datetime.utcnow().isoformat(),
            "sources": [],
        }
        result = await research_collection.insert_one(research)

        return {"id": str(result.inserted_id), "title": title}
    except Exception as e:
        logger.error(f"Error creating research: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research", response_model=PaginatedResearch)
async def get_all_research(
    page: int = Query(default=1, ge=1), page_size: int = Query(default=10, ge=1, le=100)
):
    try:
        skip = (page - 1) * page_size
        total = await research_collection.count_documents({})

        cursor = (
            research_collection.find({})
            .sort("created_at", -1)
            .skip(skip)
            .limit(page_size)
        )

        research_list = []
        async for doc in cursor:
            research_list.append(
                {
                    "id": str(doc["_id"]),
                    "title": doc["title"],
                    "created_at": doc["created_at"],
                }
            )

        return {
            "items": research_list,
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    except Exception as e:
        logger.error(f"Error fetching research: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error fetching research: {str(e)}"
        )


@router.get("/research/{research_id}", response_model=Research)
async def get_research(research_id: str = Path(...)):
    try:
        # Validate ObjectId
        try:
            research_id_obj = ObjectId(research_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid research ID format")

        research_doc = await research_collection.find_one({"_id": research_id_obj})
        if not research_doc:
            raise HTTPException(status_code=404, detail="Research not found")

        # Convert to model using from_mongo
        research = Research.from_mongo(research_doc)
        if not research:
            raise HTTPException(
                status_code=500, detail="Error converting research document"
            )

        return research

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching research: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/research/{research_id}", response_model=Research)
async def update_research(
    research_id: str = Path(...), update_data: UpdateResearch = None
):
    try:
        result = await research_collection.find_one_and_update(
            {"_id": ObjectId(research_id)},
            {"$set": {"title": update_data.title}},
            return_document=True,
        )
        if result is None:
            raise HTTPException(status_code=404, detail="Research not found")
        return {
            "id": str(result["_id"]),
            "title": result["title"],
            "created_at": result["created_at"],
        }
    except Exception as e:
        logger.error(f"Error updating research: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error updating research: {str(e)}"
        )


@router.delete("/research/{research_id}")
async def delete_research(research_id: str = Path(...)):
    try:
        # Validate ObjectId
        try:
            research_id_obj = ObjectId(research_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid research ID format")

        # Delete from MongoDB
        result = await research_collection.delete_one({"_id": research_id_obj})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Research not found")

        # Delete Qdrant collection
        try:
            qdrant_client.delete_collection(research_id)
        except Exception as e:
            logger.error(f"Error deleting Qdrant collection: {e}")
            # Continue even if Qdrant deletion fails

        # Delete Redis chat history
        try:
            await redis_chat_store.adelete_messages(key=research_id)
        except Exception as e:
            logger.error(f"Error deleting Redis chat history: {e}")
            # Continue even if Redis deletion fails

        return {"message": "Research deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting research: {e}")
        raise HTTPException(status_code=500, detail=str(e))
