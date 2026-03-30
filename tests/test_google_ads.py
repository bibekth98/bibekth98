"""
Tests for agent/google_ads.py
"""
import unittest
from datetime import date

from agent.config import GoogleAdsConfig
from agent.google_ads import CampaignPerformance, GoogleAdsManager


class TestCampaignPerformance(unittest.TestCase):
    def _make(self, impressions=1000, clicks=50, cost_micros=10_000_000,
               conversions=5.0, conversion_value=30.0):
        return CampaignPerformance(
            campaign_id="123",
            campaign_name="Test",
            impressions=impressions,
            clicks=clicks,
            cost_micros=cost_micros,
            conversions=conversions,
            conversion_value=conversion_value,
        )

    def test_cost_usd(self):
        p = self._make(cost_micros=5_000_000)
        self.assertAlmostEqual(p.cost_usd, 5.0)

    def test_ctr(self):
        p = self._make(impressions=1000, clicks=50)
        self.assertAlmostEqual(p.ctr, 0.05)

    def test_ctr_zero_impressions(self):
        p = self._make(impressions=0, clicks=0)
        self.assertEqual(p.ctr, 0.0)

    def test_cpc(self):
        # cost = $10, clicks = 50 → CPC = $0.20
        p = self._make(clicks=50, cost_micros=10_000_000)
        self.assertAlmostEqual(p.cpc_usd, 0.20)

    def test_cpc_zero_clicks(self):
        p = self._make(clicks=0)
        self.assertEqual(p.cpc_usd, 0.0)

    def test_roas(self):
        # revenue = $30, spend = $10 → ROAS = 3.0
        p = self._make(cost_micros=10_000_000, conversion_value=30.0)
        self.assertAlmostEqual(p.roas, 3.0)

    def test_roas_zero_spend(self):
        p = self._make(cost_micros=0)
        self.assertEqual(p.roas, 0.0)

    def test_to_dict_keys(self):
        p = self._make()
        d = p.to_dict()
        for key in ["campaign_id", "campaign_name", "impressions", "clicks",
                    "cost_usd", "conversions", "conversion_value", "ctr", "cpc_usd", "roas"]:
            self.assertIn(key, d)


class TestGoogleAdsManagerDryRun(unittest.TestCase):
    def setUp(self):
        self.mgr = GoogleAdsManager(config=GoogleAdsConfig(), dry_run=True)

    def test_create_campaign_dry_run(self):
        resource = self.mgr.create_search_campaign(
            name="Test Campaign",
            daily_budget_usd=20.0,
            keywords=["buy shoes", "running shoes"],
            headlines=["Best Shoes"] * 5,
            descriptions=["Shop now"] * 2,
            final_url="https://example.com",
        )
        self.assertIsNotNone(resource)
        self.assertIn("DRY_RUN", resource)

    def test_optimise_bids_pauses_zero_click_campaign(self):
        perf = CampaignPerformance(
            campaign_id="1", campaign_name="Dead", impressions=500,
            clicks=0, cost_micros=0, conversions=0, conversion_value=0,
        )
        recs = self.mgr.optimise_bids([perf], min_roas=1.5, max_cpc_usd=5.0)
        self.assertTrue(any(r.action == "pause" for r in recs))

    def test_optimise_bids_decrease_for_low_roas(self):
        # ROAS = 0.5, cost = $20 → decrease_bid expected
        perf = CampaignPerformance(
            campaign_id="2", campaign_name="LowROAS", impressions=1000,
            clicks=100, cost_micros=20_000_000, conversions=5, conversion_value=10.0,
        )
        recs = self.mgr.optimise_bids([perf], min_roas=1.5, max_cpc_usd=5.0)
        self.assertTrue(any(r.action == "decrease_bid" for r in recs))

    def test_optimise_bids_increase_for_excellent_roas(self):
        # ROAS = 6.0, low CPC → increase_bid expected
        perf = CampaignPerformance(
            campaign_id="3", campaign_name="GoodROAS", impressions=1000,
            clicks=100, cost_micros=5_000_000, conversions=30, conversion_value=30.0,
        )
        recs = self.mgr.optimise_bids([perf], min_roas=1.5, max_cpc_usd=5.0)
        self.assertTrue(any(r.action == "increase_bid" for r in recs))

    def test_get_campaign_performance_unconfigured(self):
        result = self.mgr.get_campaign_performance(
            start_date=date(2024, 1, 1), end_date=date(2024, 1, 7)
        )
        self.assertEqual(result, [])

    def test_apply_recommendations_dry_run_no_exception(self):
        from agent.google_ads import AdGroupRecommendation
        rec = AdGroupRecommendation(
            action="pause", campaign_id="1", ad_group_id="",
            reason="Low performance."
        )
        # Should not raise
        self.mgr.apply_recommendations([rec])


if __name__ == "__main__":
    unittest.main()
