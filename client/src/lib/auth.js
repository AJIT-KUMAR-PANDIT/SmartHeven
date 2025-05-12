
import { toast } from '@/components/ui/use-toast';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export function getUserInfo() {
  try {
    return {
      id: document.querySelector('script[src="https://auth.util.repl.co/script.js"]')?.getAttribute('user-id'),
      name: document.querySelector('script[src="https://auth.util.repl.co/script.js"]')?.getAttribute('user-name'),
      roles: document.querySelector('script[src="https://auth.util.repl.co/script.js"]')?.getAttribute('user-roles')?.split(',') || []
    };
  } catch (err) {
    return null;
  }
}

export function requireAuth(requiredRoles = []) {
  const user = getUserInfo();
  if (!user?.id) {
    toast({
      title: "Authentication Required",
      description: "Please login to continue",
      variant: "destructive"
    });
    return false;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.some(role => user.roles.includes(role))) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to perform this action",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
}
