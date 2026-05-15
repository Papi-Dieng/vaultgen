import { LS_ACCOUNTS, LS_USER } from "../constants";

export const loadAccounts = () => {
  try {
    const r = localStorage.getItem(LS_ACCOUNTS);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
};

export const saveAccountsLS = (accounts) => {
  try {
    localStorage.setItem(LS_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error("Erreur sauvegarde localStorage:", e);
  }
};

export const loadUser = () => {
  try {
    const r = localStorage.getItem(LS_USER);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user) => {
  try {
    localStorage.setItem(LS_USER, JSON.stringify(user));
  } catch (e) {
    console.error("Erreur sauvegarde user:", e);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(LS_USER);
  } catch {}
};
