"""
Tests for agent/analytics.py
"""
import json
import os
import shutil
import tempfile
import unittest
from datetime import date

from agent.analytics import AnalyticsReporter, DailyReport
from agent.affiliate import AffiliateSale, NetworkSummary
from agent.google_ads import AdGroupRecommendation, CampaignPerformance


def _make_campaign(campaign_id="1", name="Camp A", impressions=1000, clicks=50,
                    cost_micros=10_000_000, conversions=5.0, conversion_value=30.0):
    return CampaignPerformance(
        campaign_id=campaign_id,
        campaign_name=name,
        impressions=impressions,
        clicks=clicks,
        cost_micros=cost_micros,
        conversions=conversions,
        conversion_value=conversion_value,
    )


def _make_sale(network="amazon", commission=4.0, status="approved"):
    return AffiliateSale(
        network=network,
        transaction_id="tx1",
        sale_amount=50.0,
        commission=commission,
        product_name="Widget",
        sale_date=date(2024, 1, 15),
        status=status,
    )


class TestDailyReport(unittest.TestCase):
    def test_compute_totals(self):
        report = DailyReport()
        report.google_ads_total_spend_usd = 10.0
        report.google_ads_total_revenue = 30.0
        report.affiliate_total_commission_usd = 5.0
        report.compute_totals()

        self.assertAlmostEqual(report.total_revenue_usd, 35.0)
        self.assertAlmostEqual(report.total_spend_usd, 10.0)
        self.assertAlmostEqual(report.net_profit_usd, 25.0)
        self.assertAlmostEqual(report.google_ads_roas, 3.0)

    def test_to_dict_contains_expected_keys(self):
        report = DailyReport()
        d = report.to_dict()
        for key in ["generated_at", "period_start", "period_end",
                    "google_ads_total_spend_usd", "affiliate_total_commission_usd",
                    "total_revenue_usd", "net_profit_usd"]:
            self.assertIn(key, d)

    def test_to_markdown_contains_sections(self):
        report = DailyReport()
        report.compute_totals()
        md = report.to_markdown()
        self.assertIn("Financial Summary", md)
        self.assertIn("Google Ads", md)
        self.assertIn("Affiliate Marketing", md)


class TestAnalyticsReporter(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        self.reporter = AnalyticsReporter(reports_dir=self.tmp_dir)

    def tearDown(self):
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_build_report_aggregates_data(self):
        campaigns = [_make_campaign(cost_micros=10_000_000, conversion_value=30.0)]
        sales = [_make_sale(commission=5.0, status="approved")]
        summaries = [NetworkSummary("amazon", 0, 1, 5.0, 0.0, ["Widget"])]

        report = self.reporter.build_report(
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 7),
            campaign_performances=campaigns,
            recommendations=[],
            affiliate_sales=sales,
            network_summaries=summaries,
        )

        self.assertAlmostEqual(report.google_ads_total_spend_usd, 10.0)
        self.assertAlmostEqual(report.google_ads_total_revenue, 30.0)
        self.assertAlmostEqual(report.affiliate_total_commission_usd, 5.0)
        self.assertAlmostEqual(report.net_profit_usd, 25.0)

    def test_save_and_load_report(self):
        report = DailyReport(period_start="2024-01-01", period_end="2024-01-07")
        report.google_ads_total_spend_usd = 10.0
        report.google_ads_total_revenue = 30.0
        report.compute_totals()

        report_date = date(2024, 1, 7)
        self.reporter.save_report(report, report_date=report_date)

        json_path = os.path.join(self.tmp_dir, "report_2024-01-07.json")
        md_path = os.path.join(self.tmp_dir, "report_2024-01-07.md")
        self.assertTrue(os.path.exists(json_path))
        self.assertTrue(os.path.exists(md_path))

        loaded = self.reporter.load_report(report_date)
        self.assertIsNotNone(loaded)
        self.assertAlmostEqual(loaded.net_profit_usd, report.net_profit_usd)

    def test_load_nonexistent_report_returns_none(self):
        result = self.reporter.load_report(date(2000, 1, 1))
        self.assertIsNone(result)

    def test_build_report_with_recommendations(self):
        rec = AdGroupRecommendation(
            action="pause", campaign_id="1", ad_group_id="",
            reason="Zero clicks."
        )
        report = self.reporter.build_report(
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 7),
            campaign_performances=[],
            recommendations=[rec],
            affiliate_sales=[],
            network_summaries=[],
        )
        self.assertEqual(len(report.google_ads_recommendations), 1)
        self.assertEqual(report.google_ads_recommendations[0]["action"], "pause")


if __name__ == "__main__":
    unittest.main()
