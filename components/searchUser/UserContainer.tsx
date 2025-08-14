import { View, Text, Dimensions, Pressable, Modal } from "react-native";

import { ActivityIndicator, Button, Portal } from "react-native-paper";
import { BlurView } from "expo-blur";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { IPerson } from "../../types/api";
import { useNavigation } from "@react-navigation/native";
import useGetMode from "../../hooks/GetMode";
import { ProfileIcon } from "../icons";

import useSocket from "../../hooks/Socket";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { addToChatList } from "../../redux/slice/chat/chatlist";
import { followUser as followUserAction, unfollowUser as unfollowUserAction } from "../../redux/slice/user/followers";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../redux/api/user";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
export default function UserContainer({
  name,
  userName,
  id,
  imageUri,
  isFollowed,
}: IPerson) {
  const dark = useGetMode();
  const { height, width } = Dimensions.get("screen");
  const color = dark ? "white" : "black";
  const backgroundColor = !dark ? "#E5E9F899" : "#25252599";
  const dispatch = useAppDispatch();
  const fbuttonBackgroundColor = dark ? "#FFFFFF" : "#000000";
  const tint = dark ? "dark" : "light";
  const fBColor = dark ? "white" : "black";
  const navigation = useNavigation<any>();
  const socket = useSocket();
  //RAGHAVI ADDED
  const user = useAppSelector((state) => state?.user?.data);
  const followedUserIds = useAppSelector((state) => state.followers.followedUserIds);
  const [isOpen, setIsOpen] = useState(false);
  const isCurrentlyFollowed = followedUserIds.includes(id) || false; //RAGHAVI ADDED
  
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleMessage = () => {
    socket?.emit("startChat", id);
    setIsOpen(true);
  };

  //STEP 2: dispactches action that reducer uses to update slice of state
  // And uses a mutation to call the API to update the backend
// const handleFollow = async () => {
//     console.log("🔄 [USERCONTAINER] Follow button clicked! User:", userName, "ID:", id);
//     console.log("🔄 [USERCONTAINER] Current follow state:", isCurrentlyFollowed);
//     console.log("🔄 [USERCONTAINER] followedUserIds array:", followedUserIds);
    
//     try {
//       const wasFollowed = isCurrentlyFollowed;
      
//       // Optimistically update Redux state
//       if (wasFollowed) {
//         dispatch(unfollowUserAction(id));
//         await unfollowUser({ id, username: userName }).unwrap();
//       } else {
//         dispatch(followUserAction(id));
//         await followUser({ id, username: userName }).unwrap();
//       }
//     } catch (error) {
//       console.error("Follow/unfollow error:", error);
//       // Revert state on error
//       if (isCurrentlyFollowed) {
//         dispatch(followUserAction(id));
//       } else {
//         dispatch(unfollowUserAction(id));
//       }
//     }
//   };

  const isMe = user?.userName === userName;

  // Update local state when Redux state changes
  useEffect(() => {
    socket?.on("hello", (hello) => {
      console.log("😒", hello);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("newChat", (data) => {
      if (data?.senderId === user?.id) {
        dispatch(
          addToChatList({
            id: data?.id,
            messages: data?.messages,
            users: data?.users,
          })
        );
        navigation.replace("ChatScreen", {
          id: data.id,
          receiverId: id,
          name:
            data.users[0]?.id === user?.id
              ? data.users[1].userName
              : data.users[0].userName,
          imageUri:
            data.users[0]?.id === user?.id
              ? data.users[1].imageUri
              : data.users[0].imageUri,
        });
      }
    });
  }, [socket]);
  
  //STEP 1: Component structure
  return (
    <>
      <Portal>
        <>
          <View style={{ flex: 1 }}>
            <Modal
              statusBarTranslucent
              animationType="fade"
              transparent={true}
              visible={isOpen}
              style={{ justifyContent: "center", alignItems: "center" }}
              onRequestClose={closeModal}
            >
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                tint={tint}
                style={{ position: "absolute", height, width }}
                intensity={10}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="black" />
              </View>
            </Modal>
          </View>
        </>
      </Portal>
      <Animated.View
        entering={FadeInLeft.springify()}
        style={{
          width: "100%",
          overflow: "hidden",
          justifyContent: "space-between",
          padding: 6,
          alignItems: "center",
          flexDirection: "row",
          backgroundColor,
          borderRadius: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ height: 30, width: 30, borderRadius: 9999 }}
            />
          ) : (
            <ProfileIcon color={color} size={34} />
          )}
          <View>
            <Text style={{ fontSize: 16, fontFamily: "mulishBold", color }}>
              {name}
            </Text>
            <Text style={{ fontFamily: "jakara", fontSize: 12, color }}>
              @{userName}
            </Text>
          </View>
        </View>

        {!isMe && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                borderRadius: 999,
                borderWidth: 1,
                backgroundColor: isCurrentlyFollowed ? fbuttonBackgroundColor : "transparent",
                overflow: "hidden",
                borderColor: fbuttonBackgroundColor,
              }}
            >
              {/* // STEP 1.2: Once user clicks follow it calls to dispatch the followUserAction */}
              <Pressable
                android_ripple={{ color: "white" }}
                onPress={handleFollow}
                style={{ paddingHorizontal: 10, paddingVertical: 6 }}
              >
                <Text
                  style={{
                    fontFamily: "jakara",
                    color: !isCurrentlyFollowed ? fBColor : "blue",
                    includeFontPadding: false,
                  }}
                >
                  {isCurrentlyFollowed ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                borderRadius: 999,
                borderWidth: 1,
                backgroundColor: "transparent",
                overflow: "hidden",
                borderColor: fbuttonBackgroundColor,
              }}
            >
              <Pressable
                android_ripple={{ color: "white" }}
                onPress={handleMessage}
                style={{ paddingHorizontal: 10, paddingVertical: 6 }}
              >
                <Text
                  style={{
                    fontFamily: "jakara",
                    color: fBColor,
                    includeFontPadding: false,
                  }}
                >
                  {"Message"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>
    </>
  );
}
