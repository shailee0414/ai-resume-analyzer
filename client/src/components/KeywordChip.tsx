import { Badge } from '@/components/ui/badge';

interface KeywordChipProps {
  label: string;
  kind: 'strong' | 'missing';
}

export function KeywordChip({ label, kind }: KeywordChipProps) {
  return (
    <Badge variant={kind === 'strong' ? 'success' : 'danger'} className="mr-1.5 mt-1.5">
      {label}
    </Badge>
  );
}
