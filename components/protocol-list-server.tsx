import { ProtocolList } from './protocol-list';

interface ProtocolListServerProps {
  userEmail?: string;
}

export function ProtocolListServer({ userEmail }: ProtocolListServerProps) {
  const isAuthenticated = !!userEmail;
  
  return <ProtocolList isAuthenticated={isAuthenticated} />;
}
