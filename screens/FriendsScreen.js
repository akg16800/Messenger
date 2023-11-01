import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { API_BASE_URL } from "../config";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [frndRequest, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequest();
  }, []);
  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/friend-request/${userId}`,
      );
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        console.log("Frnd req are ", friendRequestData);
        setFriendRequests(friendRequestData);
      }
    } catch (err) {
      console.log("getting error in frnd request", err);
    }
  };
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {frndRequest.length > 0 && <Text>Your Friend Request</Text>}
      {/* {frndRequest.map((item, index) => {
        <FriendRequest
          key={index}
          item={item}
          setFriendRequests={setFriendRequests}
          frndRequest={frndRequest}
        />;
      })} */}
      <FlatList
        data={frndRequest}
        renderItem={({ item }) => (
          <FriendRequest
            item={item}
            setFriendRequests={setFriendRequests}
            friendRequest={frndRequest}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      {/* <Text>FriendsScreen</Text> */}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
