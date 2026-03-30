"""
Tests for agent/affiliate.py
"""
import unittest
from datetime import date

from agent.config import AffiliateConfig
from agent.affiliate import AffiliateManager, AffiliateSale


class TestAffiliateManagerLinks(unittest.TestCase):
    def _configured_manager(self):
        cfg = AffiliateConfig(
            amazon_access_key="key",
            amazon_secret_key="secret",
            amazon_partner_tag="test-20",
            shareasale_api_token="tok",
            shareasale_api_secret="sec",
            shareasale_affiliate_id="12345",
            cj_api_key="cjkey",
            cj_website_id="99999",
        )
        return AffiliateManager(cfg, dry_run=True)

    def test_build_amazon_link_contains_tag(self):
        mgr = self._configured_manager()
        link = mgr.build_amazon_link("B08N5WRWNW", "Echo Dot", "Electronics")
        self.assertIn("test-20", link.affiliate_url)
        self.assertEqual(link.network, "amazon")
        self.assertEqual(link.product_name, "Echo Dot")

    def test_build_amazon_link_raises_when_not_configured(self):
        mgr = AffiliateManager(AffiliateConfig(), dry_run=True)
        with self.assertRaises(RuntimeError):
            mgr.build_amazon_link("B08N5WRWNW", "Echo Dot")

    def test_build_shareasale_link(self):
        mgr = self._configured_manager()
        link = mgr.build_shareasale_link(
            merchant_id="12345",
            landing_url="https://merchant.example.com/product",
            product_name="Widget",
            commission_rate=0.08,
        )
        self.assertEqual(link.network, "shareasale")
        self.assertIn("shareasale.com", link.affiliate_url)
        self.assertAlmostEqual(link.commission_rate, 0.08)

    def test_build_shareasale_link_raises_when_not_configured(self):
        mgr = AffiliateManager(AffiliateConfig(), dry_run=True)
        with self.assertRaises(RuntimeError):
            mgr.build_shareasale_link("123", "https://example.com", "Product")

    def test_build_cj_link(self):
        mgr = self._configured_manager()
        link = mgr.build_cj_link(
            advertiser_id="111",
            landing_url="https://advertiser.example.com",
            product_name="Gadget",
        )
        self.assertEqual(link.network, "cj")
        self.assertIn("99999", link.affiliate_url)

    def test_build_cj_link_raises_when_not_configured(self):
        mgr = AffiliateManager(AffiliateConfig(), dry_run=True)
        with self.assertRaises(RuntimeError):
            mgr.build_cj_link("111", "https://example.com", "Product")

    def test_get_all_links(self):
        mgr = self._configured_manager()
        mgr.build_amazon_link("B001", "Product A")
        mgr.build_amazon_link("B002", "Product B")
        links = mgr.get_all_links()
        self.assertEqual(len(links), 2)


class TestAffiliateSummarisePerformance(unittest.TestCase):
    def _make_sale(self, network, commission, status="approved", product="Widget"):
        return AffiliateSale(
            network=network,
            transaction_id="tx1",
            sale_amount=100.0,
            commission=commission,
            product_name=product,
            sale_date=date(2024, 1, 15),
            status=status,
        )

    def test_summary_totals(self):
        mgr = AffiliateManager(AffiliateConfig(), dry_run=True)
        sales = [
            self._make_sale("amazon", 4.0, "approved"),
            self._make_sale("amazon", 4.0, "approved"),
            self._make_sale("shareasale", 6.0, "approved"),
            self._make_sale("shareasale", 5.0, "pending"),
        ]
        summaries = mgr.summarise_performance(sales)
        by_net = {s.network: s for s in summaries}

        self.assertIn("amazon", by_net)
        self.assertAlmostEqual(by_net["amazon"].total_commission, 8.0)
        self.assertEqual(by_net["amazon"].total_sales, 2)

        self.assertIn("shareasale", by_net)
        self.assertAlmostEqual(by_net["shareasale"].total_commission, 6.0)
        self.assertAlmostEqual(by_net["shareasale"].pending_commission, 5.0)

    def test_empty_sales_returns_empty_summaries(self):
        mgr = AffiliateManager(AffiliateConfig(), dry_run=True)
        self.assertEqual(mgr.summarise_performance([]), [])


if __name__ == "__main__":
    unittest.main()
