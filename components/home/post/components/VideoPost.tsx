import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import useGetMode from "../../../../hooks/GetMode";
import { PauseIcon, PlayIcon } from "../../../icons";
import LoadingIndicator from "./LoadingIndicator";
import IconButton from "../../../global/Buttons/IconButton";
// 🚫 MVP: expo-av is deprecated - use fallback for compatibility
let AVPlaybackStatus: any = null;
let ResizeMode: any = null;
let Video: any = null;
try {
  const expoAV = require("expo-av");
  AVPlaybackStatus = expoAV.AVPlaybackStatus;
  ResizeMode = expoAV.ResizeMode;
  Video = expoAV.Video;
} catch (error) {
  console.warn("expo-av not available, using fallback");
  AVPlaybackStatus = {};
  ResizeMode = { CONTAIN: "contain" };
  Video = ({ children, ...props }: any) => <View {...props}>{children}</View>;
}

import { isFeatureEnabled } from "../../../../config/featureFlags";

interface VideoPostProps {
  videoUri: string;
  thumbnail?: string;
  index: number;
  pause?: boolean;
  onPress?: () => void;
}

export default function VideoPost({
  videoUri,
  thumbnail,
  index,
  pause,
  onPress,
}: VideoPostProps) {
  // 🚫 MVP: Disable video functionality
  if (!isFeatureEnabled("VIDEO_UPLOAD")) {
    return (
      <View
        style={{
          height: 200,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "gray", fontSize: 16 }}>
          🎬 Video coming soon!
        </Text>
      </View>
    );
  }

  const navigation = useNavigation<HomeNavigationProp>();
  return (
    <View
      style={{
        height: 200,
        width: "100%",
        marginBottom: 10,
        marginTop: 10,
      }}
    >
      <View style={{ flex: 1, backgroundColor: "black", borderRadius: 10 }}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("VideoFullScreen", {
                videoUri,
                videoTitle: videoTitle || "",
                videoViews: videoViews || "0",
                userTag,
                name,
                imageUri,
                thumbNail,
              });
            }}
          >
            <PlayIcon size={50} color="white" />
          </Pressable>
        </View>
        <Image
          source={{ uri: thumbNail ? thumbNail : videoUri }}
          style={{ flex: 1, opacity: 0.6 }}
          contentFit="contain"
        />
      </View>
    </View>
  );
}
