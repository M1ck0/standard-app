import { useLocalSearchParams } from 'expo-router';

import { WebViewScreen } from '@/components/webview-screen';

const HOME_URL = 'https://standard.co.me/';

export default function NaslovnaTab() {
  const { link } = useLocalSearchParams<{ link?: string }>();
  return <WebViewScreen homeUrl={HOME_URL} initialUrl={link} />;
}
