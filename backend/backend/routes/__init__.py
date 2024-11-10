from fastapi import APIRouter

from .chat import router as chat_router
from .notes import router as notes_router
from .research import router as research_router
from .source import router as source_router

router = APIRouter()
router.include_router(research_router, tags=["research"])
router.include_router(source_router, tags=["sources"])
router.include_router(chat_router, tags=["chat"])
router.include_router(notes_router, tags=["notes"])
