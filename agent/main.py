"""
Main AI Marketing Agent orchestrator.
Runs an optimisation cycle that:
  1. Fetches Google Ads performance data.
  2. Generates AI-powered bid-optimisation recommendations.
  3. Collects affiliate commission reports.
  4. Creates or updates ad campaigns with AI-written copy.
  5. Saves a combined daily report.

Run once or continuously with AGENT_CYCLE_INTERVAL_SECONDS.
"""

from __future__ import annotations

import logging
import signal
import sys
import time
from datetime import date, timedelta
from typing import List, Optional

from .analytics import AnalyticsReporter
from .affiliate import AffiliateManager, AffiliateSale
from .config import AgentConfig
from .content_generator import ContentGenerator, ContentRequest
from .google_ads import CampaignPerformance, GoogleAdsManager

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("marketing_agent")


class MarketingAgent:
    """
    AI-driven marketing agent that automates Google Ads management
    and affiliate marketing optimisation.
    """

    def __init__(self, config: Optional[AgentConfig] = None) -> None:
        self.config = config or AgentConfig()
        self.google_ads = GoogleAdsManager(
            config=self.config.google_ads,
            dry_run=self.config.dry_run,
        )
        self.affiliate = AffiliateManager(
            config=self.config.affiliate,
            dry_run=self.config.dry_run,
        )
        self.content = ContentGenerator(config=self.config.openai)
        self.reporter = AnalyticsReporter(reports_dir=self.config.reports_dir)

        if self.config.dry_run:
            logger.warning(
                "Agent is running in DRY-RUN mode. "
                "No changes will be made to Google Ads or affiliate networks. "
                "Set AGENT_DRY_RUN=false to enable live operations."
            )

    # ------------------------------------------------------------------
    # Core optimisation cycle
    # ------------------------------------------------------------------

    def run_cycle(self) -> None:
        """Execute a single end-to-end optimisation cycle."""
        today = date.today()
        yesterday = today - timedelta(days=1)
        week_ago = today - timedelta(days=7)

        logger.info("=== Optimisation cycle started for %s ===", today.isoformat())

        # 1. Google Ads performance
        campaign_perf = self._fetch_google_ads_performance(week_ago, yesterday)

        # 2. Bid optimisation
        recommendations = []
        if campaign_perf:
            recommendations = self.google_ads.optimise_bids(
                campaign_perf,
                min_roas=self.config.min_roas_threshold,
                max_cpc_usd=self.config.max_cpc_usd,
            )
            logger.info(
                "Generated %d bid-optimisation recommendation(s).", len(recommendations)
            )
            self.google_ads.apply_recommendations(recommendations)

        # 3. Affiliate data
        affiliate_sales = self._fetch_affiliate_reports(week_ago, yesterday)
        network_summaries = self.affiliate.summarise_performance(affiliate_sales)

        # 4. Build and save report
        report = self.reporter.build_report(
            start_date=week_ago,
            end_date=yesterday,
            campaign_performances=campaign_perf,
            recommendations=recommendations,
            affiliate_sales=affiliate_sales,
            network_summaries=network_summaries,
        )
        path = self.reporter.save_report(report, report_date=today)
        logger.info("Report saved to %s.{json,md}", path)

        # 5. Print summary to console
        print("\n" + report.to_markdown())
        logger.info("=== Optimisation cycle complete ===")

    # ------------------------------------------------------------------
    # Campaign creation helper
    # ------------------------------------------------------------------

    def create_affiliate_campaign(
        self,
        product_name: str,
        affiliate_url: str,
        target_audience: str,
        keywords: List[str],
        daily_budget_usd: float = 20.0,
    ) -> Optional[str]:
        """
        Generate AI copy and create a new Google Ads campaign
        pointing to an affiliate landing page.
        """
        logger.info("Creating campaign for product: %s", product_name)

        headlines = self.content.generate_ad_headlines(
            product=product_name,
            keywords=keywords,
            count=15,
        )
        descriptions = self.content.generate_ad_descriptions(
            product=product_name,
            keywords=keywords,
            count=4,
        )

        logger.info(
            "Generated %d headline(s) and %d description(s).",
            len(headlines),
            len(descriptions),
        )

        campaign_name = f"Affiliate – {product_name}"
        resource = self.google_ads.create_search_campaign(
            name=campaign_name,
            daily_budget_usd=daily_budget_usd,
            keywords=keywords,
            headlines=headlines,
            descriptions=descriptions,
            final_url=affiliate_url,
        )

        if resource:
            logger.info("Campaign created: %s", resource)
        return resource

    # ------------------------------------------------------------------
    # Internal fetch helpers
    # ------------------------------------------------------------------

    def _fetch_google_ads_performance(
        self, start: date, end: date
    ) -> List[CampaignPerformance]:
        if not self.config.google_ads.is_configured():
            logger.info("Google Ads not configured – skipping performance fetch.")
            return []
        return self.google_ads.get_campaign_performance(start, end)

    def _fetch_affiliate_reports(self, start: date, end: date) -> List[AffiliateSale]:
        all_sales: List[AffiliateSale] = []
        if self.config.affiliate.amazon_configured():
            all_sales += self.affiliate.get_amazon_report(start, end)
        if self.config.affiliate.shareasale_configured():
            all_sales += self.affiliate.get_shareasale_report(start, end)
        if self.config.affiliate.cj_configured():
            all_sales += self.affiliate.get_cj_report(start, end)
        logger.info("Fetched %d affiliate sale(s) across all networks.", len(all_sales))
        return all_sales

    # ------------------------------------------------------------------
    # Continuous loop
    # ------------------------------------------------------------------

    def run_forever(self) -> None:
        """Run the optimisation cycle repeatedly on a fixed interval."""
        interval = self.config.cycle_interval_seconds
        logger.info(
            "Starting continuous agent loop (interval=%ds). "
            "Press Ctrl+C to stop.",
            interval,
        )

        def _shutdown(signum: int, frame: object) -> None:
            logger.info("Shutdown signal received – stopping agent.")
            sys.exit(0)

        signal.signal(signal.SIGINT, _shutdown)
        signal.signal(signal.SIGTERM, _shutdown)

        while True:
            try:
                self.run_cycle()
            except Exception as exc:
                logger.exception("Unhandled error in optimisation cycle: %s", exc)
            logger.info("Next cycle in %d seconds.", interval)
            time.sleep(interval)


# ---------------------------------------------------------------------------
# CLI entry-point
# ---------------------------------------------------------------------------

def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(
        description="AI Marketing Agent – automates Google Ads & affiliate marketing."
    )
    subparsers = parser.add_subparsers(dest="command")

    # run-once
    subparsers.add_parser("run-once", help="Run a single optimisation cycle and exit.")

    # run-forever
    subparsers.add_parser("run-forever", help="Run optimisation cycles in a loop.")

    # create-campaign
    cc = subparsers.add_parser("create-campaign", help="Create a new affiliate campaign.")
    cc.add_argument("--product", required=True, help="Product name.")
    cc.add_argument("--url", required=True, help="Affiliate landing page URL.")
    cc.add_argument("--audience", default="online shoppers", help="Target audience description.")
    cc.add_argument("--keywords", nargs="+", default=[], help="Target keywords.")
    cc.add_argument("--budget", type=float, default=20.0, help="Daily budget in USD.")

    args = parser.parse_args()
    agent = MarketingAgent()

    if args.command == "run-once" or args.command is None:
        agent.run_cycle()
    elif args.command == "run-forever":
        agent.run_forever()
    elif args.command == "create-campaign":
        agent.create_affiliate_campaign(
            product_name=args.product,
            affiliate_url=args.url,
            target_audience=args.audience,
            keywords=args.keywords,
            daily_budget_usd=args.budget,
        )
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
