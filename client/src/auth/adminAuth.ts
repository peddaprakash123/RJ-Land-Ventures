/**
 * Admin access for the RJ Land Ventures admin console.
 *
 * Change ADMIN_PASSWORD below to set your own password.
 * Note: this is client-side authentication meant for a demo/prototype.
 * For production, validate the password on a secure backend instead.
 */
export const ADMIN_PASSWORD = 'prakash@123';

let adminAuthed = false;

export const hasAdminSession = (): boolean => adminAuthed;

export const startAdminSession = (): void => {
  adminAuthed = true;
};

export const endAdminSession = (): void => {
  adminAuthed = false;
};
