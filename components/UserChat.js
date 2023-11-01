import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { API_BASE_URL } from "../config";
import axios from "axios";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/${userId}/${item._id}`,
      );
      setMessages(response.data);
    } catch (err) {
      console.log("error in fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  console.log("messages is", messages);
  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text",
    );
    const n = userMessages.length;
    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  console.log("lastmsg is", lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: "#D0D0D0",
        padding: 10,
      }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
