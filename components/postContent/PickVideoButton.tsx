import { View, Text, Pressable } from "react-native";
import React from "react";
import { CameraIcon, VideoIcon } from "../icons";
import * as ImagePicker from "expo-image-picker";
import useGetMode from "../../hooks/GetMode";
import { Video } from "react-native-compressor";
export default function PickVideoButton({
  handleSetPhotoPost,
  setProgress,
  setIsCompressing,
}: {
  handleSetPhotoPost: (mimeType: string, uri: string, size: number) => void;
  setProgress: any;
  setIsCompressing: any;
}) {
  const dark = useGetMode();
  const backgroundColor = dark ? "white" : "black";
  const backgroundColorView = !dark ? "white" : "black";
  const rippleColor = !dark ? "#ABABAB" : "#55555500";
  return (
    <View
      style={{
        borderColor: "#B4B4B488",
        borderWidth: 1,
        width: 100,
        borderRadius: 10,
        backgroundColor: backgroundColorView,
        overflow: "hidden",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={async () => {
          setIsCompressing(true);
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 0.7,
          });
          
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            try {
              const compressedUri = await Video.compress(
                asset.uri,
                {
                  progressDivider: 10,
                  downloadProgress: (progress) => {
                    console.log("Download Progress: ", progress);
                  },
                },
                (progress) => {
                  console.log("Compression Progress: ", progress);
                  setProgress(progress);
                }
              );
              
              handleSetPhotoPost(
                asset.mimeType || 'video/mp4',
                compressedUri,
                asset.fileSize || 0
              );
            } catch (error) {
              console.error("Video compression failed:", error);
              handleSetPhotoPost(
                asset.mimeType || 'video/mp4',
                asset.uri,
                asset.fileSize || 0
              );
            }
          }
          setIsCompressing(false);
        }}
        android_ripple={{ color: rippleColor, foreground: true }}
        style={{
          width: 100,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <VideoIcon color={backgroundColor} size={40} />
      </Pressable>
    </View>
  );
}
