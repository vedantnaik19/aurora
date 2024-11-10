import aiohttp
from backend.config import (
    NVIDIA_API_KEY,
    NIM_VISION_INVOKE_URL,
    NIM_VISION_MODEL,
    logger,
)


async def nim_vision_analysis(content: str) -> str | None:
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
    }

    payload = {
        "model": NIM_VISION_MODEL,
        "messages": [
            {
                "role": "user",
                "content": content,
            }
        ],
        "max_tokens": 1024,
        "temperature": 0.20,
        "top_p": 0.70,
        "stream": False,
    }
    
    logger.info(f"Sending vision analysis request: {payload}")

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                NIM_VISION_INVOKE_URL, headers=headers, json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Vision API error: {response.status} - {error_text}")
                    raise Exception(f"Vision API returned status {response.status}")

                result = await response.json()
                logger.debug(f"Raw vision analysis result: {result}")

                return result["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Vision analysis failed: {str(e)}")
        return None
