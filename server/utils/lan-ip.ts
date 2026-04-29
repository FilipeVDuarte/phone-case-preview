import os from 'os';

function isPrivateIp(addr: string): boolean {
  return (
    addr.startsWith('192.168.') ||
    addr.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(addr)
  );
}

export function getLanIp(): string {
  const interfaces = os.networkInterfaces();
  let fallback: string | null = null;

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const addr of iface) {
      if (addr.family !== 'IPv4' || addr.internal) continue;
      if (isPrivateIp(addr.address)) return addr.address;
      if (!fallback) fallback = addr.address;
    }
  }

  return fallback ?? 'localhost';
}
