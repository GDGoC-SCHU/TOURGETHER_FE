import React, { useState,useMemo,useCallback} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,

} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

export default function Register() {
  const [nickName, setNickName] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const allTags = useMemo(() => [
    "MBTI E",
    "MBTI I",
    "MBTI J",
    "MBTI P",
    "Cafe",
    "Food",
    "SightSeeing",
    "Activity",
    "Staycation",
  ], []);
  // 해시태그 선택/해제
  const toggleTag = useCallback((tag:string)=>{
    setTags((prev)=>prev.includes(tag)?prev.filter((t)=>t!==tag): [...prev,tag]);
  },[]);

  const renderedTags = useMemo(()=>{
    return allTags.map((tag)=>(
      <TouchableOpacity
        key={tag}
        onPress={()=>toggleTag(tag)}
        style={{
          backgroundColor: tags.includes(tag)? "blue":"grey",
          padding:5,
          borderRadius:10,
          margin:5,
        }}
        >
          <Text style={{color: "white"}}>{tag}</Text>
        </TouchableOpacity>
    ));
  },[tags,toggleTag]);

  // 프로필 사진 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // nickName 중복 검사
  const checkNickName = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user/nickname");
      const data = await res.json();
      if (data.available) {
        alert("Nickname is available");
        setNickNameCheck(true);
      } else {
        alert("Nickname is already taken.");
        setNickNameCheck(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //회원가입 완료
  const submitProfile = async () => {
    const newErrors: {
      nickName?: string;
      nickname?: string;
      bio?: string;
      tags?: string;
      gender?: string;
    } = {};
    if (!nickNameCheck) newErrors.nickname = "Please check for nickname duplication.";
    if (!nickName.trim()) newErrors.nickname = "Please enter a nickname.";
    if (!bio.trim()) newErrors.bio = "Please enter a short introduction.";
    if (tags.length === 0) newErrors.tags = "Please select at least one hashtag.";
    if (!gender) newErrors.gender = "Please select your gender.";

    const payLoad = {
      nickName,
      bio,
      tags,
      gender,
      birthDate: birthDate.toISOString().split("T")[0],
      image,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/user/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      if (res.status === 200) {
        alert("Sign-up successful");
        router.push("/auth/VerifyPhone");
      }
    } catch (err) {
      alert("Sign-up failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center" }}>
        <Image
          source={
            image ? { uri: image } : require("@/assets/images/profile.png")
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 1,
            marginLeft: 60,
          }}
        />
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Please set your profile picture.
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          Nickname
        </Text>
        <TextInput
          value={nickName}
          onChangeText={setNickName}
          placeholder=" Please Write down your Nickname"
          placeholderTextColor="grey"
          maxLength={10}
          style={{
            borderWidth: 1,
            borderBottomWidth: 1,
            marginTop: 20,
            borderRadius: 5,
          }}
          
        />
        <TouchableOpacity
          onPress={checkNickName}
          style={{
            width: "40%",
            marginTop: 10,
            padding: 2,
            backgroundColor: "green",
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Check Duplication</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          Self-Introduction
        </Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline={true}
          maxLength={20}
          style={{
            borderWidth: 1,
            minHeight: 60,
            marginTop: 20,
            borderRadius: 5,
          }}
          placeholder=" Write a short introduction (Max 20 characters)"
          placeholderTextColor="grey"
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          # Hashtag Settings
        </Text>
        <Text style={{ fontSize: 12 }}>
          Select hashtags that represent you (Max 5)
        </Text>
        <View style={{flexDirection:"row", flexWrap:"wrap"}}>{renderedTags}</View>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          성별
        </Text>
        <Picker
          selectedValue={gender}
          onValueChange={setGender}
          style={{ marginTop: 20 }}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="male" value="male" />
          <Picker.Item label="female" value="female" />
          <Picker.Item label="other" value="other" />
        </Picker>

        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
            Birth
          </Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={birthDate.toISOString().split("T")[0]}
              onChange={(e) => setBirthDate(new Date(e.target.value))}
              placeholder="YYYY-MM-DD"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
            />
          ) : (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={birthDate}
              onChange={(_, date) => date && setBirthDate(date)}
            />
          )}
        </View>
    </View>
      <TouchableOpacity
        onPress={submitProfile}
        style={{
          width: "30%",
          alignSelf: "center",
          backgroundColor: "#4f46e5",
          padding: 5,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}