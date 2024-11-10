from motor.motor_asyncio import AsyncIOMotorClient
from qdrant_client import QdrantClient
from .config import MONGO_URI, QDRANT_HOST, QDRANT_PORT, logger, REDIS_URI
from llama_index.storage.chat_store.redis import RedisChatStore

try:
    # MongoDB initialization
    mongo_client = AsyncIOMotorClient(MONGO_URI)
    db = mongo_client.aurora
    research_collection = db.research

    # Vector store initialization
    qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

    # Chat store initialization
    redis_chat_store = RedisChatStore(redis_url=REDIS_URI)

except Exception as e:
    logger.error(f"Failed to connect to databases: {e}")
    raise
