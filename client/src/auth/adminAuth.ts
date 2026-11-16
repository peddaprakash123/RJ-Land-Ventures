/**
 * Admin access for the RJ Land Ventures admin console.
 *
 * Change ADMIN_PASSWORD below to set your own password.
 * Note: this is client-side authentication meant for a demo/prototype.
 * For production, validate the password on a secure backend instead.
 */
export const ADMIN_PASSWORD = 'prakash@123';

const ADMIN_SESSION_KEY = 'singara_admin_session';

export const hasAdminSession = (): boolean => {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

export const startAdminSession = (): void => {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } catch {
    // sessionStorage unavailable — the in-memory React state still works for this visit.
  }
};

export const endAdminSession = (): void => {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Ignore storage errors on logout.
  }
};
