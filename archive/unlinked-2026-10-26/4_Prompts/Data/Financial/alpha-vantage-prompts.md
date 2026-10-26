---
title: "Alpha Vantage MCP Prompts"
tags: ["prompt","data","financial"]
---

# Alpha Vantage MCP Prompts

Real-time/historical stock quotes, technicals, forex, crypto, commodities, economic data, and options.

---

## 1. Daily Price History

> Pull the daily adjusted price history for **[TICKER]** using Alpha Vantage (`TIME_SERIES_DAILY_ADJUSTED`). Show the last 20 trading days in a table with date, open, high, low, close, adjusted close, and volume. Highlight any days with >3% moves.

## 2. Real-Time Quote

> Get the real-time quote for **[TICKER]** using Alpha Vantage (`GLOBAL_QUOTE`). Display the current price, change, change percent, volume, and previous close. Compare today's volume to the 50-day average if available.

## 3. Technical Analysis Combo

> Run a technical analysis on **[TICKER]** using Alpha Vantage. Pull RSI (14-day), MACD (12/26/9), Bollinger Bands (20-day), and SMA (50 and 200-day) on the daily timeframe. Summarize the signals: is the stock overbought/oversold, trending or range-bound, and are there any crossover signals?

## 4. Earnings Call Transcript Summary

> Fetch the most recent earnings call transcript for **[TICKER]** using Alpha Vantage (`EARNINGS_CALL_TRANSCRIPT`). Summarize the key themes: management guidance, revenue drivers, margin outlook, risks mentioned, and any notable analyst Q&A exchanges. Include sentiment signals if available.

## 5. Commodity Price Dashboard

> Build a commodity price dashboard using Alpha Vantage. Pull the latest prices for WTI crude oil, Brent crude, natural gas, gold, silver, copper, and wheat. Show each commodity's current price, monthly change, and YTD change in a summary table. Flag any commodities with unusual moves (>10% monthly change).

## 6. Forex Exchange Rates

> Get the current exchange rates for **[PAIRS]** (e.g., EUR/USD, GBP/USD, USD/JPY) using Alpha Vantage (`CURRENCY_EXCHANGE_RATE`). Display the bid/ask prices and calculate the daily range. If multiple pairs are provided, show them in a comparison table.

## 7. Crypto Price Tracker

> Track the crypto price action for **[SYMBOLS]** (e.g., BTC, ETH, SOL) using Alpha Vantage (`DIGITAL_CURRENCY_DAILY`). Show current price, 7-day change, 30-day change, 52-week high/low, and current distance from ATH for each. Present in a comparison table.

## 8. US Economic Indicators Dashboard

> Pull a US economic snapshot using Alpha Vantage. Fetch the latest data for Real GDP, CPI, inflation rate, federal funds rate, unemployment rate, nonfarm payroll, retail sales, and 10-year treasury yield. Present in a dashboard table with current value, prior value, and trend direction. Summarize what the data says about the current economic cycle.

## 9. Options Chain Analysis

> Pull the real-time options chain for **[TICKER]** using Alpha Vantage (`REALTIME_OPTIONS`). Show the nearest monthly expiration's calls and puts around the current price (5 strikes above and below ATM). Include strike, bid, ask, volume, open interest, implied volatility, and delta. Identify the highest-volume contracts and any unusual activity.

## 10. Market Movers & Sentiment

> Get today's market movers using Alpha Vantage (`TOP_GAINERS_LOSERS`). Show the top 10 gainers, top 10 losers, and top 10 most actively traded stocks. For each, include ticker, price, change %, and volume. Look for any sector patterns among the movers and provide a brief market color summary.
