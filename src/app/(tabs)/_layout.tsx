import { NativeTabs } from "expo-router/unstable-native-tabs";

const GOLD = "#DAA520";
const TAB_BG = "#FFFFFF";
const TAB_LABEL = "#000000";

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={TAB_BG}
      blurEffect="none"
      // tintColor={GOLD}
      disableTransparentOnScrollEdge
      iconColor={{ default: TAB_LABEL, selected: GOLD }}
      indicatorColor={GOLD}
      labelStyle={{
        default: { color: TAB_LABEL, fontSize: 11 },
        selected: { color: TAB_LABEL, fontSize: 11, fontWeight: "700" },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Naslovna</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("../../../assets/images/tabIcons/naslovna.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="istaknuto">
        <NativeTabs.Trigger.Label>Istaknuto</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("../../../assets/images/tabIcons/istaknuto.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="najnovije">
        <NativeTabs.Trigger.Label>Najnovije</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("../../../assets/images/tabIcons/najnovije.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="video">
        <NativeTabs.Trigger.Label>Video</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("../../../assets/images/tabIcons/video.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pretraga">
        <NativeTabs.Trigger.Label>Pretraga</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("../../../assets/images/tabIcons/pretraga.png")}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
