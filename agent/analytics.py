"""
Analytics and reporting module.
Aggregates data from Google Ads and affiliate networks,
and writes JSON / Markdown summary reports.
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import asdict, dataclass, field
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from .affiliate import AffiliateSale, NetworkSummary
from .google_ads import AdGroupRecommendation, CampaignPerformance

logger = logging.getLogger(__name__)


@dataclass
class DailyReport:
    generated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    period_start: str = ""
    period_end: str = ""

    # Google Ads
    google_ads_total_spend_usd: float = 0.0
    google_ads_total_conversions: float = 0.0
    google_ads_total_revenue: float = 0.0
    google_ads_roas: float = 0.0
    google_ads_campaigns: List[Dict[str, Any]] = field(default_factory=list)
    google_ads_recommendations: List[Dict[str, Any]] = field(default_factory=list)

    # Affiliate
    affiliate_total_commission_usd: float = 0.0
    affiliate_pending_commission_usd: float = 0.0
    affiliate_total_sales: int = 0
    affiliate_networks: List[Dict[str, Any]] = field(default_factory=list)

    # Combined
    total_revenue_usd: float = 0.0
    total_spend_usd: float = 0.0
    net_profit_usd: float = 0.0

    def compute_totals(self) -> None:
        """Recompute derived totals from raw data."""
        self.google_ads_roas = (
            self.google_ads_total_revenue / self.google_ads_total_spend_usd
            if self.google_ads_total_spend_usd
            else 0.0
        )
        self.total_revenue_usd = round(
            self.google_ads_total_revenue + self.affiliate_total_commission_usd, 2
        )
        self.total_spend_usd = round(self.google_ads_total_spend_usd, 2)
        self.net_profit_usd = round(self.total_revenue_usd - self.total_spend_usd, 2)
        self.google_ads_roas = round(self.google_ads_roas, 4)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def to_markdown(self) -> str:
        lines = [
            f"# AI Marketing Agent – Daily Report",
            f"",
            f"**Generated:** {self.generated_at}  ",
            f"**Period:** {self.period_start} → {self.period_end}",
            f"",
            f"## 💰 Financial Summary",
            f"",
            f"| Metric | Value |",
            f"|--------|-------|",
            f"| Total Revenue | ${self.total_revenue_usd:,.2f} |",
            f"| Total Ad Spend | ${self.total_spend_usd:,.2f} |",
            f"| Net Profit | ${self.net_profit_usd:,.2f} |",
            f"| Google Ads ROAS | {self.google_ads_roas:.2f}x |",
            f"",
            f"## 📢 Google Ads",
            f"",
            f"| Metric | Value |",
            f"|--------|-------|",
            f"| Total Spend | ${self.google_ads_total_spend_usd:,.2f} |",
            f"| Conversions | {self.google_ads_total_conversions:,.1f} |",
            f"| Revenue | ${self.google_ads_total_revenue:,.2f} |",
            f"",
        ]

        if self.google_ads_campaigns:
            lines += [
                "### Campaign Performance",
                "",
                "| Campaign | Impressions | Clicks | CTR | CPC | ROAS |",
                "|----------|-------------|--------|-----|-----|------|",
            ]
            for c in self.google_ads_campaigns:
                lines.append(
                    f"| {c.get('campaign_name','?')} | {c.get('impressions',0):,} | "
                    f"{c.get('clicks',0):,} | {c.get('ctr',0):.2%} | "
                    f"${c.get('cpc_usd',0):.2f} | {c.get('roas',0):.2f}x |"
                )
            lines.append("")

        if self.google_ads_recommendations:
            lines += ["### Recommendations", ""]
            for r in self.google_ads_recommendations:
                lines.append(f"- **{r.get('action','?').upper()}** (campaign {r.get('campaign_id','?')}): {r.get('reason','')}")
            lines.append("")

        lines += [
            "## 🤝 Affiliate Marketing",
            "",
            f"| Metric | Value |",
            f"|--------|-------|",
            f"| Approved Commission | ${self.affiliate_total_commission_usd:,.2f} |",
            f"| Pending Commission | ${self.affiliate_pending_commission_usd:,.2f} |",
            f"| Total Sales | {self.affiliate_total_sales} |",
            "",
        ]

        if self.affiliate_networks:
            lines += [
                "### Network Breakdown",
                "",
                "| Network | Sales | Approved | Pending | Top Product |",
                "|---------|-------|----------|---------|-------------|",
            ]
            for n in self.affiliate_networks:
                top = n.get("top_products", ["–"])[0] if n.get("top_products") else "–"
                lines.append(
                    f"| {n.get('network','?')} | {n.get('total_sales',0)} | "
                    f"${n.get('total_commission',0):,.2f} | "
                    f"${n.get('pending_commission',0):,.2f} | {top} |"
                )
            lines.append("")

        return "\n".join(lines)


class AnalyticsReporter:
    """Builds and saves daily reports from collected data."""

    def __init__(self, reports_dir: str = "reports") -> None:
        self.reports_dir = reports_dir
        os.makedirs(reports_dir, exist_ok=True)

    def build_report(
        self,
        start_date: date,
        end_date: date,
        campaign_performances: List[CampaignPerformance],
        recommendations: List[AdGroupRecommendation],
        affiliate_sales: List[AffiliateSale],
        network_summaries: List[NetworkSummary],
    ) -> DailyReport:
        report = DailyReport(
            period_start=start_date.isoformat(),
            period_end=end_date.isoformat(),
        )

        # Google Ads aggregation
        for perf in campaign_performances:
            report.google_ads_total_spend_usd += perf.cost_usd
            report.google_ads_total_conversions += perf.conversions
            report.google_ads_total_revenue += perf.conversion_value
            report.google_ads_campaigns.append(perf.to_dict())

        for rec in recommendations:
            report.google_ads_recommendations.append(
                {
                    "action": rec.action,
                    "campaign_id": rec.campaign_id,
                    "reason": rec.reason,
                    "suggested_bid_micros": rec.suggested_bid_micros,
                }
            )

        # Affiliate aggregation
        for net in network_summaries:
            report.affiliate_total_commission_usd += net.total_commission
            report.affiliate_pending_commission_usd += net.pending_commission
            report.affiliate_total_sales += net.total_sales
            report.affiliate_networks.append(
                {
                    "network": net.network,
                    "total_sales": net.total_sales,
                    "total_commission": net.total_commission,
                    "pending_commission": net.pending_commission,
                    "top_products": net.top_products,
                }
            )

        report.compute_totals()
        return report

    def save_report(self, report: DailyReport, report_date: Optional[date] = None) -> str:
        """Write report as both JSON and Markdown. Returns the base path used."""
        tag = (report_date or date.today()).isoformat()
        base_path = os.path.join(self.reports_dir, f"report_{tag}")

        json_path = base_path + ".json"
        with open(json_path, "w", encoding="utf-8") as fh:
            json.dump(report.to_dict(), fh, indent=2)
        logger.info("Report saved: %s", json_path)

        md_path = base_path + ".md"
        with open(md_path, "w", encoding="utf-8") as fh:
            fh.write(report.to_markdown())
        logger.info("Report saved: %s", md_path)

        return base_path

    def load_report(self, report_date: date) -> Optional[DailyReport]:
        """Load a previously saved report for the given date."""
        json_path = os.path.join(self.reports_dir, f"report_{report_date.isoformat()}.json")
        if not os.path.exists(json_path):
            return None
        try:
            with open(json_path, encoding="utf-8") as fh:
                data = json.load(fh)
            report = DailyReport(**{k: v for k, v in data.items() if k in DailyReport.__dataclass_fields__})
            return report
        except Exception as exc:
            logger.error("Failed to load report %s: %s", json_path, exc)
            return None
