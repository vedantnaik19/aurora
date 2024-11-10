import base64
import os
from datetime import datetime
from typing import List, Optional

import aiohttp
import requests
from crawl4ai import AsyncWebCrawler
from llama_index.core import Document

from backend.config import logger
from backend.models import SourceType

# NVIDIA API Configuration
INVOKE_URL = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"

API_KEY = os.getenv("NVIDIA_API_KEY")


def is_valid_base64(s: str) -> bool:
    """Check if a string is a valid base64 encoding."""
    try:
        # Check if string starts with common base64 image prefixes
        if s.startswith(("data:image", "iVBOR", "/9j/")):
            # Remove data URL prefix if present
            if s.startswith("data:image"):
                s = s.split(",")[1]
            # Try to decode
            base64.b64decode(s)
            return True
        return False
    except Exception:
        return False


async def url_to_base64(url: str) -> Optional[str]:
    """Convert an image URL to base64 encoding."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=30) as response:
                if response.status == 200:
                    image_data = await response.read()
                    if not isinstance(image_data, bytes):
                        logger.error(
                            f"Expected bytes from {url}, got {type(image_data)}"
                        )
                        return None
                    return base64.b64encode(image_data).decode("utf-8")
    except Exception as e:
        logger.error(f"Failed to fetch image from {url}: {str(e)}")
    return None


async def process_image(
    src: str, reference_id: str, url: str, research_id: str
) -> Optional[Document]:
    # Updated to use module-level API config
    try:
        # If it's already base64, use it directly
        if is_valid_base64(src):
            image_data = src
        else:
            # Otherwise fetch and convert to base64
            image_data = await url_to_base64(src)

        if not image_data:
            return None

        headers = {"Authorization": f"Bearer {API_KEY}", "Accept": "application/json"}

        payload = {
            "model": "meta/llama-3.2-11b-vision-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": f'What is in this image? <img src="data:image/png;base64,{image_data}" />',
                }
            ],
            "max_tokens": 1024,
            "temperature": 1.00,
            "top_p": 1.00,
            "stream": False,
        }
        response = requests.post(INVOKE_URL, headers=headers, json=payload)
        image_description = response.json()["choices"][0]["message"]["content"]

        logger.info(f"Image description: {image_description}")

        return Document(
            text=f"This is an image from url - {url}, with the following description: \n{image_description}",
            metadata={
                "source": url,
                "reference_id": reference_id,
                "url": url,
                "research_id": research_id,
                "source_type": SourceType.LINK.value,
                "created_at": datetime.utcnow().isoformat(),
            },
        )
    except Exception as e:
        logger.error(f"Failed to process image {src[:50]}...: {str(e)}")
        return None


async def process_url(url: str, research_id: str, reference_id: str) -> List[Document]:

    if not url or not url.strip():
        raise ValueError("URL cannot be empty")
    if not research_id or not reference_id:
        raise ValueError("Research ID and Reference ID must be provided")

    documents = []
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(url=url)
        if not result.success:
            logger.error(f"Failed to crawl {url}: {result.error_message}")
            raise Exception(f"Could not parse {url}: {result.error_message}")

        # Add main content document
        documents.append(
            Document(
                text=result.markdown,
                metadata={
                    "reference_id": reference_id,
                    "url": url,
                    "research_id": research_id,
                    "source_type": SourceType.LINK.value,
                    "created_at": datetime.utcnow().isoformat(),
                },
            )
        )

        # Process images
        if result.media.get("images", None):
            logger.info(f"Processing {len(result.media['images'])} images")
            for image in result.media["images"]:
                if image.get("score", 0) < 4:
                    continue

                src = image.get("src", "")
                if not src:
                    continue

                if src.startswith("https://"):
                    doc = await process_image(src, reference_id, url, research_id)
                    if doc:
                        documents.append(doc)
                else:
                    logger.info(f"Skipping invalid image source: {src[:50]}...")

        return documents
