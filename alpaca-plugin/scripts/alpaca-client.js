#!/usr/bin/env node

/**
 * Direct Alpaca Markets API client using Node.js built-in https module
 * No external dependencies - uses REST API endpoints directly
 *
 * Supports both paper trading (default) and live trading
 * Market data uses a separate endpoint
 */

const https = require('https');
const { execSync } = require('child_process');

/**
 * Resolve environment variable value, handling 1Password references
 * If value starts with 'op://', uses 1Password CLI to retrieve the secret
 */
function resolveEnvValue(value) {
  if (!value) return value;
  if (value.startsWith('op://')) {
    try {
      return execSync(`op read "${value}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (error) {
      console.error(`Error resolving 1Password reference: ${value}`);
      console.error('Make sure 1Password CLI is installed and you are signed in.');
      console.error('Install: https://developer.1password.com/docs/cli/get-started/');
      process.exit(1);
    }
  }
  return value;
}

class AlpacaClient {
  constructor() {
    // Check for required environment variables
    const required = ['ALPACA_API_KEY', 'ALPACA_API_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
      console.error('\nPlease set the following in your .claude/settings.json:');
      console.error(JSON.stringify({
        "env": {
          "ALPACA_API_KEY": "your-api-key-id",
          "ALPACA_API_SECRET": "your-api-secret-key",
          "ALPACA_PAPER": "true"
        }
      }, null, 2));
      process.exit(1);
    }

    this.apiKey = resolveEnvValue(process.env.ALPACA_API_KEY);
    this.apiSecret = resolveEnvValue(process.env.ALPACA_API_SECRET);

    // Default to paper trading for safety
    const isPaper = process.env.ALPACA_PAPER !== 'false';
    this.tradingHost = isPaper ? 'paper-api.alpaca.markets' : 'api.alpaca.markets';
    this.dataHost = 'data.alpaca.markets';
    this.baseUrl = '/v2';
  }

  /**
   * Make an HTTP request to Alpaca Trading API
   */
  async request(method, path, body = null, useDataApi = false) {
    return new Promise((resolve, reject) => {
      const host = useDataApi ? this.dataHost : this.tradingHost;

      const options = {
        hostname: host,
        port: 443,
        path: `${this.baseUrl}${path}`,
        method: method,
        headers: {
          'APCA-API-KEY-ID': this.apiKey,
          'APCA-API-SECRET-KEY': this.apiSecret,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = data ? JSON.parse(data) : {};
              resolve(parsed);
            } catch (e) {
              resolve(data);
            }
          } else {
            try {
              const error = JSON.parse(data);
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || error.code || data}`));
            } catch (e) {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  // ==================== Account ====================

  /**
   * GET /v2/account - Get account information
   */
  async getAccount() {
    return this.request('GET', '/account');
  }

  /**
   * GET /v2/account/portfolio/history - Get portfolio history
   */
  async getPortfolioHistory(options = {}) {
    const params = new URLSearchParams();
    if (options.period) params.append('period', options.period);
    if (options.timeframe) params.append('timeframe', options.timeframe);
    if (options.intraday_reporting) params.append('intraday_reporting', options.intraday_reporting);
    if (options.start) params.append('start', options.start);
    if (options.end) params.append('end', options.end);

    const query = params.toString();
    return this.request('GET', `/account/portfolio/history${query ? '?' + query : ''}`);
  }

  // ==================== Positions ====================

  /**
   * GET /v2/positions - Get all open positions
   */
  async getPositions() {
    return this.request('GET', '/positions');
  }

  /**
   * GET /v2/positions/{symbol} - Get position for a specific symbol
   */
  async getPosition(symbol) {
    return this.request('GET', `/positions/${encodeURIComponent(symbol)}`);
  }

  /**
   * DELETE /v2/positions/{symbol} - Close a position
   */
  async closePosition(symbol, options = {}) {
    const params = new URLSearchParams();
    if (options.qty) params.append('qty', options.qty);
    if (options.percentage) params.append('percentage', options.percentage);

    const query = params.toString();
    return this.request('DELETE', `/positions/${encodeURIComponent(symbol)}${query ? '?' + query : ''}`);
  }

  /**
   * DELETE /v2/positions - Close all positions
   */
  async closeAllPositions(cancelOrders = false) {
    const params = new URLSearchParams();
    params.append('cancel_orders', cancelOrders);
    return this.request('DELETE', `/positions?${params.toString()}`);
  }

  // ==================== Orders ====================

  /**
   * GET /v2/orders - Get all orders
   */
  async getOrders(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.limit) params.append('limit', options.limit);
    if (options.after) params.append('after', options.after);
    if (options.until) params.append('until', options.until);
    if (options.direction) params.append('direction', options.direction);
    if (options.symbols) params.append('symbols', options.symbols);

    const query = params.toString();
    return this.request('GET', `/orders${query ? '?' + query : ''}`);
  }

  /**
   * GET /v2/orders/{order_id} - Get a specific order
   */
  async getOrder(orderId) {
    return this.request('GET', `/orders/${orderId}`);
  }

  /**
   * POST /v2/orders - Create an order
   */
  async createOrder(orderData) {
    return this.request('POST', '/orders', orderData);
  }

  /**
   * DELETE /v2/orders/{order_id} - Cancel an order
   */
  async cancelOrder(orderId) {
    return this.request('DELETE', `/orders/${orderId}`);
  }

  /**
   * DELETE /v2/orders - Cancel all orders
   */
  async cancelAllOrders() {
    return this.request('DELETE', '/orders');
  }

  /**
   * PATCH /v2/orders/{order_id} - Replace/modify an order
   */
  async replaceOrder(orderId, updates) {
    return this.request('PATCH', `/orders/${orderId}`, updates);
  }

  // ==================== Assets ====================

  /**
   * GET /v2/assets - Get all assets
   */
  async getAssets(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.asset_class) params.append('asset_class', options.asset_class);
    if (options.exchange) params.append('exchange', options.exchange);

    const query = params.toString();
    return this.request('GET', `/assets${query ? '?' + query : ''}`);
  }

  /**
   * GET /v2/assets/{symbol} - Get a specific asset
   */
  async getAsset(symbol) {
    return this.request('GET', `/assets/${encodeURIComponent(symbol)}`);
  }

  // ==================== Market Data ====================

  /**
   * GET /v2/stocks/{symbol}/quotes/latest - Get latest quote
   */
  async getLatestQuote(symbol) {
    return this.request('GET', `/stocks/${encodeURIComponent(symbol)}/quotes/latest`, null, true);
  }

  /**
   * GET /v2/stocks/{symbol}/trades/latest - Get latest trade
   */
  async getLatestTrade(symbol) {
    return this.request('GET', `/stocks/${encodeURIComponent(symbol)}/trades/latest`, null, true);
  }

  /**
   * GET /v2/stocks/{symbol}/bars - Get historical bars
   */
  async getBars(symbol, options = {}) {
    const params = new URLSearchParams();
    params.append('timeframe', options.timeframe || '1Day');
    if (options.start) params.append('start', options.start);
    if (options.end) params.append('end', options.end);
    if (options.limit) params.append('limit', options.limit);
    if (options.adjustment) params.append('adjustment', options.adjustment);
    if (options.feed) params.append('feed', options.feed);

    return this.request('GET', `/stocks/${encodeURIComponent(symbol)}/bars?${params.toString()}`, null, true);
  }

  /**
   * GET /v2/stocks/snapshots - Get snapshots for multiple symbols
   */
  async getSnapshots(symbols) {
    const params = new URLSearchParams();
    params.append('symbols', symbols.join(','));
    return this.request('GET', `/stocks/snapshots?${params.toString()}`, null, true);
  }

  // ==================== Watchlists ====================

  /**
   * GET /v2/watchlists - Get all watchlists
   */
  async getWatchlists() {
    return this.request('GET', '/watchlists');
  }

  /**
   * POST /v2/watchlists - Create a watchlist
   */
  async createWatchlist(name, symbols = []) {
    return this.request('POST', '/watchlists', { name, symbols });
  }

  /**
   * GET /v2/watchlists/{watchlist_id} - Get a specific watchlist
   */
  async getWatchlist(watchlistId) {
    return this.request('GET', `/watchlists/${watchlistId}`);
  }

  /**
   * PUT /v2/watchlists/{watchlist_id} - Update a watchlist
   */
  async updateWatchlist(watchlistId, name, symbols) {
    return this.request('PUT', `/watchlists/${watchlistId}`, { name, symbols });
  }

  /**
   * POST /v2/watchlists/{watchlist_id} - Add symbol to watchlist
   */
  async addToWatchlist(watchlistId, symbol) {
    return this.request('POST', `/watchlists/${watchlistId}`, { symbol });
  }

  /**
   * DELETE /v2/watchlists/{watchlist_id}/{symbol} - Remove symbol from watchlist
   */
  async removeFromWatchlist(watchlistId, symbol) {
    return this.request('DELETE', `/watchlists/${watchlistId}/${encodeURIComponent(symbol)}`);
  }

  /**
   * DELETE /v2/watchlists/{watchlist_id} - Delete a watchlist
   */
  async deleteWatchlist(watchlistId) {
    return this.request('DELETE', `/watchlists/${watchlistId}`);
  }

  // ==================== Calendar & Clock ====================

  /**
   * GET /v2/calendar - Get market calendar
   */
  async getCalendar(options = {}) {
    const params = new URLSearchParams();
    if (options.start) params.append('start', options.start);
    if (options.end) params.append('end', options.end);

    const query = params.toString();
    return this.request('GET', `/calendar${query ? '?' + query : ''}`);
  }

  /**
   * GET /v2/clock - Get market clock
   */
  async getClock() {
    return this.request('GET', '/clock');
  }

  // ==================== Account Activities ====================

  /**
   * GET /v2/account/activities - Get account activities
   */
  async getActivities(activityType = null, options = {}) {
    const path = activityType ? `/account/activities/${activityType}` : '/account/activities';
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);
    if (options.after) params.append('after', options.after);
    if (options.until) params.append('until', options.until);
    if (options.direction) params.append('direction', options.direction);
    if (options.page_size) params.append('page_size', options.page_size);
    if (options.page_token) params.append('page_token', options.page_token);

    const query = params.toString();
    return this.request('GET', `${path}${query ? '?' + query : ''}`);
  }
}

function getAlpacaClient() {
  return new AlpacaClient();
}

module.exports = { getAlpacaClient, AlpacaClient };
