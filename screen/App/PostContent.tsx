import {
  View,
  Text,
  Pressable,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import AnimatedScreen from "../../components/global/AnimatedScreen";
import { CloseCircleIcon } from "../../components/icons";
import PostButton from "../../components/postContent/PostButton";
import useGetMode from "../../hooks/GetMode";
import TextArea from "../../components/postContent/TextArea";
import { PostContentProp } from "../../types/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useCreatePostMutation } from "../../redux/api/posts";
import { openToast } from "../../redux/slice/toast/toast";

export default function PostContent({ navigation }: PostContentProp) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const [postText, setPostText] = useState("");
  const backgroundColor = dark ? "white" : "black";
  const [createPost] = useCreatePostMutation();
  const userState = useAppSelector((state) => state.user);

  const handlePostText = (text: string) => {
    setPostText(text);
  };

  const handlePostContent = async () => {
    if (userState.status !== "authenticated" || !userState.token) {
      dispatch(openToast({ text: "Please Login", type: "Failed" }));
      return;
    }

    if (!postText.trim()) {
      dispatch(
        openToast({ text: "Please add content to your post", type: "Failed" })
      );
      return;
    }

    const body = {
      content: postText,
      attachments: [],
    };

    try {
      await createPost(body).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error("🚨 createPost mutation failed:", error);
      dispatch(openToast({ text: "Failed to create post.", type: "Failed" }));
    }
  };

  return (
    <AnimatedScreen>
      <View style={{ flex: 1, padding: 20, marginTop: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 9999,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => {
                navigation.pop();
              }}
              style={{
                flex: 1,
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
              }}
              android_ripple={{ color: backgroundColor, foreground: true }}
            >
              <CloseCircleIcon size={30} color={backgroundColor} />
            </Pressable>
          </View>
          <PostButton
            isDisabled={!postText}
            isLoading={false} // Loading state is handled by the async flow
            onPress={handlePostContent}
          />
        </View>
        <TextArea handlePostText={handlePostText} />
        {/* All media-related UI has been removed for MVP stability */}
      </View>
    </AnimatedScreen>
  );
}
