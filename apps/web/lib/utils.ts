import { env } from '@/env.mjs';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse } from './types';

export function isSlugValid(slug: string) {
  // check if slug contains invalid characters
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(slug.toLowerCase())) {
    return false;
  }

  return true;
}

export function formatRootUrl(subdomain?: string, path?: string) {
  const protocol = env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${subdomain ? `${subdomain}.` : ''}${env.NEXT_PUBLIC_ROOT_DOMAIN}${path ? path : ''}`;
}

export const formatHtmlToMd = (htmlString: string): string => {
  let formattedString = htmlString;

  // Replace <strong> with ** for bold text
  formattedString = formattedString.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

  // Replace <em> with * for italic text
  formattedString = formattedString.replace(/<em>(.*?)<\/em>/g, '*$1*');

  // Replace <a> with [text](url) for links
  formattedString = formattedString.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

  // Replace <ul> and <li> with dashes for unordered lists
  formattedString = formattedString.replace(/<ul>[\s\S]*?<\/ul>/g, (match) => {
    return match.replace(/<li>(.*?)<\/li>/g, '- $1').replace(/<\/?ul>/g, '');
  });

  // Replace <ol> and <li> with numbers for ordered lists
  formattedString = formattedString.replace(/<ol>[\s\S]*?<\/ol>/g, (match) => {
    let counter = 1;
    return match.replace(/<li>(.*?)<\/li>/g, (_, item) => `${counter++}. ${item}`).replace(/<\/?ol>/g, '');
  });

  // Replace <p> tags with two spaces and a newline character
  formattedString = formattedString.replace(/<p>([\s\S]*?)<\/p>/g, '$1  \n');

  // Replace <code> with backticks for inline code
  formattedString = formattedString.replace(/<code>(.*?)<\/code>/g, '`$1`');

  // Replace <pre> and <code> with triple backticks for code blocks
  formattedString = formattedString.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```');

  // Handle line breaks
  formattedString = formattedString.replace(/<br\s*\/?>/g, '  \n');

  return formattedString;
};

// Create api key token
export function generateApiToken(prefix: string, length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset.charAt(randomIndex);
  }

  return `${prefix}_${token}`;
}

interface SWRError extends Error {
  status: number;
}

// Fetcher function for SWR
// biome-ignore lint/suspicious/noExplicitAny: explicit any
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Action fetcher function for SWR
// biome-ignore lint/suspicious/noExplicitAny: explicit any
export async function actionFetcher<JSON = any>(
  input: RequestInfo,
  { arg }: { arg: Record<string, unknown>; method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' }
): Promise<JSON> {
  const requestOptions: RequestInit = {
    method: (arg.method as string) || 'POST',
    body: JSON.stringify(arg),
  };

  const res = await fetch((arg.inputOverride as RequestInfo | URL) || input, requestOptions);

  if (!res.ok) {
    const errorData = await res.json();
    const err = new Error(errorData.error) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Is valid email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Hex to hsl
export function hexToHSL(H: string | null | undefined) {
  if (!H) return;

  // Convert hex to RGB first
  let r = 0;
  let g = 0;
  let b = 0;
  if (H.length === 4) {
    r = Number.parseInt(H[1] + H[1], 16);
    g = Number.parseInt(H[2] + H[2], 16);
    b = Number.parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = Number.parseInt(H[1] + H[2], 16);
    g = Number.parseInt(H[3] + H[4], 16);
    b = Number.parseInt(H[5] + H[6], 16);
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

// hsl to hex
export function hslToHex(hsl: string | null) {
  if (!hsl) return;

  const [hStr, sStr, lStr] = hsl.replaceAll('%', '').split(' ');

  const h: number = Number.parseFloat(hStr) / 360;
  const s: number = Number.parseFloat(sStr) / 100;
  const l: number = Number.parseFloat(lStr) / 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      const t1: number = t < 0 ? t + 1 : t;
      const t2: number = t1 > 1 ? t1 - 1 : t1;
      if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
      if (t2 < 1 / 2) return q;
      if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// is valid url
export function isValidUrl(url: string): boolean {
  if (
    !/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9()!@:%_+.~#?&//=]*)/i.test(
      url.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}

// format time ago
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  // Show the date if it's more than 6 months
  if (interval > 0.5) {
    return date.toLocaleDateString();
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)}mo`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)}d`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)}h`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)}m`;
  }
  return `${Math.floor(seconds)}s`;
}

export async function uploadToSupabaseStorage(
  supabaseClient: SupabaseClient,
  bucketName: string,
  fileName: string,
  fileData: string | ArrayBuffer | Uint8Array | Blob,
  contentType: string,
  unique = false
): Promise<ApiResponse<string>> {
  // Check if file already exists
  const { data: dirFiles } = await supabaseClient.storage
    .from(bucketName)
    .list(fileName.split('/').slice(0, -1).join('/'));

  // Check if file with same name, but without the timestamp already exists
  const fileAlreadyExists =
    dirFiles?.filter((file) => {
      const fileNameWithoutTimestamp = fileName.split('/').pop()?.split('.')[0];
      return fileNameWithoutTimestamp ? file.name.includes(fileNameWithoutTimestamp) : false;
    }) ?? [];

  // Add timestamp to the file name
  const fileNameWithStamp = `${fileName.split('.').slice(0, -1)[0]}-${Date.now()}.${fileName
    .split('.')
    .pop()}`;

  // If file already exists and unique is true, replace the file instead of uploading a new one
  if (fileAlreadyExists && fileAlreadyExists.length > 0 && unique) {
    // Delete the existing file
    const { error: deleteError } = await supabaseClient.storage
      .from(bucketName)
      .remove([`${fileName.split('/').slice(0, -1).join('/')}/${fileAlreadyExists[0].name}`]);

    if (deleteError) {
      return {
        data: null,
        error: {
          message: deleteError.message,
          status: 500,
        },
      };
    }
  }

  const { error: uploadError } = await supabaseClient.storage
    .from(bucketName)
    .upload(fileNameWithStamp, fileData, {
      contentType,
    });

  if (uploadError) {
    return {
      data: null,
      error: {
        message: uploadError.message,
        status: 500,
      },
    };
  }

  // Get the public URL of the uploaded file
  const { data: publicUrlData } = await supabaseClient.storage
    .from(bucketName)
    .getPublicUrl(fileNameWithStamp);

  return {
    data: publicUrlData?.publicUrl,
    error: null,
  };
}

export async function signInAnonymously() {
  // Create a new Supabase client
  const supabase = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is already logged in, return
  if (user) {
    return { data: user, error: null };
  }

  // If not, log user in anonymously
  const { data, error } = await supabase.auth.signInAnonymously();

  return { data, error };
}

// Function to check if two objects are equal
// biome-ignore lint/suspicious/noExplicitAny: explicit any
export function areObjectsEqual(obj1: any, obj2: any): boolean {
  // Check if the objects are the same reference
  if (obj1 === obj2) return true;

  // Check if both arguments are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is different
  if (keys1.length !== keys2.length) return false;

  // Iterate over the keys and compare the values
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // Recursively compare nested objects
    const areEqual = areObjectsEqual(val1, val2);

    // Return false if the values are not equal
    if (!areEqual) return false;
  }

  // If all properties are equal, return true
  return true;
}
