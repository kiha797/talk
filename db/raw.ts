import { env } from 'cloudflare:workers';
export function raw(){if(!env.DB)throw new Error('DB unavailable');return env.DB;}
