import { WebViewScreen } from '@/components/webview-screen';
import { siteUrl } from '@/constants/site';

export default function NajnovijeTab() {
  return <WebViewScreen homeUrl={siteUrl('/najnovije')} />;
}
