import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { API_BASE_URL } from "../config";
import axios from "axios";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/friend-requests/sent/${userId}`,
        );
        setFriendRequests(response.data);
      } catch (err) {
        console.log("err while fetching the frndRequest", err);
      }
    };
    fetchFriendRequest();
  }, []);
  console.log("frnd requests are", friendRequests);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/friend/${userId}`);
        setUserFriends(response.data);
      } catch (err) {
        console.log("err while fetching the user friends", err);
      }
    };
    fetchUserFriends();
  }, []);
  console.log("frnd  are", userFriends);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = fetch(`${API_BASE_URL}/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      setRequestSent(true);
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (err) {
      console.log("frnd request err", err);
    }
  };
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
      }}>
      <View>
        <Image
          source={{ uri: item.image }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4 }}>{item?.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
            Friends
          </Text>
        </TouchableOpacity>
      ) : requestSent ||
        friendRequests.some((friend) => friend === item._id) ? (
        <TouchableOpacity
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
            Request Sent
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
            Add Friend
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default User;

const styles = StyleSheet.create({});
