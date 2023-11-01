import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.navigate("Home");
        }
      } catch (E) {
        console.log("error", E);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post(`${API_BASE_URL}/login`, user)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("Login Error", "Invalid email and password");
        console.log("Login error", err);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}>
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Sign in
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Sign in to your account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 18,

                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: "10",
                width: 300,
              }}
              placeholder="enter your Email"
              placeholderTextColor={"black"}></TextInput>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: email ? 18 : 18,

                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: "10",
                width: 300,
              }}
              placeholder="enter your password"
              placeholderTextColor={"black"}></TextInput>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 50,
              borderRadius: 6,
            }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 15 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? SignUp
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
