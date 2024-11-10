from bson import ObjectId
from fastapi import APIRouter, HTTPException

from backend.config import logger
from backend.database import research_collection
from backend.models import NoteRequest

router = APIRouter()


@router.post("/note")
async def add_note(request: NoteRequest):
    try:
        research_id = request.research_id
        title = request.title
        content = request.content
        note_id = ObjectId()

        await research_collection.update_one(
            {"_id": ObjectId(research_id)},
            {
                "$push": {
                    "notes": {"id": str(note_id), "title": title, "content": content}
                }
            },
        )
        return {
            "id": str(note_id),
            "title": title,
            "content": content,
            "research_id": research_id,
        }
    except Exception as e:
        logger.error(f"Error while adding note: {e}")
        raise HTTPException(status_code=500, detail="Error while adding note")


@router.get("/notes/{research_id}")
async def get_notes(research_id: str):
    try:
        research = await research_collection.find_one({"_id": ObjectId(research_id)})
        if not research:
            raise HTTPException(status_code=404, detail="Research not found")

        notes = research.get("notes", [])
        # Convert ObjectId to string in notes
        for note in notes:
            if isinstance(note.get("id"), ObjectId):
                note["id"] = str(note["id"])
        return notes
    except Exception as e:
        logger.error(f"Error while fetching notes: {e}")
        raise HTTPException(status_code=500, detail="Error while fetching notes")


@router.delete("/note/{research_id}/{note_id}")
async def delete_note(research_id: str, note_id: str):
    logger.info(f"Deleting note. Research ID: {research_id}, Note ID: {note_id}")
    result = await research_collection.update_one(
        {"_id": ObjectId(research_id)},
        {
            "$pull": {"notes": {"id": note_id}}
        },  # Changed from ObjectId(note_id) to note_id
    )

    if result.modified_count == 0:
        logger.error(
            f"Note not deleted. Research ID: {research_id}, Note ID: {note_id}"
        )
        raise HTTPException(status_code=404, detail="Note could not be deleted")

    return {"message": "Note deleted successfully"}
