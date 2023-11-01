import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { jwtDecode } from "jwt-decode";
import axios from "axios";
// import { Jwt } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import User from "../components/User";
import { API_BASE_URL } from "../config";

const HomeScreen = ({ navigation }) => {
  // const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Swift Chat</Text>
        );
      },
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              onPress={() => navigation.navigate("Chat")}
              name="chatbox-ellipses-outline"
              size={24}
              color="black"
            />
            <MaterialIcons
              onPress={() => navigation.navigate("Friends")}
              name="people-outline"
              size={24}
              color="black"
            />
          </View>
        );
      },
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // const decodToken = Jwt.verify(token, "abhayisgreat");
        // console.log("verify token", decodToken);
        console.log("token is", token);
        console.log("URL is", API_BASE_URL);
        // const decodedToken = jwtDecode(token,);
        // console.log("userid is ", decodedToken.userId);
        // const userId = decodedToken.userId;

        axios
          .get(`${API_BASE_URL}/users/${token}`)
          .then((res) => {
            console.log(res.data.users.length);
            setUserId(res.data.userId);
            setUsers(res.data.users);
          })
          .catch((err) => {
            console.log("error retrieving data", err);
          });
      } catch (err) {
        console.log("error is ", err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <View>
      <View style={{ padding: 10 }}>
        {/* {users.map((item, index) => {
          <User key={index} />;
        })} */}
        <FlatList
          data={users}
          renderItem={({ item }) => <User item={item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
