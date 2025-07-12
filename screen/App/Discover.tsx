import {
  View,
  Text,
  Dimensions,
  useWindowDimensions,
  Platform,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AnimatedScreen from "../../components/global/AnimatedScreen";

import HeaderTag from "../../components/discover/HeaderTag";

import { useAppSelector } from "../../redux/hooks/hooks";

import { useState } from "react";

import { BlurView } from "expo-blur";
import useGetMode from "../../hooks/GetMode";
import PagerView from "react-native-pager-view";
import Posts from "./DiscoverScreens/Posts";
import Users from "./DiscoverScreens/Users";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isFeatureEnabled } from "../../config/featureFlags";

const { width, height } = Dimensions.get("window");
const renderScene = SceneMap({
  users: Users,
  posts: Posts,
});
const renderTabBar = (props: any) => {
  const dark = useGetMode();
  const backgroundColor = !dark ? "black" : "white";
  const color = !dark ? "black" : "white";
  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor }}
      android_ripple={{ color: "transparent" }}
      style={{ backgroundColor: "transparent", elevation: 0, marginTop: 80 }}
      labelStyle={{
        color,
        fontFamily: "mulishRegular",
        textTransform: "none",
      }}
      inactiveColor="grey"
      indicatorContainerStyle={{
        borderRadius: 999,
        width: width / 4,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: width / 5.4,
      }}
    />
  );
};
export default function Discover() {
  const posts = useAppSelector((state) => state.searchPost);
  const dark = useGetMode();
  const tint = dark ? "dark" : "light";
  const backgroundColor = dark ? "#1a1a1a" : "#f0f0f0";
  const color = dark ? "white" : "black";
  const persons = useAppSelector((state) => state.searchPeople);
  const { width } = Dimensions.get("window");
  const borderColor = dark ? "#FFFFFF7D" : "#4545452D";
  const [people, setPeople] = useState(true);
  const layout = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "users", title: "Users" },
    { key: "posts", title: "Posts" },
  ]);

  return (
    <AnimatedScreen style={{ minHeight: height }}>
      {/* 🚫 MVP: Advanced Search Coming Soon Banner */}
      {!isFeatureEnabled("ADVANCED_SEARCH") && (
        <View
          style={{
            backgroundColor,
            padding: 12,
            marginHorizontal: 16,
            marginTop: 160,
            marginBottom: 16,
            borderRadius: 8,
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Text
            style={{
              color,
              fontFamily: "mulishBold",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            🔍 Advanced search features coming soon!
          </Text>
          <Text
            style={{
              color,
              fontFamily: "mulish",
              fontSize: 12,
              textAlign: "center",
              marginTop: 4,
              opacity: 0.7,
            }}
          >
            Basic search is available - filters and sorting on the way
          </Text>
        </View>
      )}

      <BlurView
        tint={tint}
        experimentalBlurMethod="dimezisBlurView"
        intensity={100}
        style={{
          position: "absolute",
          height: Platform.select({ ios: 129 + top / 2, android: 129 }),
          width,
          borderBottomWidth: 0.5,
          borderColor,
        }}
      />

      <TabView
        style={{ paddingTop: Platform.select({ ios: top / 2, android: 0 }) }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        lazy
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      {/* <View
        style={{
          flexDirection: "row",
          gap: 5,
          top: 90,
          position: "absolute",
          borderColor: "black",
          borderStyle: "dashed",
          borderWidth: 1,
          marginBottom: 14,
          zIndex: 999,
          alignItems: "center",
          borderRadius: 90,
          overflow: "hidden",
          marginLeft: 15,
          padding: 10,

          backgroundColor: "transparent",
        }}
      >
        <BlurView
          tint={tint}
          intensity={100}
          style={{ position: "absolute", height: 80, width: 150 }}
        />
        <HeaderTag
          onPress={() => setPeople(true)}
          text="People"
          selected={people}
        />
        <HeaderTag
          onPress={() => setPeople(false)}
          text="Posts"
          selected={!people}
        />
      </View> */}
    </AnimatedScreen>
  );
}
