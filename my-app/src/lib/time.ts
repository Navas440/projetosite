export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "hoje";
  if (diffDays === 1) return "há 1 dia";
  if (diffDays < 30) return `há ${diffDays} dias`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "há 1 mês";
  if (diffMonths < 12) return `há ${diffMonths} meses`;

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "há 1 ano" : `há ${diffYears} anos`;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
