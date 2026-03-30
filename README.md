# 🤖 AI Marketing Agent

An autonomous Python agent that manages **Google Ads campaigns** and **affiliate marketing** using AI-generated copy, automated bid optimisation, and consolidated performance reporting.

---

## ✨ Features

| Module | What it does |
|--------|-------------|
| **Google Ads** | Creates Search campaigns, generates responsive search ads, fetches performance data, and automatically optimises bids based on ROAS and CPC targets |
| **Affiliate Marketing** | Generates trackable affiliate links for **Amazon Associates**, **ShareASale**, and **Commission Junction (CJ)**, then fetches commission reports |
| **AI Content Generator** | Powered by **OpenAI GPT-4o** to write ad headlines, descriptions, blog posts, product reviews, and email copy. Falls back to templates when OpenAI is not configured |
| **Analytics & Reporting** | Aggregates data from all channels and saves daily **JSON + Markdown** reports with financial summaries and actionable recommendations |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/bibekth98/bibekth98.git
cd bibekth98
pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in your API credentials
```

### 3. Run in dry-run mode (safe – no live API calls)

```bash
# Single cycle
python -m agent.main run-once

# Continuous (runs every hour by default)
python -m agent.main run-forever
```

### 4. Create a campaign from the CLI

```bash
python -m agent.main create-campaign \
  --product "Noise-Cancelling Headphones" \
  --url "https://amzn.to/your-affiliate-link" \
  --audience "remote workers" \
  --keywords "best headphones" "noise cancelling headphones" \
  --budget 25
```

> **Note:** Set `AGENT_DRY_RUN=false` in `.env` to enable live API writes.

---

## 🔑 Required Environment Variables

Copy `.env.example` → `.env` and fill in:

### OpenAI
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | Model to use (default: `gpt-4o`) |

### Google Ads
| Variable | Description |
|----------|-------------|
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads developer token |
| `GOOGLE_ADS_CLIENT_ID` | OAuth2 client ID |
| `GOOGLE_ADS_CLIENT_SECRET` | OAuth2 client secret |
| `GOOGLE_ADS_REFRESH_TOKEN` | OAuth2 refresh token |
| `GOOGLE_ADS_CUSTOMER_ID` | Your Google Ads customer ID (no dashes) |

### Affiliate Networks (optional – configure the ones you use)
| Variable | Description |
|----------|-------------|
| `AMAZON_PARTNER_TAG` | Amazon Associates partner tag |
| `SHAREASALE_API_TOKEN` | ShareASale API token |
| `CJ_API_KEY` | Commission Junction API key |

### Agent Behaviour
| Variable | Default | Description |
|----------|---------|-------------|
| `AGENT_DRY_RUN` | `true` | Simulate writes without calling live APIs |
| `AGENT_CYCLE_INTERVAL_SECONDS` | `3600` | How often the agent runs (seconds) |
| `AGENT_MIN_ROAS_THRESHOLD` | `1.5` | Minimum ROAS before reducing bids |
| `AGENT_MAX_CPC_USD` | `5.0` | Maximum cost-per-click before reducing bids |

---

## 🗂️ Project Structure

```
bibekth98/
├── agent/
│   ├── __init__.py
│   ├── config.py            # Configuration (env vars)
│   ├── main.py              # Orchestrator & CLI entry-point
│   ├── google_ads.py        # Google Ads automation
│   ├── affiliate.py         # Affiliate link generation & reporting
│   ├── content_generator.py # AI-powered copy writing
│   └── analytics.py         # Report building & saving
├── tests/
│   ├── test_config.py
│   ├── test_google_ads.py
│   ├── test_affiliate.py
│   ├── test_content_generator.py
│   └── test_analytics.py
├── .env.example             # Environment variable template
├── requirements.txt
└── README.md
```

---

## 🧪 Running Tests

```bash
pip install pytest
python -m pytest tests/ -v
```

---

## ⚠️ Disclaimer

This tool interfaces with real advertising platforms and can spend real money. Always start in **dry-run mode** (`AGENT_DRY_RUN=true`, which is the default), review the generated reports, and only enable live mode once you are confident in the configuration.

