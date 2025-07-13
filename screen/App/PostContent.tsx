import {
  View,
  Text,
  Pressable,
  Platform,
  PermissionsAndroid,
  FlatList,
  Dimensions,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import AnimatedScreen from "../../components/global/AnimatedScreen";
import { CameraIcon, CloseCircleIcon } from "../../components/icons";
import PostButton from "../../components/postContent/PostButton";
import useGetMode from "../../hooks/GetMode";
import TextArea from "../../components/postContent/TextArea";
import { PostContentProp } from "../../types/navigation";

import { CameraRoll } from "../../hooks/useCameraRoll";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

import PickImageButton from "../../components/postContent/PickImageButton";
import VideoTextArea from "../../components/postContent/VideoTextArea";
import RingAudio from "../../components/home/post/components/RingAudio";
let Lottie: any = null;
try {
  Lottie = require("lottie-react-native").default;
} catch (error) {
  const { View } = require("react-native");
  Lottie = View;
}
import PickAudioButton from "../../components/postContent/PickAudioButton";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { ActivityIndicator } from "react-native-paper";
import { useCreatePostMutation } from "../../redux/api/posts";
import { useUploadMediaMutation } from "../../redux/api/media";
import { openToast } from "../../redux/slice/toast/toast";
import {
  closeLoadingModal,
  openLoadingModal,
} from "../../redux/slice/modal/loading";
import { setRoute } from "../../redux/slice/routes";
import { store } from "../../redux/store";
import PickVideoButton from "../../components/postContent/PickVideoButton";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import * as Progress from "react-native-progress";
import { isFeatureEnabled } from "../../config/featureFlags";

const width = Dimensions.get("window").width;

// Define proper type for photo data
interface PhotoData {
  node: {
    image: {
      uri: string;
      fileSize?: number;
    };
    type: string;
  };
}
export default function PostContent({ navigation }: PostContentProp) {
  console.log("📝 [DEBUG] PostContent component rendered");

  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [postPhoto, setPostPhoto] = useState<{
    mimeType: string;
    uri: string;
    size: number;
  } | null>(null);
  const [postAudio, setPostAudio] = useState<{
    mimeType: string;
    uri: string;
    name: string;
    size: number;
  } | null>(null);
  const backgroundColor = dark ? "white" : "black";
  const animationRef = useRef<any>(null);

  console.log("📝 [DEBUG] PostContent - dark mode:", dark);
  console.log("📝 [DEBUG] PostContent - backgroundColor:", backgroundColor);

  function handleSetPhotoPost(mimeType: string, uri: string, size: number) {
    setPostPhoto({
      mimeType,
      uri,
      size,
    });
    setPostAudio(null);
  }
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const animatedStyles = useAnimatedStyle(() => ({
    bottom: keyboard.height.value,
  }));

  const [fileToServer, setFTServer] = useState<string | undefined>(undefined);
  const [photoServer, setPhotoServer] = useState<
    { uri: string; width: number; height: number } | undefined
  >(undefined);
  const [videoThumbnail, setVideoThumbnail] = useState<string | undefined>(
    undefined
  );
  const [postText, setPostText] = useState<string | undefined>(undefined);
  const [done, setDone] = useState(true);
  const [videoTitle, setVideoTitle] = useState<string | undefined>(undefined);
  const { width } = useWindowDimensions();
  function handleSetAudioPost(
    mimeType: string,
    uri: string,
    size: number,
    name: string
  ) {
    // 🚫 MVP: Disable audio upload
    if (!isFeatureEnabled("AUDIO_UPLOAD")) {
      dispatch(
        openToast({ text: "Audio upload coming soon! 🎵", type: "Failed" })
      );
      return;
    }

    setPostAudio({
      mimeType,
      uri,
      size,
      name: name,
    });
    setPostPhoto(null);
  }
  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          (statuses) =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  useEffect(() => {
    async function getPicture() {
      if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        return;
      }

      CameraRoll.getPhotos({
        first: 20,

        assetType: "Photos",
      })
        .then((r: any) => {
          setPhotos(r.edges);
        })
        .catch((err: any) => {
          //Error Loading Images
        });
    }
    getPicture();
  }, []);

  useEffect(() => {
    // 🚫 MVP: Disable audio animations
    if (!isFeatureEnabled("AUDIO_UPLOAD")) {
      return;
    }

    if (postAudio) {
      animationRef.current?.play();
    }

    return () => {
      animationRef.current?.pause;
    };
  }, [postAudio]);

  const [uploadMedia] = useUploadMediaMutation();
  const [createPost] = useCreatePostMutation();
  const userState = useAppSelector((state) => state.user);

  console.log("📝 [DEBUG] PostContent - uploadMedia:", typeof uploadMedia);
  console.log("📝 [DEBUG] PostContent - createPost:", typeof createPost);
  console.log(
    "📝 [DEBUG] PostContent - API URL:",
    process.env.EXPO_PUBLIC_API_URL
  );
  console.log("📝 [DEBUG] PostContent - Full user state:", userState);
  console.log("📝 [DEBUG] PostContent - Full Redux state:", store.getState());
  console.log(
    "📝 [DEBUG] PostContent - Token:",
    userState?.token ? "EXISTS" : "NULL"
  );
  console.log(
    "📝 [DEBUG] PostContent - User data:",
    userState?.data ? "EXISTS" : "NULL"
  );
  console.log(
    "📝 [DEBUG] PostContent - User auth state:",
    userState?.token ? "AUTHENTICATED" : "NOT_AUTHENTICATED"
  );
  console.log(
    "📝 [DEBUG] PostContent - State rehydrated:",
    userState !== undefined ? "YES" : "NO"
  );

  // Show loading while Redux state is rehydrating
  if (!userState) {
    console.log(
      "📝 [DEBUG] PostContent - Waiting for Redux state rehydration..."
    );
    return (
      <AnimatedScreen>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={dark ? "white" : "black"} />
          <Text
            style={{
              marginTop: 10,
              color: dark ? "white" : "black",
              fontFamily: "mulish",
            }}
          >
            Loading...
          </Text>
        </View>
      </AnimatedScreen>
    );
  }

  // Monitor auth state changes
  useEffect(() => {
    console.log(
      "📝 [DEBUG] PostContent - Component mounted, checking auth state"
    );
    const fullState = store.getState();
    console.log(
      "📝 [DEBUG] PostContent - Full state from store:",
      fullState.user
    );

    if (userState) {
      console.log("📝 [DEBUG] PostContent - Auth state changed:", {
        hasToken: !!userState.token,
        hasData: !!userState.data,
        loading: userState.loading,
      });
    } else {
      console.log("📝 [DEBUG] PostContent - userState is null/undefined");
    }
  }, [userState]);

  // Check auth state on mount
  useEffect(() => {
    console.log(
      "📝 [DEBUG] PostContent - Component mounted, initial auth check"
    );
    const storeState = store.getState();
    console.log(
      "📝 [DEBUG] PostContent - Store user state on mount:",
      storeState.user
    );
    console.log(
      "📝 [DEBUG] PostContent - Selector user state on mount:",
      userState
    );
  }, []);

  useEffect(() => {
    if (postPhoto || postAudio) {
      setDone(false);
      const formData = new FormData();

      if (postPhoto) {
        const fileData = {
          uri: postPhoto.uri,
          type: postPhoto.mimeType,
          name: `file.${postPhoto.mimeType.split("/")[1]}`,
        } as any;
        formData.append("file", fileData);
      }

      if (postAudio) {
        const fileData = {
          uri: postAudio.uri,
          type: postAudio.mimeType,
          name: postAudio.name,
        } as any;
        formData.append("file", fileData);
      }

      uploadMedia(formData)
        .unwrap()
        .then((r) => {
          setDone(true);
          if (postPhoto?.mimeType.startsWith("image/")) {
            setPhotoServer({ uri: r.url, width: 400, height: 400 });
          } else {
            setFTServer(r.url);
          }
        })
        .catch((e) => {
          setDone(true);
          dispatch(openToast({ text: "Media didn't upload", type: "Failed" }));
        });
    }
  }, [postPhoto, postAudio]);

  const handlePostText = (text: string) => {
    setPostText(text);
  };

  const handlePostContent = () => {
    console.log("📝 [DEBUG] PostContent.handlePostContent called!");
    console.log("📝 [DEBUG] postText:", postText);
    console.log("📝 [DEBUG] postPhoto:", postPhoto);
    console.log("📝 [DEBUG] postAudio:", postAudio);
    console.log("📝 [DEBUG] photoServer:", photoServer);
    console.log("📝 [DEBUG] fileToServer:", fileToServer);
    console.log("📝 [DEBUG] createPost function:", typeof createPost);

    // Check if user is authenticated - get fresh state from store
    const currentUserState = store.getState().user;

    console.log(
      "📝 [DEBUG] Current user state at post time:",
      currentUserState
    );
    console.log(
      "📝 [DEBUG] Current token status:",
      currentUserState?.token ? "EXISTS" : "NULL"
    );

    if (!currentUserState?.token) {
      console.log("📝 [DEBUG] User not authenticated, showing login prompt");
      dispatch(
        openToast({ text: "Please log in to create posts", type: "Failed" })
      );
      dispatch(setRoute({ route: "Auth" }));
      return;
    }

    Keyboard.dismiss();

    if (!postText && !postPhoto && !postAudio) {
      console.log("📝 [DEBUG] No content to post, showing toast");
      dispatch(
        openToast({ text: "Please add content to your post", type: "Failed" })
      );
      return;
    }

    console.log("📝 [DEBUG] Opening loading modal...");
    dispatch(openLoadingModal());

    // Prepare attachments array for API
    const attachments = [];

    if (photoServer) {
      console.log("📝 [DEBUG] Adding photo attachment:", photoServer);
      attachments.push({
        id: Date.now().toString() + "_image", // Generate a unique ID for the attachment
        type: "image",
        url: photoServer.uri,
      });
    }

    if (fileToServer) {
      if (postAudio) {
        console.log("📝 [DEBUG] Adding audio attachment:", fileToServer);
        attachments.push({
          id: Date.now().toString() + "_audio", // Generate a unique ID for the attachment
          type: "audio",
          url: fileToServer,
        });
      } else if (postPhoto?.mimeType.startsWith("video/")) {
        console.log("📝 [DEBUG] Adding video attachment:", fileToServer);
        attachments.push({
          id: Date.now().toString() + "_video", // Generate a unique ID for the attachment
          type: "video",
          url: fileToServer,
        });
      }
    }

    const postData = {
      content: postText || "",
      attachments: attachments.length > 0 ? attachments : undefined,
      visibility: "public" as const,
    };

    console.log("📝 [DEBUG] Final post data:", postData);
    console.log("📝 [DEBUG] About to call createPost...");

    try {
      createPost(postData)
        .unwrap()
        .then((e) => {
          console.log("📝 [DEBUG] createPost success:", e);
          dispatch(openToast({ text: "Successfully posted", type: "Success" }));
          navigation.pop();
          dispatch(closeLoadingModal());
        })
        .catch((e) => {
          console.error("📝 [DEBUG] createPost error:", e);
          const errorMessage = e?.data?.error || "Post failed";
          dispatch(openToast({ text: errorMessage, type: "Failed" }));
          dispatch(closeLoadingModal());
        });
    } catch (error) {
      console.error("📝 [DEBUG] Exception in createPost:", error);
      dispatch(openToast({ text: "Post failed - exception", type: "Failed" }));
      dispatch(closeLoadingModal());
    }
  };
  const [progress, setProgress] = useState(0);
  console.log(
    "🚀 ~ file: PostContent.tsx:348 ~ PostContent ~ progress:",
    progress
  );

  const [compressing, setCompressing] = useState(false);
  console.log(
    "🚀 ~ file: PostContent.tsx:338 ~ PostContent ~ compressing:",
    compressing
  );

  useEffect(() => {
    if (progress > 0.9) {
      setProgress(0);
    }
  }, [progress]);

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
          {postPhoto || postAudio ? (
            <PostButton
              isDisabled={!done}
              isLoading={!done}
              onPress={handlePostContent}
            />
          ) : (
            <PostButton
              isDisabled={!postText}
              isLoading={!postText}
              onPress={handlePostContent}
            />
          )}
        </View>
        <TextArea handlePostText={handlePostText} />
        {(postAudio || postPhoto) && (
          <View
            style={{
              padding: 20,
              borderRadius: 9999,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Pressable
              onPress={() => {
                setFTServer(undefined);
                setPostAudio(null);
                setPostPhoto(null);
              }}
              style={{
                flex: 1,
                borderRadius: 9999,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
              }}
              android_ripple={{ color: "white", foreground: true }}
            >
              <CloseCircleIcon size={30} color={"red"} />
            </Pressable>
          </View>
        )}
        <View
          style={{
            height: 200,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!done ? (
            <View
              key={"portal"}
              style={{
                position: "absolute",
                zIndex: 9,
                left: 0,
                right: 0,
                top: 0,
                justifyContent: "center",
                alignItems: "center",
                bottom: 0,
              }}
            >
              {<ActivityIndicator size={40} color="white" />}
            </View>
          ) : (
            <></>
          )}
          {postPhoto && (
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
                paddingHorizontal: 20,
              }}
              source={{ uri: postPhoto?.uri }}
              contentFit="contain"
            />
          )}
          {postAudio && <RingAudio animationRef={animationRef} />}
        </View>

        {postPhoto?.mimeType === "video/mp4" && (
          <VideoTextArea
            value={videoTitle}
            onChangeText={(text) => {
              setVideoTitle(text);
            }}
          />
        )}
        {!postPhoto && !postAudio && (
          <Animated.View
            entering={FadeInDown.springify()}
            exiting={FadeOutDown.springify()}
            style={[
              {
                position: "absolute",
                bottom: 0,

                gap: 10,
                width,
                marginBottom: 20,
              },
              animatedStyles,
            ]}
          >
            {(progress > 0 || compressing) && (
              <Animated.View
                entering={FadeIn.springify()}
                exiting={FadeOut.springify()}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Progress.Bar
                  progress={progress}
                  animated
                  indeterminate={compressing}
                  color={dark ? "white" : "black"}
                  width={width * 0.95}
                />
              </Animated.View>
            )}

            <FlatList
              horizontal
              ListHeaderComponent={
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <PickImageButton handleSetPhotoPost={handleSetPhotoPost} />
                  {/* 🚫 MVP: Disable video upload */}
                  {isFeatureEnabled("VIDEO_UPLOAD") && (
                    <PickVideoButton
                      handleSetPhotoPost={handleSetPhotoPost}
                      setProgress={setProgress}
                      setIsCompressing={setCompressing}
                    />
                  )}
                  {/* 🚫 MVP: Disable audio upload */}
                  {isFeatureEnabled("AUDIO_UPLOAD") && (
                    <PickAudioButton handleSetAudioPost={handleSetAudioPost} />
                  )}
                </View>
              }
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingLeft: 10 }}
              data={photos}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Pressable
                      android_ripple={{ color: "#FFFFFF", foreground: true }}
                      style={{ borderRadius: 10 }}
                      onPress={() => {
                        setPostPhoto({
                          uri: item?.node?.image?.uri,
                          mimeType: item?.node?.type,
                          size: item?.node?.image?.fileSize || 0,
                        });
                      }}
                    >
                      <Image
                        style={{ height: 100, width: 100, borderRadius: 10 }}
                        source={{ uri: item?.node?.image?.uri }}
                      />
                    </Pressable>
                  </View>
                );
              }}
            />
          </Animated.View>
        )}
      </View>
    </AnimatedScreen>
  );
}
