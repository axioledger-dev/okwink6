import request from './request'

/**
 * F168 Gaming Platform API
 * RESTful API for game categories, games list, favorites, and live data
 */

export const gamesApi = {
    /**
     * Get all game categories
     * @returns {Promise} Categories list
     */
    getCategories() {
        return request({
            url: '/v1/categories',
            method: 'get'
        })
    },

    /**
     * Get games list with filters
     * @param {Object} params - { category, page, limit, is_hot, is_new }
     * @returns {Promise} Games list with pagination
     */
    getGames(params = {}) {
        return request({
            url: '/v1/games',
            method: 'get',
            params
        })
    },

    /**
     * Get game details by ID
     * @param {number} gameId - Game ID
     * @returns {Promise} Game details
     */
    getGameById(gameId) {
        return request({
            url: `/v1/games/${gameId}`,
            method: 'get'
        })
    },

    /**
     * Get hot games
     * @param {Object} params - { limit }
     * @returns {Promise} Hot games list
     */
    getHotGames(params = {}) {
        return request({
            url: '/v1/games/hot',
            method: 'get',
            params
        })
    },

    /**
     * Search games by keyword
     * @param {Object} params - { keyword, page, limit }
     * @returns {Promise} Search results
     */
    searchGames(params) {
        return request({
            url: '/v1/games/search',
            method: 'get',
            params
        })
    },

    /**
     * Launch game (requires authentication)
     * @param {Object} data - { game_id, game_code }
     * @returns {Promise} Launch URL and game info
     */
    launchGame(data) {
        return request({
            url: '/v1/games/launch',
            method: 'post',
            data
        })
    },

    /**
     * Toggle game favorite status (requires authentication)
     * @param {Object} data - { game_id, is_favorite }
     * @returns {Promise} Updated favorite status
     */
    toggleFavorite(data) {
        return request({
            url: '/v1/games/favorite',
            method: 'post',
            data
        })
    },

    /**
     * Get user's favorite games (requires authentication)
     * @param {Object} params - { page, limit }
     * @returns {Promise} Favorite games list
     */
    getFavorites(params = {}) {
        return request({
            url: '/v1/games/favorites',
            method: 'get',
            params
        })
    },

    /**
     * Get recent big wins for live ticker
     * @param {Object} params - { limit }
     * @returns {Promise} Recent wins list
     */
    getLiveWinners(params = {}) {
        return request({
            url: '/v1/live-winners',
            method: 'get',
            params
        })
    },

    /**
     * Get system announcements
     * @param {Object} params - { page, limit }
     * @returns {Promise} Announcements list
     */
    getAnnouncements(params = {}) {
        return request({
            url: '/v1/announcements',
            method: 'get',
            params
        })
    }
}

export default gamesApi

// Made with Bob
