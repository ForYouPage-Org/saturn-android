import { View, Text, useColorScheme, Pressable } from "react-native";
import React, { Ref, useEffect, useRef, useState } from "react";
import LikeButton from "./LikeButton";
import {
  ActivityUnfocused,
  HeartUnfocused,
  HeartsFocused,
  Love,
  MessageUnfocused,
  MessagesIcon,
  ShareUnfocused,
} from "../../../icons";
import useGetMode from "../../../../hooks/GetMode";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../../../redux/api/posts";
import RepostButton from "./RepostButton";

export default function Engagements({
  title,
  like,
  comments,
  isLiked,
  isReposted,
  id,
  handleShare,
}: {
  title?: string;
  like: number;
  comments?: number;
  id: string;
  isLiked: boolean;
  isReposted: boolean;
  handleShare: () => void;
}) {
  const dark = useGetMode();
  const isDark = dark;
  const shareColor = isDark ? "#91EC09" : "#639E0B";
  const [likeAmount, setLikeAmount] = useState(() => like);
  const [clicked, setClicked] = useState(() => isLiked);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  const [reposted, setRepost] = useState(() => isReposted);

  const handleClicked = (click: boolean) => {
    setClicked(click);

    if (!clicked) {
      // Like the post
      likePost({ id })
        .unwrap()
        .then((response) => {
          setLikeAmount(response.likes);
        })
        .catch((error) => {
          // Revert on error
          setClicked(false);
          setLikeAmount(like);
        });
      setLikeAmount(likeAmount + 1);
    } else {
      // Unlike the post
      unlikePost({ id })
        .unwrap()
        .then((response) => {
          setLikeAmount(response.likes);
        })
        .catch((error) => {
          // Revert on error
          setClicked(true);
          setLikeAmount(like);
        });
      setLikeAmount(likeAmount - 1);
    }
  };

  const handleRepost = (repost: boolean) => {
    setRepost(repost);
    // Note: Repost functionality not yet implemented in backend
  };

  const color = isDark ? "white" : "black";
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,

        alignItems: "center",

        gap: 6,
        justifyContent: "space-between",
      }}
    >
      {title && <Text>{title}</Text>}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {/* <IconWithValue
        animationRef={animationRef}
          IconUnfocused={MessageUnfocused}
          text={comments?.toString() || "0"}
          IconFocused={MessageUnfocused}
          clicked={clicked}
          setClicked={handleClicked}
        /> */}
        <LikeButton
          isLiked={isLiked}
          text={likeAmount.toString()}
          clicked={clicked}
          setClicked={handleClicked}
        />
        <RepostButton
          isPosted={isReposted}
          clicked={reposted}
          setReposted={handleRepost}
        />
      </View>
      <Pressable onPress={handleShare}>
        <ShareUnfocused size={20} color={shareColor} />
      </Pressable>
    </View>
  );
}
