"""
Google Ads automation module.
Handles campaign creation, bid optimisation, keyword management,
and performance reporting via the Google Ads API.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import date
from typing import Any, Dict, List, Optional

from .config import GoogleAdsConfig

logger = logging.getLogger(__name__)


@dataclass
class CampaignPerformance:
    campaign_id: str
    campaign_name: str
    impressions: int
    clicks: int
    cost_micros: int
    conversions: float
    conversion_value: float

    @property
    def cost_usd(self) -> float:
        return self.cost_micros / 1_000_000

    @property
    def ctr(self) -> float:
        return (self.clicks / self.impressions) if self.impressions else 0.0

    @property
    def cpc_usd(self) -> float:
        return (self.cost_usd / self.clicks) if self.clicks else 0.0

    @property
    def roas(self) -> float:
        """Return on Ad Spend = conversion_value / cost."""
        return (self.conversion_value / self.cost_usd) if self.cost_usd else 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "campaign_id": self.campaign_id,
            "campaign_name": self.campaign_name,
            "impressions": self.impressions,
            "clicks": self.clicks,
            "cost_usd": round(self.cost_usd, 4),
            "conversions": self.conversions,
            "conversion_value": round(self.conversion_value, 4),
            "ctr": round(self.ctr, 4),
            "cpc_usd": round(self.cpc_usd, 4),
            "roas": round(self.roas, 4),
        }


@dataclass
class AdGroupRecommendation:
    action: str           # "pause" | "increase_bid" | "decrease_bid" | "add_keywords"
    campaign_id: str
    ad_group_id: str
    reason: str
    suggested_bid_micros: Optional[int] = None
    suggested_keywords: List[str] = field(default_factory=list)


class GoogleAdsManager:
    """
    Manages Google Ads campaigns.
    When AGENT_DRY_RUN=true (default) every write operation is simulated and logged
    instead of being sent to the API, so you can safely evaluate the agent
    before spending any budget.
    """

    def __init__(self, config: GoogleAdsConfig, dry_run: bool = True) -> None:
        self.config = config
        self.dry_run = dry_run
        self._client: Optional[Any] = None

        if config.is_configured():
            self._client = self._build_client()
        else:
            logger.warning(
                "Google Ads not configured – set the GOOGLE_ADS_* environment variables."
            )

    # ------------------------------------------------------------------
    # Client setup
    # ------------------------------------------------------------------

    def _build_client(self) -> Optional[Any]:
        try:
            from google.ads.googleads.client import GoogleAdsClient  # type: ignore
            credentials = {
                "developer_token": self.config.developer_token,
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
                "refresh_token": self.config.refresh_token,
                "use_proto_plus": True,
            }
            client = GoogleAdsClient.load_from_dict(credentials)
            logger.info("Google Ads client initialised (customer=%s)", self.config.customer_id)
            return client
        except ImportError:
            logger.error("google-ads package not installed. Run: pip install google-ads")
            return None
        except Exception as exc:
            logger.error("Failed to build Google Ads client: %s", exc)
            return None

    # ------------------------------------------------------------------
    # Campaign creation
    # ------------------------------------------------------------------

    def create_search_campaign(
        self,
        name: str,
        daily_budget_usd: float,
        keywords: List[str],
        headlines: List[str],
        descriptions: List[str],
        final_url: str,
    ) -> Optional[str]:
        """
        Create a new Search campaign with a single ad group and responsive search ad.
        Returns the new campaign resource name, or None on failure.
        """
        if self.dry_run:
            logger.info(
                "[DRY-RUN] Would create campaign '%s' | budget=$%.2f | keywords=%s",
                name,
                daily_budget_usd,
                keywords,
            )
            return f"customers/{self.config.customer_id}/campaigns/DRY_RUN_{name}"

        if not self._client:
            logger.error("Google Ads client not available.")
            return None

        try:
            return self._api_create_search_campaign(
                name, daily_budget_usd, keywords, headlines, descriptions, final_url
            )
        except Exception as exc:
            logger.error("create_search_campaign failed: %s", exc)
            return None

    def _api_create_search_campaign(
        self,
        name: str,
        daily_budget_usd: float,
        keywords: List[str],
        headlines: List[str],
        descriptions: List[str],
        final_url: str,
    ) -> str:
        """Issue real Google Ads API mutate calls."""
        campaign_budget_service = self._client.get_service("CampaignBudgetService")
        campaign_service = self._client.get_service("CampaignService")
        ad_group_service = self._client.get_service("AdGroupService")
        ad_group_ad_service = self._client.get_service("AdGroupAdService")
        ad_group_criterion_service = self._client.get_service("AdGroupCriterionService")

        customer_id = self.config.customer_id

        # 1. Budget
        budget_op = self._client.get_type("CampaignBudgetOperation")
        budget = budget_op.create
        budget.name = f"{name} Budget"
        budget.amount_micros = int(daily_budget_usd * 1_000_000)
        budget.delivery_method = self._client.enums.BudgetDeliveryMethodEnum.STANDARD
        budget_response = campaign_budget_service.mutate_campaign_budgets(
            customer_id=customer_id, operations=[budget_op]
        )
        budget_resource = budget_response.results[0].resource_name

        # 2. Campaign
        campaign_op = self._client.get_type("CampaignOperation")
        campaign = campaign_op.create
        campaign.name = name
        campaign.advertising_channel_type = (
            self._client.enums.AdvertisingChannelTypeEnum.SEARCH
        )
        campaign.status = self._client.enums.CampaignStatusEnum.PAUSED
        campaign.campaign_budget = budget_resource
        campaign.network_settings.target_google_search = True
        campaign.network_settings.target_search_network = True
        campaign_response = campaign_service.mutate_campaigns(
            customer_id=customer_id, operations=[campaign_op]
        )
        campaign_resource = campaign_response.results[0].resource_name

        # 3. Ad Group
        ag_op = self._client.get_type("AdGroupOperation")
        ad_group = ag_op.create
        ad_group.name = f"{name} Ad Group"
        ad_group.campaign = campaign_resource
        ad_group.status = self._client.enums.AdGroupStatusEnum.ENABLED
        ag_response = ad_group_service.mutate_ad_groups(
            customer_id=customer_id, operations=[ag_op]
        )
        ag_resource = ag_response.results[0].resource_name

        # 4. Responsive Search Ad
        ad_op = self._client.get_type("AdGroupAdOperation")
        ad_group_ad = ad_op.create
        ad_group_ad.ad_group = ag_resource
        ad_group_ad.status = self._client.enums.AdGroupAdStatusEnum.ENABLED
        rsa = ad_group_ad.ad.responsive_search_ad
        for headline_text in headlines[:15]:
            headline = self._client.get_type("AdTextAsset")
            headline.text = headline_text[:30]
            rsa.headlines.append(headline)
        for desc_text in descriptions[:4]:
            desc = self._client.get_type("AdTextAsset")
            desc.text = desc_text[:90]
            rsa.descriptions.append(desc)
        ad_group_ad.ad.final_urls.append(final_url)
        ad_group_ad_service.mutate_ad_group_ads(
            customer_id=customer_id, operations=[ad_op]
        )

        # 5. Keywords
        kw_ops = []
        for kw in keywords:
            kw_op = self._client.get_type("AdGroupCriterionOperation")
            criterion = kw_op.create
            criterion.ad_group = ag_resource
            criterion.status = self._client.enums.AdGroupCriterionStatusEnum.ENABLED
            criterion.keyword.text = kw
            criterion.keyword.match_type = (
                self._client.enums.KeywordMatchTypeEnum.BROAD
            )
            kw_ops.append(kw_op)
        if kw_ops:
            ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=customer_id, operations=kw_ops
            )

        logger.info("Created campaign: %s", campaign_resource)
        return campaign_resource

    # ------------------------------------------------------------------
    # Performance reporting
    # ------------------------------------------------------------------

    def get_campaign_performance(
        self,
        start_date: date,
        end_date: date,
    ) -> List[CampaignPerformance]:
        """Fetch campaign performance for a date range."""
        if not self._client:
            logger.warning("Google Ads client not available – returning empty performance list.")
            return []

        query = f"""
            SELECT
                campaign.id,
                campaign.name,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.conversions,
                metrics.conversions_value
            FROM campaign
            WHERE segments.date BETWEEN '{start_date.isoformat()}' AND '{end_date.isoformat()}'
              AND campaign.status != 'REMOVED'
        """
        try:
            service = self._client.get_service("GoogleAdsService")
            response = service.search(
                customer_id=self.config.customer_id, query=query
            )
            results: List[CampaignPerformance] = []
            for row in response:
                results.append(
                    CampaignPerformance(
                        campaign_id=str(row.campaign.id),
                        campaign_name=row.campaign.name,
                        impressions=row.metrics.impressions,
                        clicks=row.metrics.clicks,
                        cost_micros=row.metrics.cost_micros,
                        conversions=row.metrics.conversions,
                        conversion_value=row.metrics.conversions_value,
                    )
                )
            return results
        except Exception as exc:
            logger.error("get_campaign_performance failed: %s", exc)
            return []

    # ------------------------------------------------------------------
    # Bid optimisation
    # ------------------------------------------------------------------

    def optimise_bids(
        self,
        performances: List[CampaignPerformance],
        min_roas: float,
        max_cpc_usd: float,
    ) -> List[AdGroupRecommendation]:
        """
        Analyse campaign performance and return a list of actionable recommendations.
        """
        recommendations: List[AdGroupRecommendation] = []
        for perf in performances:
            if perf.clicks == 0:
                recommendations.append(
                    AdGroupRecommendation(
                        action="pause",
                        campaign_id=perf.campaign_id,
                        ad_group_id="",
                        reason=f"Zero clicks for campaign '{perf.campaign_name}'.",
                    )
                )
            elif perf.roas < min_roas and perf.cost_usd > 5:
                recommendations.append(
                    AdGroupRecommendation(
                        action="decrease_bid",
                        campaign_id=perf.campaign_id,
                        ad_group_id="",
                        reason=(
                            f"ROAS {perf.roas:.2f} is below threshold {min_roas}. "
                            "Reducing bids to protect budget."
                        ),
                        suggested_bid_micros=int(perf.cpc_usd * 0.8 * 1_000_000),
                    )
                )
            elif perf.cpc_usd > max_cpc_usd:
                recommendations.append(
                    AdGroupRecommendation(
                        action="decrease_bid",
                        campaign_id=perf.campaign_id,
                        ad_group_id="",
                        reason=(
                            f"CPC ${perf.cpc_usd:.2f} exceeds max ${max_cpc_usd:.2f}."
                        ),
                        suggested_bid_micros=int(max_cpc_usd * 0.9 * 1_000_000),
                    )
                )
            elif perf.roas > min_roas * 2 and perf.cpc_usd < max_cpc_usd * 0.5:
                recommendations.append(
                    AdGroupRecommendation(
                        action="increase_bid",
                        campaign_id=perf.campaign_id,
                        ad_group_id="",
                        reason=(
                            f"ROAS {perf.roas:.2f} is excellent – scaling bids to capture more traffic."
                        ),
                        suggested_bid_micros=int(perf.cpc_usd * 1.2 * 1_000_000),
                    )
                )
        return recommendations

    def apply_recommendations(self, recommendations: List[AdGroupRecommendation]) -> None:
        """Apply bid recommendations (no-op in dry-run mode)."""
        for rec in recommendations:
            if self.dry_run:
                logger.info("[DRY-RUN] Recommendation: %s – %s", rec.action, rec.reason)
                continue
            logger.info("Applying recommendation: %s – %s", rec.action, rec.reason)
            # Real implementation would call mutate_ad_group_criteria / mutate_ad_groups
