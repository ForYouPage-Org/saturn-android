import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import useGetMode from "../../../../hooks/GetMode";

export default function ProfileImage({ imageUri }: { imageUri: string }) {
  console.log("rocket", imageUri);
  const dark = useGetMode();
  const color = dark ? "black" : "white";
  // ✅ CRASH FIX: Provide a fallback URI to prevent crashes from empty strings.
  const finalImageUri =
    imageUri || `https://ui-avatars.com/api/?name=?&background=random`;
  return (
    <Image
      source={{ uri: finalImageUri }}
      style={{ height: "100%", width: "100%" }}
      contentFit="cover"
      placeholder={{
        uri: "https://i.pinimg.com/564x/53/b7/18/53b718534120f2b34a2e21b65b6e0b74.jpg",
      }}
      placeholderContentFit="cover"
      transition={300}
    />
  );
}
