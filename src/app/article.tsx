import { useLocalSearchParams, useRouter } from "expo-router";

import { WebViewScreen } from "@/components/webview-screen";
import { siteUrl } from "@/constants/site";

const HOME_URL = siteUrl("/");

export default function ArticleScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url?: string }>();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return <WebViewScreen homeUrl={url || HOME_URL} onBack={goBack} />;
}
