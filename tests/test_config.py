"""
Tests for agent/config.py
"""
import os
import unittest


class TestAgentConfig(unittest.TestCase):
    def test_defaults(self):
        from agent.config import AgentConfig
        cfg = AgentConfig()
        self.assertIsInstance(cfg.cycle_interval_seconds, int)
        self.assertIsInstance(cfg.min_roas_threshold, float)
        self.assertIsInstance(cfg.max_cpc_usd, float)
        self.assertTrue(cfg.dry_run, "dry_run should default to True")

    def test_dry_run_false_via_env(self):
        os.environ["AGENT_DRY_RUN"] = "false"
        try:
            from agent import config as cfg_module
            import importlib
            importlib.reload(cfg_module)
            from agent.config import AgentConfig
            cfg = AgentConfig()
            self.assertFalse(cfg.dry_run)
        finally:
            del os.environ["AGENT_DRY_RUN"]

    def test_google_ads_not_configured_when_empty(self):
        from agent.config import GoogleAdsConfig
        cfg = GoogleAdsConfig()
        self.assertFalse(cfg.is_configured())

    def test_google_ads_configured_when_all_set(self):
        from agent.config import GoogleAdsConfig
        cfg = GoogleAdsConfig(
            developer_token="tok",
            client_id="cid",
            client_secret="sec",
            refresh_token="ref",
            customer_id="123",
        )
        self.assertTrue(cfg.is_configured())

    def test_openai_not_configured_when_empty(self):
        from agent.config import OpenAIConfig
        cfg = OpenAIConfig(api_key="")
        self.assertFalse(cfg.is_configured())

    def test_openai_configured_when_key_set(self):
        from agent.config import OpenAIConfig
        cfg = OpenAIConfig(api_key="sk-test-key")
        self.assertTrue(cfg.is_configured())

    def test_affiliate_amazon_configured(self):
        from agent.config import AffiliateConfig
        cfg = AffiliateConfig(
            amazon_access_key="key",
            amazon_secret_key="secret",
            amazon_partner_tag="tag-20",
        )
        self.assertTrue(cfg.amazon_configured())
        self.assertFalse(cfg.shareasale_configured())
        self.assertFalse(cfg.cj_configured())

    def test_reports_dir_created(self):
        import tempfile
        import shutil
        tmp = tempfile.mkdtemp()
        reports_path = os.path.join(tmp, "test_reports")
        try:
            from agent.config import AgentConfig
            cfg = AgentConfig(reports_dir=reports_path)
            self.assertTrue(os.path.isdir(reports_path))
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
