export const normalizeRole = (role) => {
  if (!role) return null;
  const normalized = role.toLowerCase();

  if (normalized === 'receiver' || normalized === 'aid_seeker') return 'recipient';
  if (normalized === 'aid_provider') return 'donor';

  return normalized;
};

export const getDashboardPath = (role) => {
  const normalized = normalizeRole(role);

  switch (normalized) {
    case 'admin':
      return '/admin/dashboard';
    case 'donor':
      return '/donor/dashboard';
    case 'recipient':
      return '/receiver/dashboard';
    case 'organization':
      return '/admin/dashboard';
    default:
      return '/';
  }
};


