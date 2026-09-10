import { Layers } from 'lucide-react-native';

import { Placeholder } from '@/components/Placeholder';
import { useStore } from '@/state/store';

export default function CardsScreen() {
  const { t } = useStore();
  return <Placeholder title={t.cards} icon={Layers} />;
}
