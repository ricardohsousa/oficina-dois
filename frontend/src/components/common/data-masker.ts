/**
 * Mascarar dados sensíveis baseado no role
 */

export function maskCPF(cpf: string): string {
  if (!cpf || cpf.length < 11) return cpf;
  // Mostrar últimos 4 dígitos: XXX.XXX.XXX-12
  return `***.***.***-${cpf.slice(-2)}`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 8) return phone;
  // Mostrar últimos 4 dígitos: (XX) 9XXXX-1234
  return `(XX) XXXX-${phone.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (!username || username.length < 2) return email;
  // Mostrar primeiro e último caractere: a****@example.com
  const masked = username[0] + '*'.repeat(Math.max(1, username.length - 2)) + username.slice(-1);
  return `${masked}@${domain}`;
}

export function maskAddress(address: string): string {
  if (!address || address.length < 5) return address;
  // Mostrar apenas número e tipo de rua
  return `${address.split(',')[0]}...`;
}

export interface DataMaskRules {
  maskCPF?: boolean;
  maskPhone?: boolean;
  maskEmail?: boolean;
  maskAddress?: boolean;
}

export function shouldMaskData(userRole: string): DataMaskRules {
  // Voluntário mascara dados sensíveis de outros
  if (userRole === 'voluntario') {
    return {
      maskCPF: true,
      maskPhone: true,
      maskEmail: true,
      maskAddress: true
    };
  }

  // Professor e Coordenador veem tudo
  return {
    maskCPF: false,
    maskPhone: false,
    maskEmail: false,
    maskAddress: false
  };
}
