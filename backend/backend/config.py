import os
from dotenv import load_dotenv
import logging
from llama_index.core import Settings
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.embeddings.fastembed import FastEmbedEmbedding
from llama_index.llms.nvidia import NVIDIA

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# NIM
NIM_VISION_INVOKE_URL = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-90b-vision-instruct/chat/completions"
NIM_VISION_MODEL = "meta/llama-3.2-90b-vision-instruct"

# Settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@mongodb:27017")
REDIS_URI = os.getenv("REDIS_URI", "redis://redis:6379")
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))

# Model settings
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
if not NVIDIA_API_KEY:
    logger.error("NVIDIA_API_KEY not found in environment variables")
    raise ValueError("NVIDIA_API_KEY is required")

EMBED_MODEL = os.getenv("EMBED_MODEL", "nvidia/nv-embedqa-e5-v5")
LLM_MODEL = os.getenv("LLM_MODEL", "meta/llama-3.1-70b-instruct")

# LlamaIndex settings
Settings.embed_model = NVIDIAEmbedding(
    model=EMBED_MODEL, truncate="END", api_key=NVIDIA_API_KEY
)
# Settings.embed_model = FastEmbedEmbedding()
Settings.llm = NVIDIA(model=LLM_MODEL, api_key=NVIDIA_API_KEY, temperature=0.2)
Settings.chunk_size = 1024
Settings.chunk_overlap = 20
