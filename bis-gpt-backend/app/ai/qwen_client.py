import json
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class BaseLLMClient(ABC):
    """Abstract interface for LLM inference (supports vLLM, Ollama, QLoRA endpoints, or mock)."""

    @abstractmethod
    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 1024,
        response_format: Optional[Dict[str, Any]] = None,
    ) -> str:
        pass


class QwenVLLMClient(BaseLLMClient):
    """Client for Qwen2.5-7B-Instruct served via vLLM (OpenAI-compatible /v1/chat/completions)."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.base_url = (base_url or settings.QWEN_API_BASE_URL).rstrip("/")
        self.api_key = api_key or settings.QWEN_API_KEY
        self.model_name = model_name or settings.QWEN_MODEL_NAME
        self.timeout = timeout

    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 1024,
        response_format: Optional[Dict[str, Any]] = None,
    ) -> str:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        payload: Dict[str, Any] = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if response_format:
            payload["response_format"] = response_format

        endpoint = f"{self.base_url}/chat/completions"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.warning(
                        f"vLLM returned status {response.status_code}: {response.text}. Using fallback."
                    )
                    return self._generate_fallback_response(messages)
        except Exception as e:
            logger.info(f"vLLM endpoint ({endpoint}) unreachable: {e}. Utilizing built-in BIS response generator.")
            return self._generate_fallback_response(messages)

    def _generate_fallback_response(self, messages: List[Dict[str, str]]) -> str:
        """Local fallback when vLLM GPU inference service is not running."""
        last_user_msg = ""
        for m in reversed(messages):
            if m["role"] == "user":
                last_user_msg = m["content"]
                break

        q = last_user_msg.lower()

        # Gold hallmarking inquiry
        if any(w in q for w in ["gold", "jewel", "hallmark", "huid", "carat", "karat"]):
            return (
                "Under Indian Standard **IS 1417:2016**, gold jewellery sold in notified districts across India "
                "must carry 3 mandatory marks: (1) BIS Triangle Logo, (2) Purity in Karat and Fineness (e.g. 22K916, 18K750, 14K585), "
                "and (3) a unique 6-digit alphanumeric HUID code laser-etched by an authorized AHC. "
                "Consumers can verify the authenticity of any HUID on the official BIS Care mobile app under 'Verify HUID'."
            )

        # Drinking water inquiry
        if "water" in q:
            return (
                "Packaged Drinking Water is governed by **IS 14543:2016** (and potable water by **IS 10500:2012**). "
                "Certification under Scheme-I (ISI Mark) is strictly mandatory under the *Packaged Drinking Water Quality Control Order*. "
                "Key testing includes microbiological safety (E. coli, coliforms), toxic heavy metals (Lead, Cadmium, Arsenic), "
                "and pesticide residues. Recommended testing facilities include the BIS Central Laboratory in Sahibabad."
            )

        # Helmets inquiry
        if "helmet" in q:
            return (
                "Protective Helmets for two-wheeler riders are governed by **IS 4151:2015**. "
                "Certification with the ISI mark is compulsory under the *Helmet for Two Wheeler Riders (Quality Control) Order* "
                "issued by the Ministry of Road Transport and Highways (MoRTH). Selling uncertified helmets is prohibited."
            )

        # Lithium Batteries
        if any(w in q for w in ["battery", "batteries", "lithium", "power bank"]):
            return (
                "Secondary lithium cells and batteries are governed by **IS 16046 (Part 1 & 2):2018**. "
                "They fall under the Compulsory Registration Scheme (CRS Scheme-II) mandated by MeitY. "
                "Manufacturers must obtain an R-Number by submitting test reports from a BIS-recognized NABL laboratory."
            )

        # General response
        return (
            f"Regarding your inquiry on \"{last_user_msg}\": Please review the relevant Indian Standards on the official "
            "Manakonline portal (manakonline.in). Ensure compliance with applicable Quality Control Orders (QCOs) "
            "and engage recognized BIS testing laboratories for pre-certification sample evaluation."
        )


# Global singleton client
qwen_client = QwenVLLMClient()
