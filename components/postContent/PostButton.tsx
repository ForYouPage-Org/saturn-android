import { View, Text, Pressable } from "react-native";
import React from "react";
import useGetMode from "../../hooks/GetMode";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { openToast } from "../../redux/slice/toast/toast";
import { resetPost } from "../../redux/slice/post";

export default function PostButton({
  isLoading,
  isDisabled,
  onPress,
}: {
  isLoading: boolean;
  isDisabled?: boolean;
  onPress: () => void;
}) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();

  const backgroundColor = dark ? "white" : "black";
  const backgroundColorLoad = dark ? "#FFFFFF38" : "#00000041";
  const rippleColor = !dark ? "white" : "black";
  const color = !dark ? "white" : "black";
  return (
    <View
      style={{
        backgroundColor: !isLoading ? backgroundColor : backgroundColorLoad,
        height: 45,
        width: 80,
        borderRadius: 9999,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Pressable
        disabled={isLoading || isDisabled}
        onPress={() => {
          console.log("📝 [DEBUG] PostButton pressed!");
          console.log("📝 [DEBUG] isLoading:", isLoading);
          console.log("📝 [DEBUG] isDisabled:", isDisabled);
          console.log("📝 [DEBUG] onPress function:", typeof onPress);
          console.log("📝 [DEBUG] About to call resetPost...");
          try {
            dispatch(resetPost());
            console.log("📝 [DEBUG] resetPost called successfully");
            console.log("📝 [DEBUG] About to call onPress...");
            onPress();
            console.log("📝 [DEBUG] onPress called successfully");
          } catch (error) {
            console.error("📝 [DEBUG] Error in PostButton onPress:", error);
          }
        }}
        onPressIn={() => {
          console.log("📝 [DEBUG] PostButton press detected (onPressIn)");
        }}
        onPressOut={() => {
          console.log("📝 [DEBUG] PostButton press released (onPressOut)");
        }}
        android_ripple={{ color: rippleColor, foreground: true }}
        style={{
          height: 45,
          width: 80,

          borderRadius: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color, fontFamily: "mulishBold" }}>Post</Text>
      </Pressable>
    </View>
  );
}
