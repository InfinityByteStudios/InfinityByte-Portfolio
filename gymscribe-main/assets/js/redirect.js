import { openDashboard, requireAuth, init } from './handler.js';

setTimeout(() => {
  if (requireAuth()) openDashboard();
}, 1000);