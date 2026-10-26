---
title: "Financial Modeling Prep MCP"
tags: ["prompt","data","financial"]
---

# Financial Modeling Prep MCP

Financial statements, company fundamentals, analyst data, ratios, earnings calendars, and market screening.

---

## 1. Company Profile & Overview

> Get the full company profile for **[TICKER]** using Financial Modeling Prep. Show company description, sector, industry, market cap, employees, CEO, and website. Also pull the current quote to show today's price, P/E, and 52-week range. Provide a one-paragraph company overview suitable for an investment memo.

## 2. Financial Statement Summary (5-Year)

> Pull the last 5 years of annual financial statements for **[TICKER]** using Financial Modeling Prep. Fetch the income statement, balance sheet, and cash flow statement. Present a summary table showing revenue, gross profit, operating income, net income, total assets, total debt, free cash flow, and margins (gross, operating, net) for each year. Highlight trends and any red flags.

## 3. Comprehensive Ratio Analysis

> Run a comprehensive ratio analysis on **[TICKER]** using Financial Modeling Prep (`get_financial_ratios` and `get_key_metrics`). Cover profitability (ROE, ROA, ROIC, margins), liquidity (current ratio, quick ratio), leverage (debt/equity, interest coverage), efficiency (asset turnover, inventory turnover), and valuation (P/E, P/B, EV/EBITDA, P/FCF). Show 5-year trends and flag ratios that are deteriorating or significantly above/below industry norms.

## 4. Analyst Consensus & Price Targets

> Get the full analyst picture for **[TICKER]** using Financial Modeling Prep. Pull analyst ratings (upgrades/downgrades), price targets (low/median/high/consensus), and earnings estimates (next quarter and full year). Summarize the consensus view: how many buy/hold/sell ratings, the implied upside/downside from the consensus target, and whether estimates have been revised up or down recently.

## 5. Earnings & Economic Calendar

> Show the upcoming earnings calendar for the next 2 weeks using Financial Modeling Prep (`get_earnings_calendar`). List companies reporting with their expected date, estimated EPS, and prior EPS. Highlight any mega-cap or S&P 500 names reporting. Also pull the economic calendar for the same period and list key data releases (GDP, CPI, jobs, Fed meetings).

## 6. Sector Performance & Rotation

> Pull the current sector performance snapshot using Financial Modeling Prep (`get_sector_performance`). Show all sectors ranked by performance with their percentage change. Also get today's market gainers, losers, and most active stocks. Identify which sectors are leading/lagging and whether there's a risk-on or risk-off rotation happening.

## 7. Insider & Institutional Activity

> Check the insider and institutional activity for **[TICKER]** using Financial Modeling Prep. Pull recent insider transactions (`get_insider_trading`) and top institutional holders (`get_institutional_holders`). Summarize: are insiders net buying or selling over the last 90 days? Who are the largest institutional owners? Have any major funds recently increased or decreased their positions? Flag any notable cluster buying/selling.

## 8. S&P 500 Stock Screener

> Screen the S&P 500 using Financial Modeling Prep. Pull the constituent list (`get_sp500_constituents`), then for qualifying stocks get their quotes, key metrics, and financial ratios. Filter for stocks matching: **[CRITERIA]** (e.g., dividend yield >3%, P/E <20, ROE >15%). Present qualifying stocks in a ranked table with the key screening metrics.

## 9. Stock News & Sentiment

> Get the latest news for **[TICKER]** using Financial Modeling Prep (`get_stock_news`, 20 articles). Summarize the key headlines and themes. Categorize news as: earnings/guidance, analyst actions, M&A/deals, product/business updates, regulatory, or macro. Highlight any potentially market-moving stories and assess whether overall sentiment is bullish, bearish, or neutral.

## 10. Technical Signal Check

> Run a technical check on **[TICKER]** using Financial Modeling Prep. Pull the daily RSI (14-period), SMA (50 and 200-day), and EMA (12 and 26-day). Also get the 1-hour intraday chart for the last 5 days. Determine: is the stock above or below key moving averages? Is RSI overbought (>70) or oversold (<30)? Is there a golden cross or death cross? Summarize the technical posture in a brief trading note.
