import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Portal } from "react-native-paper";
import useGetMode from "../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  closeLoadingModal,
  openLoadingModal,
} from "../../redux/slice/modal/loading";
import { Image } from "expo-image";
import Button from "../global/Buttons/Button";
import { CameraIcon, ProfileIcon } from "../icons";
import PickImageButton from "./UploadPic";
import { useLazyGetUserQuery } from "../../redux/api/user";
import PickGifButton from "./UploadGif";

const { height, width } = Dimensions.get("screen");
export const UploadPhotoModal = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const dark = useGetMode();
  const imageUri = useAppSelector((state) => state?.user?.data?.imageUri);
  const color = !dark ? "black" : "white";
  const tint = dark ? "dark" : "light";

  const [postPhoto, setPostPhoto] = useState<{
    mimeType: string;
    uri: string;
    size: number;
  } | null>(null);

  const [getUser, responseGetUser] = useLazyGetUserQuery();

  //  MOCK UPLOAD FUNCTIONALITY FOR MVP
  const handleSetPostPhoto = (mimeType: string, uri: string, size: number) => {
    // This is a placeholder. In a real app, you would handle the upload here.
    console.log(" MOCK UPLOAD:", { mimeType, uri, size });
    //  uploadPhoto({ mimeType, uri })
    //    .unwrap()
    //    .then((e) => {
    //      getUser(null).then((e)=>{}).catch((e)=>{});
    //    });
  };

  return (
    <>
      <>
        <>
          <Modal
            statusBarTranslucent
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={closeModal}
          >
            <BlurView
              tint={tint}
              experimentalBlurMethod="dimezisBlurView"
              style={{ position: "absolute", height, width }}
              intensity={40}
            />

            <View style={styles.centeredView}>
              <Pressable
                onPress={closeModal}
                style={{ height: "100%", width: "100%" }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                ></View>
              </Pressable>

              <View
                style={{
                  height: "60%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  pointerEvents: "box-none",
                }}
              >
                {imageUri ? (
                  <Image
                    style={{ height: 300, width: 300, borderRadius: 9999 }}
                    contentFit="contain"
                    source={{ uri: imageUri }}
                  />
                ) : (
                  <ProfileIcon size={400} color={color} />
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  zIndex: 999,
                  bottom: 40,
                  borderRadius: 10,
                  overflow: "hidden",
                  gap: 10,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PickImageButton handleSetPhotoPost={handleSetPostPhoto} />
                <PickGifButton handleSetPhotoPost={handleSetPostPhoto} />
              </View>
            </View>
          </Modal>
        </>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
