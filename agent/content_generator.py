"""
AI-powered content generation module.
Generates ad copy, landing-page text, blog posts, and social media content
to support Google Ads campaigns and affiliate marketing funnels.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from typing import List, Optional

from .config import OpenAIConfig

logger = logging.getLogger(__name__)


@dataclass
class ContentRequest:
    content_type: str          # "ad_copy" | "blog_post" | "social_post" | "email" | "product_review"
    topic: str
    target_audience: str
    keywords: List[str] = field(default_factory=list)
    tone: str = "professional"
    word_count: int = 300
    affiliate_product: Optional[str] = None
    call_to_action: Optional[str] = None


@dataclass
class GeneratedContent:
    title: str
    body: str
    meta_description: str
    cta: str
    keywords_used: List[str]
    content_type: str


class ContentGenerator:
    """
    Uses the OpenAI API to generate marketing content.
    Falls back to template-based generation when OpenAI is not configured.
    """

    SYSTEM_PROMPT = (
        "You are an expert digital-marketing copywriter specialising in Google Ads, "
        "SEO, affiliate marketing, and conversion-rate optimisation. "
        "Produce compelling, accurate content that drives clicks and conversions. "
        "Always respond with a valid JSON object matching the requested schema."
    )

    def __init__(self, config: OpenAIConfig) -> None:
        self.config = config
        self._client: Optional[object] = None

        if config.is_configured():
            try:
                import openai  # type: ignore
                self._client = openai.OpenAI(api_key=config.api_key)
                logger.info("OpenAI client initialised (model=%s)", config.model)
            except ImportError:
                logger.warning("openai package not installed – falling back to templates")
        else:
            logger.warning("OpenAI not configured – using template-based generation")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def generate(self, request: ContentRequest) -> GeneratedContent:
        if self._client:
            return self._generate_with_openai(request)
        return self._generate_from_template(request)

    def generate_ad_headlines(self, product: str, keywords: List[str], count: int = 15) -> List[str]:
        """Return up to *count* Google-Ads-style short headlines (≤30 chars each)."""
        if self._client:
            return self._openai_headlines(product, keywords, count)
        return self._template_headlines(product, keywords, count)

    def generate_ad_descriptions(self, product: str, keywords: List[str], count: int = 4) -> List[str]:
        """Return up to *count* Google-Ads descriptions (≤90 chars each)."""
        if self._client:
            return self._openai_descriptions(product, keywords, count)
        return self._template_descriptions(product, keywords, count)

    # ------------------------------------------------------------------
    # OpenAI helpers
    # ------------------------------------------------------------------

    def _generate_with_openai(self, request: ContentRequest) -> GeneratedContent:
        schema = {
            "title": "string",
            "body": "string",
            "meta_description": "string (≤160 chars)",
            "cta": "string",
            "keywords_used": ["string"],
        }
        user_prompt = (
            f"Create a {request.content_type} about '{request.topic}'.\n"
            f"Target audience: {request.target_audience}\n"
            f"Tone: {request.tone}\n"
            f"Approximate word count: {request.word_count}\n"
            f"Keywords to include: {', '.join(request.keywords)}\n"
            + (f"Affiliate product: {request.affiliate_product}\n" if request.affiliate_product else "")
            + (f"Call to action: {request.call_to_action}\n" if request.call_to_action else "")
            + f"\nRespond ONLY with a JSON object matching this schema:\n{json.dumps(schema, indent=2)}"
        )
        try:
            response = self._client.chat.completions.create(  # type: ignore[union-attr]
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content)
            return GeneratedContent(
                title=data.get("title", ""),
                body=data.get("body", ""),
                meta_description=data.get("meta_description", ""),
                cta=data.get("cta", ""),
                keywords_used=data.get("keywords_used", request.keywords),
                content_type=request.content_type,
            )
        except Exception as exc:
            logger.error("OpenAI content generation failed: %s", exc)
            return self._generate_from_template(request)

    def _openai_headlines(self, product: str, keywords: List[str], count: int) -> List[str]:
        prompt = (
            f"Generate {count} Google Ads headlines for '{product}'. "
            f"Each headline must be ≤30 characters. Keywords: {', '.join(keywords)}. "
            "Respond ONLY with a JSON object: {\"headlines\": [\"...\", ...]}"
        )
        try:
            response = self._client.chat.completions.create(  # type: ignore[union-attr]
                model=self.config.model,
                max_tokens=512,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content)
            return [h[:30] for h in data.get("headlines", [])][:count]
        except Exception as exc:
            logger.error("OpenAI headline generation failed: %s", exc)
            return self._template_headlines(product, keywords, count)

    def _openai_descriptions(self, product: str, keywords: List[str], count: int) -> List[str]:
        prompt = (
            f"Generate {count} Google Ads descriptions for '{product}'. "
            f"Each description must be ≤90 characters. Keywords: {', '.join(keywords)}. "
            "Respond ONLY with a JSON object: {\"descriptions\": [\"...\", ...]}"
        )
        try:
            response = self._client.chat.completions.create(  # type: ignore[union-attr]
                model=self.config.model,
                max_tokens=512,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content)
            return [d[:90] for d in data.get("descriptions", [])][:count]
        except Exception as exc:
            logger.error("OpenAI description generation failed: %s", exc)
            return self._template_descriptions(product, keywords, count)

    # ------------------------------------------------------------------
    # Template-based fallback helpers
    # ------------------------------------------------------------------

    def _generate_from_template(self, request: ContentRequest) -> GeneratedContent:
        keyword_str = ", ".join(request.keywords[:5])
        title = f"Top {request.topic} Guide for {request.target_audience}"
        meta = f"Discover the best {request.topic} tips. {keyword_str}."[:160]
        cta = request.call_to_action or f"Learn more about {request.topic} today!"
        body = (
            f"# {title}\n\n"
            f"Are you looking for the best {request.topic}? "
            f"This guide covers everything {request.target_audience} need to know.\n\n"
            f"## Key Benefits\n\n"
            f"- Proven strategies for {request.topic}\n"
            f"- Tailored for {request.target_audience}\n"
            f"- Actionable tips you can use today\n\n"
            f"## Get Started\n\n"
            f"{cta}"
        )
        if request.affiliate_product:
            body += f"\n\nCheck out **{request.affiliate_product}** – our top recommendation."
        return GeneratedContent(
            title=title,
            body=body,
            meta_description=meta,
            cta=cta,
            keywords_used=request.keywords,
            content_type=request.content_type,
        )

    def _template_headlines(self, product: str, keywords: List[str], count: int) -> List[str]:
        templates = [
            f"Best {product}",
            f"Top {product} Deals",
            f"Buy {product} Now",
            f"{product} – Save Today",
            f"Affordable {product}",
            f"#1 Rated {product}",
            f"Shop {product} Online",
            f"Get {product} Fast",
            f"Quality {product}",
            f"Trusted {product}",
        ]
        if keywords:
            templates += [f"{kw} {product}"[:30] for kw in keywords[:5]]
        return [h[:30] for h in templates[:count]]

    def _template_descriptions(self, product: str, keywords: List[str], count: int) -> List[str]:
        templates = [
            f"Find the best {product} at great prices. Shop now!",
            f"High-quality {product} with fast delivery. Order today.",
            f"Compare top {product} options. Limited-time deals available.",
            f"Expert-reviewed {product}. Start saving today!",
        ]
        return [d[:90] for d in templates[:count]]
