import { WebViewScreen } from '@/components/webview-screen';
import { siteUrl } from '@/constants/site';

export default function VideoTab() {
  return <WebViewScreen homeUrl={siteUrl('/video')} />;
}
