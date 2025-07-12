import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { CameraIcon } from "../icons";
import useGetMode from "../../hooks/GetMode";

// 🚫 MVP: Mock ImagePicker for MVP (image crop functionality disabled)
const ImagePicker = {
  openPicker: () =>
    Promise.reject(new Error("Image crop functionality disabled for MVP")),
  openCamera: () =>
    Promise.reject(new Error("Image crop functionality disabled for MVP")),
  openCropper: () =>
    Promise.reject(new Error("Image crop functionality disabled for MVP")),
  clean: () => Promise.resolve(),
  cleanSingle: () => Promise.resolve(),
};

export default function PickImageButton({
  handleSetPhotoPost,
}: {
  handleSetPhotoPost: (mimeType: string, uri: string, size: number) => void;
}) {
  const dark = useGetMode();
  const backgroundColor = dark ? "white" : "black";
  const backgroundColorView = "#FD5E02";
  const rippleColor = !dark ? "#ABABAB" : "#55555500";

  return (
    <View
      style={{
        width: 40,
        backgroundColor: backgroundColorView,
        borderRadius: 999,
        overflow: "hidden",
        height: 40,
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {
          ImagePicker.openPicker({
            cropperStatusBarColor: "#000000",
            cropperToolbarColor: "#000000",
            showCropGuidelines: false,
            cropperTintColor: "red",
            cropperActiveWidgetColor: "red",
            mediaType: "photo",
            cropperToolbarWidgetColor: "#FFFFFF",
            cropperCancelText: "#FFFFFF",
            cropperChooseColor: "#FFFFFF",
          })
            .then((image) => {
              handleSetPhotoPost(image?.mime, image?.path, image?.size);
            })
            .catch((e) => {});
        }}
        android_ripple={{ color: rippleColor, foreground: true }}
        style={{
          width: 30,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CameraIcon color={"white"} size={25} />
      </Pressable>
    </View>
  );
}
