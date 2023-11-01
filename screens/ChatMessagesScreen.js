import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../config";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setEmojiSelector] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState([]);

  const [recepientData, setRecepientData] = useState();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const scrollViewRef = useRef(null);
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    scrollToBotton();
  }, []);

  const scrollToBotton = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBotton();
  };

  const handleEmojiPress = () => {
    setEmojiSelector(!showEmojiSelector);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("res is", result);
    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recipentId", recepientId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      // const response = await fetch("http://192.168.1.4/messages", {
      //   method: "POST",
      //   body: formData,
      // });
      const response = await axios.post(`${API_BASE_URL}/messages`, formData);

      // if (response.ok) {
      //   setMessage("");
      // }
      fetchMessages();
      setMessage("");
      setSelectedImage("");
    } catch (err) {
      console.log("error in sending the messages", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/${userId}/${recepientId}`,
      );
      setChatMessages(response.data);
      console.log("chats", response.data);
      console.log("chat Message", chatMessages);
    } catch (err) {
      console.log("error in fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        // const response = await fetch(`http://192.168.1.4/user/${recepientId}`);
        const response = await axios.get(`${API_BASE_URL}/user/${recepientId}`);

        setRecepientData(response.data);
      } catch (err) {
        console.log("error in retrieving the data", err);
      }
    };
    fetchRecepientData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
            {selectedMessage.length > 0 ? (
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {selectedMessage.length}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: recepientData?.image }}
                />
                <Text
                  style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  {recepientData?.name}
                </Text>
              </View>
            )}
          </View>
        );
      },
      headerRight: () =>
        selectedMessage.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="md-arrow-redo" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessage(selectedMessage)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessage]);

  const deleteMessage = async (messagesIds) => {
    try {
      // const response = await axios.post(`${API_BASE_URL}:8000/deleteMessages`,header);
      const response = await fetch(`${API_BASE_URL}/deleteMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesIds }),
      });
      if (response.ok) {
        setSelectedMessage((prevMessage) =>
          prevMessage.filter((id) => !messagesIds.includes(id)),
        );
        fetchMessages();
      } else {
        console.log("Error in deleteing messages", response.status);
      }
    } catch (err) {
      console.log("err while deleting msgId", err);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessage.includes(message._id);
    if (isSelected) {
      setSelectedMessage((prevMessage) =>
        prevMessage.filter((id) => id !== message._id),
      );
    } else {
      setSelectedMessage((prevMessage) => [...prevMessage, message._id]);
    }
  };
  console.log("selected messages ", selectedMessage);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}>
        {chatMessages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessage.includes(item._id);

            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}>
                <Text style={{ fontSize: 13, textAlign: "left" }}>
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}>
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl =
              "C:\\Users\\abhay\\OneDrive\\Desktop\\Messenger\\Chat\\backend\\files\\";

            {
              /* const baseUrl =
              "C:Users/abhay/OneDrive/Desktop/Messenger/Chat/backend/files/"; */
            }
            const imageUrl = item.imageUrl;
            const fileName = imageUrl.split("\\").pop();

            const source = { uri: item?.imageUrl };
            console.log("img source", source);

            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      },
                ]}>
                <View>
                  <Image
                    source={source}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 7,
                      resizeMode: "cover",
                    }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "gray",
                      marginTop: 5,
                    }}>
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}>
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="black"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 7,
          }}>
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <TouchableOpacity
          onPress={() => handleSend("text", "")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
