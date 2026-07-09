import { WebViewScreen } from '@/components/webview-screen';
import { siteUrl } from '@/constants/site';

export default function IstaknutoTab() {
  return <WebViewScreen homeUrl={siteUrl('/istaknuto')} />;
}
