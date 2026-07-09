import { NativeTabs } from "expo-router/unstable-native-tabs";
import { VectorIcon } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const GOLD = "#DAA520";
const TAB_BG = "#FFFFFF";
const TAB_LABEL = "#000000";

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={TAB_BG}
      blurEffect="none"
      tintColor={GOLD}
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
          src={<VectorIcon family={Ionicons} name="home-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="istaknuto">
        <NativeTabs.Trigger.Label>Istaknuto</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={Ionicons} name="star-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="najnovije">
        <NativeTabs.Trigger.Label>Najnovije</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={Ionicons} name="time-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="video">
        <NativeTabs.Trigger.Label>Video</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={Ionicons} name="play-circle-outline" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pretraga">
        <NativeTabs.Trigger.Label>Pretraga</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={Ionicons} name="search-outline" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
