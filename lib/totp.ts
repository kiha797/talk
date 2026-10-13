import {createHmac,createHash,randomBytes,timingSafeEqual,createCipheriv,createDecipheriv} from 'node:crypto';
import {env} from 'cloudflare:workers';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export {encodeBase32,decodeBase32,otpAt,matchOtp} from './totp-core';
import {encodeBase32} from './totp-core';
function key(){const k=(env as unknown as {OTP_ENCRYPTION_KEY?:string}).OTP_ENCRYPTION_KEY;if(!k||!/^[a-f0-9]{64}$/.test(k))throw Error('OTP encryption key unavailable');return Buffer.from(k,'hex')}
export function seal(secret:string,userId:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(),iv);cipher.setAAD(Buffer.from(userId));const encrypted=Buffer.concat([cipher.update(secret,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(v=>v.toString('base64url')).join('.')}
export function unseal(value:string,userId:string){const [iv,tag,data]=value.split('.').map(v=>Buffer.from(v,'base64url'));const decipher=createDecipheriv('aes-256-gcm',key(),iv);decipher.setAAD(Buffer.from(userId));decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8')}
export const randomToken=()=>randomBytes(32).toString('hex');
export const newOtpSecret=()=>encodeBase32(randomBytes(20));
export function recoveryCodes(){const codes=Array.from({length:10},()=>randomBytes(10).toString('hex').toUpperCase().match(/.{4}/g)!.join('-'));return {codes,hashes:codes.map(s=>digest(s.replace(/-/g,'').toUpperCase()))}}
export function recoveryHash(s:string){return /^[A-Fa-f0-9-]{20,24}$/.test(s)?digest(s.replace(/-/g,'').toUpperCase()):''}
