#!/usr/bin/env node

/**
 * Direct Trello API client using Node.js built-in https module
 * No external dependencies - uses Trello REST API directly
 */

const https = require('https');

class TrelloClient {
  constructor() {
    // Check for required environment variables
    const required = ['TRELLO_API_KEY', 'TRELLO_TOKEN', 'TRELLO_BOARD_ID'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
      console.error('\nPlease set the following in your .claude/settings.json:');
      console.error(JSON.stringify({
        "env": {
          "TRELLO_API_KEY": "your-api-key-from-https://trello.com/app-key",
          "TRELLO_TOKEN": "your-token-generated-from-api-key-page",
          "TRELLO_BOARD_ID": "your-board-id-from-url"
        }
      }, null, 2));
      process.exit(1);
    }

    this.apiKey = process.env.TRELLO_API_KEY;
    this.token = process.env.TRELLO_TOKEN;
    this.boardId = process.env.TRELLO_BOARD_ID;
    this.host = 'api.trello.com';
    this.basePath = '/1';
  }

  /**
   * Build query string with auth parameters
   */
  buildQuery(params = {}) {
    const allParams = {
      key: this.apiKey,
      token: this.token,
      ...params
    };
    return new URLSearchParams(allParams).toString();
  }

  /**
   * Make an HTTP request to Trello API
   */
  async request(method, path, body = null, queryParams = {}) {
    return new Promise((resolve, reject) => {
      const query = this.buildQuery(queryParams);
      const fullPath = `${this.basePath}${path}?${query}`;

      const options = {
        hostname: this.host,
        port: 443,
        path: fullPath,
        method: method,
        headers: {
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
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || error.error || data}`));
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

  // ==================== BOARD OPERATIONS ====================

  /**
   * GET /1/boards/{id}
   */
  async getBoard(boardId = this.boardId) {
    return this.request('GET', `/boards/${boardId}`);
  }

  /**
   * GET /1/boards/{id}/lists
   */
  async getLists(boardId = this.boardId) {
    return this.request('GET', `/boards/${boardId}/lists`);
  }

  /**
   * GET /1/boards/{id}/cards
   */
  async getBoardCards(boardId = this.boardId) {
    return this.request('GET', `/boards/${boardId}/cards`);
  }

  /**
   * GET /1/boards/{id}/actions
   */
  async getBoardActivity(boardId = this.boardId, limit = 20) {
    return this.request('GET', `/boards/${boardId}/actions`, null, { limit });
  }

  /**
   * GET /1/boards/{id}/members
   */
  async getBoardMembers(boardId = this.boardId) {
    return this.request('GET', `/boards/${boardId}/members`);
  }

  /**
   * GET /1/boards/{id}/labels
   */
  async getBoardLabels(boardId = this.boardId) {
    return this.request('GET', `/boards/${boardId}/labels`);
  }

  // ==================== LIST OPERATIONS ====================

  /**
   * POST /1/lists
   */
  async createList(name, boardId = this.boardId, pos = 'bottom') {
    return this.request('POST', '/lists', null, { name, idBoard: boardId, pos });
  }

  /**
   * PUT /1/lists/{id}/closed
   */
  async archiveList(listId) {
    return this.request('PUT', `/lists/${listId}/closed`, null, { value: true });
  }

  /**
   * GET /1/lists/{id}/cards
   */
  async getListCards(listId) {
    return this.request('GET', `/lists/${listId}/cards`);
  }

  /**
   * PUT /1/lists/{id}
   */
  async updateList(listId, updates) {
    return this.request('PUT', `/lists/${listId}`, null, updates);
  }

  // ==================== CARD OPERATIONS ====================

  /**
   * GET /1/cards/{id}
   */
  async getCard(cardId) {
    return this.request('GET', `/cards/${cardId}`, null, {
      checklists: 'all',
      attachments: 'true',
      members: 'true',
      labels: 'true'
    });
  }

  /**
   * POST /1/cards
   */
  async createCard(cardData) {
    const params = {
      idList: cardData.idList,
      name: cardData.name,
      desc: cardData.desc || '',
      pos: cardData.pos || 'bottom'
    };

    if (cardData.due) params.due = cardData.due;
    if (cardData.start) params.start = cardData.start;
    if (cardData.idLabels) params.idLabels = cardData.idLabels;
    if (cardData.idMembers) params.idMembers = cardData.idMembers;

    return this.request('POST', '/cards', null, params);
  }

  /**
   * PUT /1/cards/{id}
   */
  async updateCard(cardId, updates) {
    return this.request('PUT', `/cards/${cardId}`, null, updates);
  }

  /**
   * PUT /1/cards/{id}/closed
   */
  async archiveCard(cardId) {
    return this.request('PUT', `/cards/${cardId}`, null, { closed: true });
  }

  /**
   * DELETE /1/cards/{id}
   */
  async deleteCard(cardId) {
    return this.request('DELETE', `/cards/${cardId}`);
  }

  /**
   * Move card to a different list
   */
  async moveCard(cardId, listId, pos = 'bottom') {
    return this.request('PUT', `/cards/${cardId}`, null, { idList: listId, pos });
  }

  // ==================== COMMENT OPERATIONS ====================

  /**
   * POST /1/cards/{id}/actions/comments
   */
  async addComment(cardId, text) {
    return this.request('POST', `/cards/${cardId}/actions/comments`, null, { text });
  }

  /**
   * GET /1/cards/{id}/actions
   */
  async getCardComments(cardId) {
    return this.request('GET', `/cards/${cardId}/actions`, null, { filter: 'commentCard' });
  }

  /**
   * PUT /1/actions/{id}
   */
  async updateComment(actionId, text) {
    return this.request('PUT', `/actions/${actionId}`, null, { text });
  }

  /**
   * DELETE /1/actions/{id}
   */
  async deleteComment(actionId) {
    return this.request('DELETE', `/actions/${actionId}`);
  }

  // ==================== CHECKLIST OPERATIONS ====================

  /**
   * GET /1/cards/{id}/checklists
   */
  async getCardChecklists(cardId) {
    return this.request('GET', `/cards/${cardId}/checklists`);
  }

  /**
   * POST /1/checklists
   */
  async createChecklist(cardId, name) {
    return this.request('POST', '/checklists', null, { idCard: cardId, name });
  }

  /**
   * POST /1/checklists/{id}/checkItems
   */
  async addChecklistItem(checklistId, name, checked = false) {
    return this.request('POST', `/checklists/${checklistId}/checkItems`, null, {
      name,
      checked: checked ? 'true' : 'false'
    });
  }

  /**
   * PUT /1/cards/{cardId}/checkItem/{checkItemId}
   */
  async updateChecklistItem(cardId, checkItemId, updates) {
    return this.request('PUT', `/cards/${cardId}/checkItem/${checkItemId}`, null, updates);
  }

  /**
   * DELETE /1/checklists/{id}/checkItems/{idCheckItem}
   */
  async deleteChecklistItem(checklistId, checkItemId) {
    return this.request('DELETE', `/checklists/${checklistId}/checkItems/${checkItemId}`);
  }

  /**
   * DELETE /1/checklists/{id}
   */
  async deleteChecklist(checklistId) {
    return this.request('DELETE', `/checklists/${checklistId}`);
  }

  // ==================== SEARCH OPERATIONS ====================

  /**
   * GET /1/search
   */
  async search(query, options = {}) {
    const params = {
      query: query,
      modelTypes: options.modelTypes || 'cards',
      cards_limit: options.limit || 20,
      card_board: 'true',
      card_list: 'true'
    };

    if (options.idBoards) {
      params.idBoards = options.idBoards;
    } else {
      params.idBoards = this.boardId;
    }

    return this.request('GET', '/search', null, params);
  }

  /**
   * Search cards by list name (Scrumban workflow helper)
   */
  async getCardsByListName(listName) {
    const lists = await this.getLists();
    const targetList = lists.find(l =>
      l.name.toLowerCase().includes(listName.toLowerCase())
    );

    if (!targetList) {
      throw new Error(`List "${listName}" not found. Available lists: ${lists.map(l => l.name).join(', ')}`);
    }

    return this.getListCards(targetList.id);
  }

  // ==================== MEMBER OPERATIONS ====================

  /**
   * GET /1/members/me
   */
  async getCurrentMember() {
    return this.request('GET', '/members/me');
  }

  /**
   * GET /1/members/me/cards
   */
  async getMyCards() {
    return this.request('GET', '/members/me/cards');
  }

  /**
   * Add member to card
   */
  async addMemberToCard(cardId, memberId) {
    return this.request('POST', `/cards/${cardId}/idMembers`, null, { value: memberId });
  }

  /**
   * Remove member from card
   */
  async removeMemberFromCard(cardId, memberId) {
    return this.request('DELETE', `/cards/${cardId}/idMembers/${memberId}`);
  }

  // ==================== LABEL OPERATIONS ====================

  /**
   * Add label to card
   */
  async addLabelToCard(cardId, labelId) {
    return this.request('POST', `/cards/${cardId}/idLabels`, null, { value: labelId });
  }

  /**
   * Remove label from card
   */
  async removeLabelFromCard(cardId, labelId) {
    return this.request('DELETE', `/cards/${cardId}/idLabels/${labelId}`);
  }

  // ==================== ATTACHMENT OPERATIONS ====================

  /**
   * GET /1/cards/{id}/attachments
   */
  async getCardAttachments(cardId) {
    return this.request('GET', `/cards/${cardId}/attachments`);
  }

  /**
   * POST /1/cards/{id}/attachments
   */
  async addAttachment(cardId, url, name = null) {
    const params = { url };
    if (name) params.name = name;
    return this.request('POST', `/cards/${cardId}/attachments`, null, params);
  }

  /**
   * DELETE /1/cards/{id}/attachments/{idAttachment}
   */
  async deleteAttachment(cardId, attachmentId) {
    return this.request('DELETE', `/cards/${cardId}/attachments/${attachmentId}`);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get list ID by name (helper for Scrumban workflow)
   */
  async getListIdByName(listName) {
    const lists = await this.getLists();
    const list = lists.find(l =>
      l.name.toLowerCase() === listName.toLowerCase()
    );

    if (!list) {
      throw new Error(`List "${listName}" not found. Available lists: ${lists.map(l => l.name).join(', ')}`);
    }

    return list.id;
  }

  /**
   * Get all cards grouped by list (for board overview)
   */
  async getBoardOverview() {
    const [lists, cards] = await Promise.all([
      this.getLists(),
      this.getBoardCards()
    ]);

    return lists.map(list => ({
      ...list,
      cards: cards.filter(card => card.idList === list.id)
    }));
  }
}

function getTrelloClient() {
  return new TrelloClient();
}

module.exports = { getTrelloClient, TrelloClient };
