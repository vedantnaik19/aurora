from datetime import datetime
from enum import Enum
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, HttpUrl


class SourceType(str, Enum):
    LINK = "link"
    FILE = "file"


class URLRequest(BaseModel):
    url: HttpUrl


class UpdateResearch(BaseModel):
    title: str


class Source(BaseModel):
    model_config = ConfigDict(json_encoders={datetime: lambda dt: dt.isoformat()})

    research_id: str
    reference_id: str
    type: SourceType
    url: Optional[str] = None
    filename: Optional[str] = None  # Add this field
    file_type: Optional[str] = None  # Add this field
    created_at: datetime


class Research(BaseModel):
    model_config = ConfigDict(
        json_encoders={ObjectId: str, datetime: lambda dt: dt.isoformat()},
        from_attributes=True,
        populate_by_name=True,
    )

    id: str
    title: str
    created_at: datetime
    sources: List[Source] = []

    @classmethod
    def from_mongo(cls, mongo_doc):
        """Convert MongoDB document to Research model."""
        if mongo_doc is None:
            return None

        return cls(
            id=str(mongo_doc["_id"]),
            title=mongo_doc["title"],
            created_at=mongo_doc["created_at"],
        )


class PaginatedResearch(BaseModel):
    items: List[Research]
    total: int
    page: int
    page_size: int


class FileSource(BaseModel):
    filename: str
    research_id: str
    reference_id: str


class FileSourcesResponse(BaseModel):
    message: str = "Files processed successfully"
    files: List[FileSource]


class ChatRequest(BaseModel):
    query: str
    research_id: str


class NoteRequest(BaseModel):
    title: Optional[str]
    content: str
    research_id: str
