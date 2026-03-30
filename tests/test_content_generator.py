"""
Tests for agent/content_generator.py
"""
import unittest

from agent.config import OpenAIConfig
from agent.content_generator import ContentGenerator, ContentRequest


class TestContentGeneratorTemplates(unittest.TestCase):
    """Tests using the template fallback (no OpenAI key required)."""

    def setUp(self):
        # Use template fallback by providing no API key
        self.gen = ContentGenerator(OpenAIConfig(api_key=""))

    def test_generate_returns_content(self):
        req = ContentRequest(
            content_type="blog_post",
            topic="noise-cancelling headphones",
            target_audience="remote workers",
            keywords=["best headphones", "noise cancelling"],
        )
        content = self.gen.generate(req)
        self.assertIsInstance(content.title, str)
        self.assertTrue(len(content.title) > 0)
        self.assertIsInstance(content.body, str)
        self.assertTrue(len(content.body) > 0)
        self.assertEqual(content.content_type, "blog_post")

    def test_generate_includes_affiliate_product(self):
        req = ContentRequest(
            content_type="product_review",
            topic="wireless earbuds",
            target_audience="gym goers",
            affiliate_product="Sony WF-1000XM5",
        )
        content = self.gen.generate(req)
        self.assertIn("Sony WF-1000XM5", content.body)

    def test_meta_description_max_160_chars(self):
        req = ContentRequest(
            content_type="blog_post",
            topic="very long topic name " * 10,
            target_audience="everyone",
            keywords=["kw1", "kw2"],
        )
        content = self.gen.generate(req)
        self.assertLessEqual(len(content.meta_description), 160)

    def test_generate_ad_headlines_count(self):
        headlines = self.gen.generate_ad_headlines("running shoes", ["fast", "comfortable"], count=5)
        self.assertLessEqual(len(headlines), 5)
        for h in headlines:
            self.assertLessEqual(len(h), 30, f"Headline too long: {h!r}")

    def test_generate_ad_descriptions_count(self):
        descs = self.gen.generate_ad_descriptions("running shoes", ["fast", "comfortable"], count=3)
        self.assertLessEqual(len(descs), 3)
        for d in descs:
            self.assertLessEqual(len(d), 90, f"Description too long: {d!r}")

    def test_generate_ad_headlines_default_count(self):
        headlines = self.gen.generate_ad_headlines("laptop", [])
        self.assertTrue(len(headlines) > 0)


if __name__ == "__main__":
    unittest.main()
