import { View, Text, TextInput, Dimensions } from "react-native";
import React, { useState } from "react";

import InputText from "../../screen/Auth/components/InputText";
import useGetMode from "../../hooks/GetMode";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { ProfileIcon } from "../icons";
import { Image } from "expo-image";

const heightFromScreen = Dimensions.get("window").height;
export default function TextArea({
  handlePostText,
}: {
  handlePostText: (text: string) => void;
}) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const isDark = dark;
  const color = isDark ? "white" : "black";
  const [height, setHeight] = useState(50);
  const userDetails = useAppSelector((state) => state.user.data);

  // 📝 [DEBUG] TextArea Render
  console.log("📝 [DEBUG] TextArea component rendered.");
  console.log(
    "📝 [DEBUG] userDetails object:",
    JSON.stringify(userDetails, null, 2)
  );

  // ✅ Defensive Guard: If for any reason userDetails is null, render a safe fallback.
  if (!userDetails) {
    console.log(
      "🚨 [DEBUG] userDetails is null or undefined. Rendering fallback."
    );
    return (
      <View style={{ flex: 1, flexDirection: "row", gap: 10, marginTop: 40 }}>
        <ProfileIcon color={color} size={55} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "grey" }}>Loading user...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 40 }}>
        {userDetails?.imageUri ? (
          <Image
            style={{ height: 50, width: 50, borderRadius: 9999 }}
            source={{ uri: userDetails?.imageUri }}
          />
        ) : (
          <ProfileIcon color={color} size={55} />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={{ color, fontFamily: "jakaraBold" }}>
            @{userDetails?.userName || userDetails?.username || "user"}
          </Text>
        </View>
      </View>
      <View style={{ marginLeft: 55, minHeight: heightFromScreen / 20 }}>
        <TextInput
          multiline
          maxLength={400}
          onChangeText={handlePostText}
          cursorColor={color}
          onContentSizeChange={(event) => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
          style={{
            fontSize: 16,
            color,

            fontFamily: "mulishMedium",
            minHeight: height,
            alignItems: "flex-start",
          }}
          placeholderTextColor={"grey"}
          placeholder="What's happening?"
        />
      </View>
    </View>
  );
}
