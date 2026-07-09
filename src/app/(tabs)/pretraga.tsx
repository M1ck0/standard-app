import { WebViewScreen } from '@/components/webview-screen';
import { siteUrl } from '@/constants/site';

export default function PretragaTab() {
  return <WebViewScreen homeUrl={siteUrl('/pretraga')} />;
}
