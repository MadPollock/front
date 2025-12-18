import { User } from '../contexts/AuthContext';

export interface CommandContext {
  accessToken?: string;
  user: User | null;
  mfaCode?: string;
}

/**
 * Submit a write-model command via the secured API gateway.
 * Ensures Auth0 access token, user identity, role, and MFA code (when present)
 * are forwarded so the backend can validate authorization and step-up auth.
 */
export async function postCommand(
  command: string,
  payload: Record<string, unknown>,
  context: CommandContext
) {
  const commandApiBase = import.meta.env?.VITE_COMMAND_API_URL;

  if (!commandApiBase) {
    throw new Error('VITE_COMMAND_API_URL is not configured for command routing');
  }

  if (!context.accessToken) {
    throw new Error('Missing Auth0 access token for secure command submission');
  }

  const url = `${commandApiBase.replace(/\/$/, '')}/${command}`;
  const enrichedPayload = {
    ...payload,
    mfaCode: context.mfaCode,
    userContext: {
      id: context.user?.id,
      role: context.user?.role,
      metadata: context.user?.metadata ?? {},
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${context.accessToken}`,
      'x-user-id': context.user?.id || '',
      'x-user-role': context.user?.role || '',
      'x-user-metadata': JSON.stringify(context.user?.metadata ?? {}),
    },
    body: JSON.stringify(enrichedPayload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Command ${command} failed with status ${response.status}`);
  }

  return response.json().catch(() => undefined);
}
