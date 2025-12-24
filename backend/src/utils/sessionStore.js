// Simple in-memory session store
// Stores sessionId -> userObject
const sessions = new Map();

module.exports = {
  sessions,
  // Helper to set session
  setSession: (sessionId, user) => {
    sessions.set(sessionId, user);
  },
  // Helper to get session
  getSession: (sessionId) => {
    return sessions.get(sessionId);
  },
  // Helper to remove session
  removeSession: (sessionId) => {
    sessions.delete(sessionId);
  },
  // Clear all sessions (for debugging or restart)
  clearSessions: () => {
    sessions.clear();
  }
};
