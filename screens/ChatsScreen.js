import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import UserChat from "../components/UserChat";
import { API_BASE_URL } from "../config";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [render, setRender] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendList = async () => {
      try {
        //     const response = await fetch(
        //       `http://192.168.1.4:8000/accepted-friends/${userId}`,
        //     );
        const response = await axios.get(
          `${API_BASE_URL}/accepted-friends/${userId}`,
        );
        console.log("result ", response.data);

        // const data = await response.json();
        setAcceptedFriends(response.data);

        if (response.ok) {
          setAcceptedFriends(response.data);
        }
      } catch (err) {
        console.log("error while fetching accepted friends", err);
      }
    };

    acceptedFriendList();
  }, []);
  console.log("accepted freinds is ", acceptedFriends);

  return (
    <View>
      {/* {acceptedFriends.length > 0 && <Text>Your frieds</Text>} */}
      <FlatList
        data={acceptedFriends}
        renderItem={({ item }) => <UserChat item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
