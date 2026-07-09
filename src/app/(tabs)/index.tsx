import { WebViewScreen } from '@/components/webview-screen';
import { siteUrl } from '@/constants/site';

export default function NaslovnaTab() {
  return <WebViewScreen homeUrl={siteUrl('/')} />;
}
