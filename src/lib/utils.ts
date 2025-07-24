import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOKEN_KEY, TOKEN_EXPIRY_KEY } from "@/utils/constant";
import Cookies from "js-cookie";
import { store, type RootState } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getParamsValue(params: URLSearchParams, key: string): string {
  try {
    const value = params.get(key);
    if (value) {
      return value || "";
    }
  } catch (er) {
    console.log(er);
    return "";
  }
  return "";
}

export const getTopLevelDomain = () => {
  if (typeof window === "undefined") return "";

  const { hostname } = window.location;
  const parts = hostname.split(".");

  if (hostname === "localhost" || parts.length <= 1) {
    return hostname;
  }
  return `.${parts.slice(-2).join(".")}`;
};

export function storeTokenWithDeadline(token: string) {
  const topLevelDomain = getTopLevelDomain();
  const expiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
  Cookies.set(TOKEN_KEY, token, { expires: 10, domain: topLevelDomain });
  Cookies.set(TOKEN_EXPIRY_KEY, expiry.toString(), {
    expires: 10,
    domain: topLevelDomain,
  });
}


export function isLoggedIn() {
  const isLogged = localStorage.getItem('isLoggedIn');
  return isLogged;
}



export const lightenHex = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round((255 - ((num >> 8) & 0x00ff)) * (percent / 100));
  let b = (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * (percent / 100));

  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const pluralize = (singularWord: string, count: number) => {
  if (count > 1 || count === 0) {
    return `${singularWord}s`;
  }

  return singularWord;
};

export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }

  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 1) {
    // Only one word in name → treat it as first name, leave last name empty
    return { firstName: nameParts[0], lastName: '' };
  }

  const lastName = nameParts[nameParts.length - 1] || '';
  const firstName = nameParts.slice(0, -1).join(' ');

  return { firstName, lastName };
};

interface UserEnums {
  [key: string]: string;
}
export const USERS_ENUMS: UserEnums = {
  'admin': 'Administrator',
  'read-only': 'Read Only',
  'super-admin': 'Super Administrator'
};

export type Role = 'admin' | 'read-only' | 'super-admin';

export const getRole = (): Role | undefined => {
  const state: RootState = store?.getState?.();
  return state?.auth?.user?.role;
};

export const isAdminUser = (): boolean => {
  const role: Role = getRole() as Role;
  return ['admin', 'super-admin'].includes(role);
};

export const allowedAdminRoles: Role[] = ['admin', 'super-admin'];
export const allowedUserRoles: Role[] = ['read-only'];