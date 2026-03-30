"""
Configuration management for the AI Marketing Agent.
All sensitive values are loaded from environment variables.
"""

import os
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class GoogleAdsConfig:
    developer_token: str = field(default_factory=lambda: os.environ.get("GOOGLE_ADS_DEVELOPER_TOKEN", ""))
    client_id: str = field(default_factory=lambda: os.environ.get("GOOGLE_ADS_CLIENT_ID", ""))
    client_secret: str = field(default_factory=lambda: os.environ.get("GOOGLE_ADS_CLIENT_SECRET", ""))
    refresh_token: str = field(default_factory=lambda: os.environ.get("GOOGLE_ADS_REFRESH_TOKEN", ""))
    customer_id: str = field(default_factory=lambda: os.environ.get("GOOGLE_ADS_CUSTOMER_ID", ""))
    # Monthly budget cap in micros (1 USD = 1,000,000 micros)
    monthly_budget_cap_micros: int = field(
        default_factory=lambda: int(os.environ.get("GOOGLE_ADS_MONTHLY_BUDGET_CAP_MICROS", "50000000"))
    )

    def is_configured(self) -> bool:
        return all([
            self.developer_token,
            self.client_id,
            self.client_secret,
            self.refresh_token,
            self.customer_id,
        ])


@dataclass
class AffiliateConfig:
    # Amazon Associates
    amazon_access_key: str = field(default_factory=lambda: os.environ.get("AMAZON_ACCESS_KEY", ""))
    amazon_secret_key: str = field(default_factory=lambda: os.environ.get("AMAZON_SECRET_KEY", ""))
    amazon_partner_tag: str = field(default_factory=lambda: os.environ.get("AMAZON_PARTNER_TAG", ""))

    # ShareASale
    shareasale_api_token: str = field(default_factory=lambda: os.environ.get("SHAREASALE_API_TOKEN", ""))
    shareasale_api_secret: str = field(default_factory=lambda: os.environ.get("SHAREASALE_API_SECRET", ""))
    shareasale_affiliate_id: str = field(default_factory=lambda: os.environ.get("SHAREASALE_AFFILIATE_ID", ""))

    # Commission Junction (CJ)
    cj_api_key: str = field(default_factory=lambda: os.environ.get("CJ_API_KEY", ""))
    cj_website_id: str = field(default_factory=lambda: os.environ.get("CJ_WEBSITE_ID", ""))

    def amazon_configured(self) -> bool:
        return all([self.amazon_access_key, self.amazon_secret_key, self.amazon_partner_tag])

    def shareasale_configured(self) -> bool:
        return all([self.shareasale_api_token, self.shareasale_api_secret, self.shareasale_affiliate_id])

    def cj_configured(self) -> bool:
        return all([self.cj_api_key, self.cj_website_id])


@dataclass
class OpenAIConfig:
    api_key: str = field(default_factory=lambda: os.environ.get("OPENAI_API_KEY", ""))
    model: str = field(default_factory=lambda: os.environ.get("OPENAI_MODEL", "gpt-4o"))
    max_tokens: int = field(default_factory=lambda: int(os.environ.get("OPENAI_MAX_TOKENS", "2048")))

    def is_configured(self) -> bool:
        return bool(self.api_key)


@dataclass
class AgentConfig:
    google_ads: GoogleAdsConfig = field(default_factory=GoogleAdsConfig)
    affiliate: AffiliateConfig = field(default_factory=AffiliateConfig)
    openai: OpenAIConfig = field(default_factory=OpenAIConfig)

    # How often the agent runs its optimization cycle (in seconds)
    cycle_interval_seconds: int = field(
        default_factory=lambda: int(os.environ.get("AGENT_CYCLE_INTERVAL_SECONDS", "3600"))
    )

    # Directory to store reports
    reports_dir: str = field(default_factory=lambda: os.environ.get("AGENT_REPORTS_DIR", "reports"))

    # Minimum ROAS (Return on Ad Spend) before pausing a campaign
    min_roas_threshold: float = field(
        default_factory=lambda: float(os.environ.get("AGENT_MIN_ROAS_THRESHOLD", "1.5"))
    )

    # Maximum cost-per-click to allow
    max_cpc_usd: float = field(
        default_factory=lambda: float(os.environ.get("AGENT_MAX_CPC_USD", "5.0"))
    )

    # Dry-run mode: analyse and report without making live changes
    dry_run: bool = field(
        default_factory=lambda: os.environ.get("AGENT_DRY_RUN", "true").lower() == "true"
    )

    def __post_init__(self) -> None:
        os.makedirs(self.reports_dir, exist_ok=True)
