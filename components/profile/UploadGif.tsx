import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { CameraIcon } from "../icons";
import useGetMode from "../../hooks/GetMode";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { openToast } from "../../redux/slice/toast/toast";

// 🚫 MVP: Mock ImagePicker for MVP (image crop functionality disabled)
const ImagePicker = {
  openPicker: () => Promise.reject(new Error("Image crop functionality disabled for MVP")),
  openCamera: () => Promise.reject(new Error("Image crop functionality disabled for MVP")),
  openCropper: () => Promise.reject(new Error("Image crop functionality disabled for MVP")),
  clean: () => Promise.resolve(),
  cleanSingle: () => Promise.resolve(),
};

export default function PickGifButton({
  handleSetPhotoPost,
}: {
  handleSetPhotoPost: (mimeType: string, uri: string, size: number) => void;
}) {
  const dark = useGetMode();
  const borderColor = dark ? "white" : "black";
  const backgroundColorView = !dark ? "white" : "black";
  const dispatch = useAppDispatch();
  const rippleColor = !dark ? "#ABABAB" : "#55555500";
  return (
    <View
      style={{
        borderColor,
        borderWidth: 1,

        borderStyle: "dashed",
       
        borderRadius: 10,
        overflow: "hidden",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {
          ImagePicker.openPicker({
            cropping: false,
            cropperStatusBarColor: "#000000",
            cropperToolbarColor: "#000000",
            showCropGuidelines: false,
            cropperTintColor: "red",
            mediaType: "photo",
            cropperActiveWidgetColor: "red",
            cropperToolbarWidgetColor: "#FFFFFF",
            cropperCancelText: "#FFFFFF",
            cropperChooseColor: "#FFFFFF",
          })
            .then((image) => {
              if (image.size > 1200000 || image.mime !== "image/gif") {
                Alert.alert(
                  "Error",
                  "Gif of 1MB only!",
                  [{ text: "OK" }]
                );

                return;
              }

              handleSetPhotoPost(image?.mime, image?.path, image?.size);
            })
            .catch((e) => {});
        }}
        android_ripple={{ color: rippleColor, foreground: true }}
        style={{
          padding: 10,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CameraIcon size={20} color={borderColor} />
          <Text style={{ fontFamily: "jakaraBold", color: borderColor }}>
            Animated{" "}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
