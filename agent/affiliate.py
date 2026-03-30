"""
Affiliate marketing module.
Tracks links, fetches commission reports, and identifies top opportunities
across Amazon Associates, ShareASale, and Commission Junction (CJ).
"""

from __future__ import annotations

import hashlib
import hmac
import logging
import time
from dataclasses import dataclass, field
from datetime import date
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode, urljoin, urlparse

from .config import AffiliateConfig

logger = logging.getLogger(__name__)


@dataclass
class AffiliateLink:
    original_url: str
    affiliate_url: str
    network: str             # "amazon" | "shareasale" | "cj" | "custom"
    product_name: str
    commission_rate: float   # e.g. 0.05 for 5%
    category: str = ""
    tags: List[str] = field(default_factory=list)


@dataclass
class AffiliateSale:
    network: str
    transaction_id: str
    sale_amount: float
    commission: float
    product_name: str
    sale_date: date
    status: str              # "approved" | "pending" | "rejected"


@dataclass
class NetworkSummary:
    network: str
    total_clicks: int
    total_sales: int
    total_commission: float
    pending_commission: float
    top_products: List[str] = field(default_factory=list)


class AffiliateManager:
    """
    Manages affiliate marketing across multiple networks.
    Generates trackable links and fetches commission reports.
    """

    AMAZON_BASE = "https://www.amazon.com"
    SHAREASALE_API = "https://api.shareasale.com/w.cfm"
    CJ_API = "https://commission-detail.api.cj.com/v3/commissions"

    def __init__(self, config: AffiliateConfig, dry_run: bool = True) -> None:
        self.config = config
        self.dry_run = dry_run
        self._link_registry: Dict[str, AffiliateLink] = {}

    # ------------------------------------------------------------------
    # Link generation
    # ------------------------------------------------------------------

    def build_amazon_link(self, asin: str, product_name: str, category: str = "") -> AffiliateLink:
        """Build an Amazon Associates affiliate link for a given ASIN."""
        if not self.config.amazon_configured():
            raise RuntimeError(
                "Amazon Associates not configured. Set AMAZON_ACCESS_KEY, "
                "AMAZON_SECRET_KEY, and AMAZON_PARTNER_TAG environment variables."
            )
        params = urlencode({
            "tag": self.config.amazon_partner_tag,
            "linkCode": "as2",
            "creative": "9325",
            "camp": "1789",
        })
        affiliate_url = f"{self.AMAZON_BASE}/dp/{asin}?{params}"
        link = AffiliateLink(
            original_url=f"{self.AMAZON_BASE}/dp/{asin}",
            affiliate_url=affiliate_url,
            network="amazon",
            product_name=product_name,
            commission_rate=0.04,   # default Amazon commission; varies by category
            category=category,
        )
        self._link_registry[asin] = link
        logger.info("Built Amazon link for ASIN %s: %s", asin, affiliate_url)
        return link

    def build_shareasale_link(
        self,
        merchant_id: str,
        landing_url: str,
        product_name: str,
        commission_rate: float = 0.05,
    ) -> AffiliateLink:
        """Build a ShareASale deep-link."""
        if not self.config.shareasale_configured():
            raise RuntimeError(
                "ShareASale not configured. Set SHAREASALE_API_TOKEN, "
                "SHAREASALE_API_SECRET, and SHAREASALE_AFFILIATE_ID environment variables."
            )
        params = urlencode({
            "afftrack": product_name.lower().replace(" ", "-"),
            "merchantID": merchant_id,
            "userID": self.config.shareasale_affiliate_id,
            "mURL": landing_url,
        })
        affiliate_url = f"https://www.shareasale.com/r.cfm?{params}"
        link = AffiliateLink(
            original_url=landing_url,
            affiliate_url=affiliate_url,
            network="shareasale",
            product_name=product_name,
            commission_rate=commission_rate,
        )
        key = hashlib.md5(f"{merchant_id}:{landing_url}".encode()).hexdigest()
        self._link_registry[key] = link
        logger.info("Built ShareASale link for merchant %s", merchant_id)
        return link

    def build_cj_link(
        self,
        advertiser_id: str,
        landing_url: str,
        product_name: str,
        commission_rate: float = 0.06,
    ) -> AffiliateLink:
        """Build a Commission Junction (CJ) affiliate link."""
        if not self.config.cj_configured():
            raise RuntimeError(
                "CJ not configured. Set CJ_API_KEY and CJ_WEBSITE_ID environment variables."
            )
        params = urlencode({
            "aid": advertiser_id,
            "pid": self.config.cj_website_id,
            "url": landing_url,
        })
        affiliate_url = f"https://www.jdoqocy.com/click-{self.config.cj_website_id}-{advertiser_id}?{params}"
        link = AffiliateLink(
            original_url=landing_url,
            affiliate_url=affiliate_url,
            network="cj",
            product_name=product_name,
            commission_rate=commission_rate,
        )
        key = hashlib.md5(f"{advertiser_id}:{landing_url}".encode()).hexdigest()
        self._link_registry[key] = link
        logger.info("Built CJ link for advertiser %s", advertiser_id)
        return link

    # ------------------------------------------------------------------
    # Commission reporting
    # ------------------------------------------------------------------

    def get_amazon_report(self, start_date: date, end_date: date) -> List[AffiliateSale]:
        """
        Fetch Amazon Associates earnings report via the Product Advertising API.
        Returns an empty list when the credentials are not configured.
        """
        if not self.config.amazon_configured():
            logger.warning("Amazon not configured – skipping report.")
            return []

        try:
            import boto3  # type: ignore
            # Amazon Associates reports are fetched via the PA-API v5
            # This is a simplified stub – a production implementation would
            # call paapi5-python-sdk or the REST endpoint directly.
            logger.info(
                "Fetching Amazon report %s – %s (stub – integrate PA-API v5 for live data)",
                start_date,
                end_date,
            )
            return []
        except ImportError:
            logger.warning("boto3 not installed – Amazon report unavailable.")
            return []

    def get_shareasale_report(self, start_date: date, end_date: date) -> List[AffiliateSale]:
        """Fetch ShareASale transaction report via their API."""
        if not self.config.shareasale_configured():
            logger.warning("ShareASale not configured – skipping report.")
            return []

        try:
            import requests  # type: ignore

            timestamp = int(time.time())
            token = self.config.shareasale_api_token
            secret = self.config.shareasale_api_secret
            action = "activity"
            sig_raw = f"{token}:{timestamp}:{action}:{secret}"
            sig = hmac.new(
                secret.encode(), sig_raw.encode(), hashlib.sha256
            ).hexdigest()

            params = {
                "token": token,
                "version": "2.8",
                "affiliateId": self.config.shareasale_affiliate_id,
                "action": action,
                "dateStart": start_date.strftime("%m/%d/%Y"),
                "dateEnd": end_date.strftime("%m/%d/%Y"),
                "XMLFormat": "1",
            }
            headers = {
                "x-ShareASale-Date": str(timestamp),
                "x-ShareASale-Authentication": sig,
            }
            response = requests.get(self.SHAREASALE_API, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            # Parse XML response and convert to AffiliateSale objects
            return self._parse_shareasale_response(response.text)
        except Exception as exc:
            logger.error("ShareASale report failed: %s", exc)
            return []

    def _parse_shareasale_response(self, xml_text: str) -> List[AffiliateSale]:
        """Parse ShareASale XML response into AffiliateSale objects."""
        try:
            import xml.etree.ElementTree as ET  # noqa: N817
            root = ET.fromstring(xml_text)
            sales: List[AffiliateSale] = []
            for item in root.findall(".//transaction"):
                sales.append(
                    AffiliateSale(
                        network="shareasale",
                        transaction_id=item.findtext("transid", ""),
                        sale_amount=float(item.findtext("saleamount", "0") or 0),
                        commission=float(item.findtext("commission", "0") or 0),
                        product_name=item.findtext("skulist", "Unknown"),
                        sale_date=date.today(),
                        status="approved" if item.findtext("voided", "0") == "0" else "rejected",
                    )
                )
            return sales
        except Exception as exc:
            logger.error("Failed to parse ShareASale response: %s", exc)
            return []

    def get_cj_report(self, start_date: date, end_date: date) -> List[AffiliateSale]:
        """Fetch CJ commission report via their REST API."""
        if not self.config.cj_configured():
            logger.warning("CJ not configured – skipping report.")
            return []

        try:
            import requests  # type: ignore

            headers = {
                "Authorization": f"Bearer {self.config.cj_api_key}",
                "Content-Type": "application/json",
            }
            params = {
                "website-ids": self.config.cj_website_id,
                "date": f"{start_date.isoformat()}/{end_date.isoformat()}",
                "count": 100,
            }
            response = requests.get(self.CJ_API, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            return self._parse_cj_response(data)
        except Exception as exc:
            logger.error("CJ report failed: %s", exc)
            return []

    def _parse_cj_response(self, data: Dict[str, Any]) -> List[AffiliateSale]:
        """Parse CJ API JSON response into AffiliateSale objects."""
        sales: List[AffiliateSale] = []
        try:
            for item in data.get("commissions", {}).get("commission", []):
                sales.append(
                    AffiliateSale(
                        network="cj",
                        transaction_id=str(item.get("order-id", "")),
                        sale_amount=float(item.get("sale-amount", {}).get("amount", 0)),
                        commission=float(item.get("commission-amount", {}).get("amount", 0)),
                        product_name=str(item.get("advertiser-name", "Unknown")),
                        sale_date=date.today(),
                        status=item.get("action-status", "pending").lower(),
                    )
                )
        except Exception as exc:
            logger.error("Failed to parse CJ response: %s", exc)
        return sales

    # ------------------------------------------------------------------
    # Opportunity analysis
    # ------------------------------------------------------------------

    def summarise_performance(self, sales: List[AffiliateSale]) -> List[NetworkSummary]:
        """Aggregate sales data by network."""
        network_data: Dict[str, Dict[str, Any]] = {}
        for sale in sales:
            n = sale.network
            if n not in network_data:
                network_data[n] = {
                    "clicks": 0,
                    "sales": 0,
                    "commission": 0.0,
                    "pending": 0.0,
                    "products": {},
                }
            network_data[n]["sales"] += 1
            if sale.status == "approved":
                network_data[n]["commission"] += sale.commission
            else:
                network_data[n]["pending"] += sale.commission
            network_data[n]["products"][sale.product_name] = (
                network_data[n]["products"].get(sale.product_name, 0) + sale.commission
            )

        summaries: List[NetworkSummary] = []
        for network, d in network_data.items():
            top_products = sorted(d["products"], key=lambda k: d["products"][k], reverse=True)[:5]
            summaries.append(
                NetworkSummary(
                    network=network,
                    total_clicks=d["clicks"],
                    total_sales=d["sales"],
                    total_commission=round(d["commission"], 2),
                    pending_commission=round(d["pending"], 2),
                    top_products=top_products,
                )
            )
        return summaries

    def get_all_links(self) -> List[AffiliateLink]:
        return list(self._link_registry.values())
