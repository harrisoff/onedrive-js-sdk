import { scope } from './constants';

/**
 * Generate authentication url
 * @param clientId 
 * @param redirectUri 
 * @param type 
 * @returns 
 */
export function generateAuthUrl(
	clientId: string, redirectUri: string
) {
	return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
}
