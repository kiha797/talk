import AccountShell from './account-shell';
import {provisionAdmin} from '../lib/provision-admin';
export const dynamic='force-dynamic';
export default async function Page(){await provisionAdmin();return <AccountShell/>}
