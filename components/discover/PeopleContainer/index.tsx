import { View, Text, Dimensions, Pressable } from "react-native";

import Animated, { FadeInLeft } from "react-native-reanimated";
import { useState } from "react";
import { IPerson } from "../../../types/api";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../../redux/api/user";
import {
  useLazyGetFollowDetailsQuery,
  useLazyGetUserQuery,
} from "../../../redux/api/user";
import { followUser as followUserAction, unfollowUser as unfollowUserAction } from "../../../redux/slice/user/followers";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import useGetMode from "../../../hooks/GetMode";
import { ProfileIcon } from "../../icons";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigationProp } from "../../../types/navigation";

const { width } = Dimensions.get("window");
export default function PeopleContainer({
  name,
  userName,
  id, //this is the id of the user that our user is trying to follow
  imageUri,
  isFollowed,
}: IPerson) {
  const [follow, setFollow] = useState(() => isFollowed);
  const user = useAppSelector((state) => state.user);
  const navigation = useNavigation<HomeNavigationProp>();

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const dispatch = useAppDispatch();
  const followedUserIds = useAppSelector((state) => state.followers.followedUserIds);
  const isCurrentlyFollowed = followedUserIds.includes(id) || false; //RAGHAVI ADDED
  
  const dark = useGetMode();
  const color = dark ? "white" : "black";
  const backgroundColor = !dark ? "#E5E9F899" : "#25252599";
  const nbuttonBackgroundColor = !dark ? "#FFFFFF" : "#000000";
  const fbuttonBackgroundColor = dark ? "#FFFFFF" : "#000000";
  const nBColor = !dark ? "white" : "black";
  const fBColor = dark ? "white" : "black";

  // const handleFollow = async () => {
  //   try {
  //     const wasFollowed = follow;
  //     setFollow(!follow);
      
  //     if (wasFollowed) {
  //       await unfollowUser({ id, username: userName }).unwrap();
  //     } else {
  //       await followUser({ id, username: userName }).unwrap();
  //     }
  //   } catch (error) {
  //     console.error("Follow/unfollow error:", error);
  //     // Revert state on error
  //     setFollow(follow);
  //   }
  // };

   //STEP 2: dispactches action that reducer uses to update slice of state
  // And uses a mutation to call the API to update the backend
const handleFollow = async () => {
    console.log("🔄 [USERCONTAINER] Follow button clicked! User:", userName, "ID:", id);
    console.log("🔄 [USERCONTAINER] Current follow state:", isCurrentlyFollowed);
    //console.log("🔄 [USERCONTAINER] followedUserIds array:", followedUserIds);
    
    try {
      const wasFollowed = isCurrentlyFollowed;
      
      // Optimistically update Redux state
      if (wasFollowed) {
        dispatch(unfollowUserAction(id));
        await unfollowUser({ username: userName }).unwrap();
      } else {
        dispatch(followUserAction(id));
        await followUser({ username: userName }).unwrap();
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      // Revert state on error
      if (isCurrentlyFollowed) {
        dispatch(followUserAction(id));
      } else {
        dispatch(unfollowUserAction(id));
      }
    }
  };
  const isMe = user.data?.userName === userName;
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("ProfilePeople", {
          id,
          imageUri,
          userTag: userName,
          name,
          verified: false,
        });
      }}
    >
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
          <View
            style={{
              borderRadius: 999,
              borderWidth: 1,
              backgroundColor: isCurrentlyFollowed ? fbuttonBackgroundColor : "transparent",
              overflow: "hidden",
              borderColor: fbuttonBackgroundColor,
            }}
          >
            <Pressable
              android_ripple={{ color: "white" }}
              onPress={handleFollow}
              style={{ paddingHorizontal: 10, paddingVertical: 6 }}
            >
              <Text
                style={{
                  fontFamily: "jakara",
                  color: !isCurrentlyFollowed ? fBColor : nBColor,
                  includeFontPadding: false,
                }}
              >
                {isCurrentlyFollowed ? "Following" : "Follow"}
              </Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
