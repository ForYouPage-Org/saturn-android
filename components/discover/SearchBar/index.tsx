import {
  View,
  Text,
  TextInput,
  StyleProp,
  ViewStyle,
  Dimensions,
} from "react-native";
import useGetMode from "../../../hooks/GetMode";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../hooks/Debounce";
import { useLazySearchActorsQuery } from "../../../redux/api/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
export default function SearchBar() {
  const dark = useGetMode();
  const [searchParam, setSearchParam] = useState("");
  const color = dark ? "#FFFFFF" : "#000000";
  const placeholderColor = dark ? "#AAAAAA" : "#666666";
  const borderColor = dark ? "#FFFFFF" : "#DAD9D9";
  const backgroundColor = dark ? "#383838" : "#EAEBEB";
  const query = useDebounce(searchParam, 500); // Reduced debounce for better UX
  const insets = useSafeAreaInsets();
  const [getSearchActors, searchResults] = useLazySearchActorsQuery();

  useEffect(() => {
    if (query && query.trim().length > 0) {
      console.log("🔍 Searching for:", query);
      getSearchActors({ q: query.trim() });
    }
  }, [query]);

  useEffect(() => {
    if (searchResults.data) {
      console.log("🔍 Search results:", searchResults.data);
    }
    if (searchResults.error) {
      console.error("🚨 Search error:", searchResults.error);
    }
  }, [searchResults.data, searchResults.error]);

  return (
    <Animated.View
      entering={FadeInRight.springify()}
      style={[
        {
          width: width * 0.7,
          height: 40,
          marginLeft: 20,
          borderColor: borderColor,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          backgroundColor,
        },
      ]}
    >
      <TextInput
        value={searchParam}
        cursorColor={color}
        placeholder="Search users..."
        onChangeText={(text) => {
          setSearchParam(text);
          console.log("🔍 Search input:", text);
        }}
        placeholderTextColor={placeholderColor}
        style={{
          width: "100%",
          fontSize: 16,
          color,
          fontFamily: "jakara",
          includeFontPadding: false,
          textAlign: "left",
          textAlignVertical: "center",
        }}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </Animated.View>
  );
}
