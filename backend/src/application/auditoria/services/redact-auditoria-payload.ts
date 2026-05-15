const maskCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 4) {
    return '***';
  }

  return `***${digits.slice(-4)}`;
};

const maskPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 4) {
    return '***';
  }

  return `***${digits.slice(-4)}`;
};

const maskEmail = (value: string): string => {
  const normalized = value.trim().toLowerCase();
  const [localPart, domain] = normalized.split('@');

  if (!localPart || !domain) {
    return '***';
  }

  const visible = localPart.slice(0, 2);
  return `${visible || '*'}***@${domain}`;
};

const redactByKey = (key: string, value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  switch (key) {
    case 'cpf':
      return maskCpf(value);
    case 'telefone':
      return maskPhone(value);
    case 'email':
      return maskEmail(value);
    case 'endereco':
      return '[REDACTED]';
    default:
      return value;
  }
};

export const redactAuditoriaPayload = (payload: unknown): unknown => {
  if (payload === null || payload === undefined) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => redactAuditoriaPayload(item));
  }

  if (typeof payload !== 'object') {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (value && typeof value === 'object') {
        return [key, redactAuditoriaPayload(value)];
      }

      return [key, redactByKey(key, value)];
    }),
  );
};
