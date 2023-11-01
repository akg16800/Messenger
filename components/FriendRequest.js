import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { API_BASE_URL } from "../config";

const FriendRequest = ({ item, friendRequest, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);

  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friend-request/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: friendRequestId,
          recipentId: userId,
        }),
      });
      if (response.ok) {
        setFriendRequests(
          friendRequest.filter((request) => request._id !== friendRequest._id),
        );
      }
    } catch (err) {
      console.log("error in accepting req", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />
      <Text
        style={{ fontWeight: "bold", fontSize: 15, marginLeft: 10, flex: 1 }}>
        {item?.name} sent you a friend Request
      </Text>
      <TouchableOpacity
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
        <Text style={{ textAlign: "center", color: "white" }}>Accept </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
