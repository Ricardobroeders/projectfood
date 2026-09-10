import { Users } from 'lucide-react-native';

import { Placeholder } from '@/components/Placeholder';
import { useStore } from '@/state/store';

export default function FamilyScreen() {
  const { t } = useStore();
  return <Placeholder title={t.family} icon={Users} />;
}
