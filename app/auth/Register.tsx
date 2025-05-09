import React, { useState } from "react";
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

  const allTags = [
    "MBTI E",
    "MBTI I",
    "MBTI J",
    "MBTI P",
    "카페 위주",
    "맛집 위주",
    "관광지 위주",
    "액티비티 위주",
    "호캉스",
  ];

  // 해시태그 선택/해제
  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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
        alert("사용 가능한 닉네임입니다.");
        setNickNameCheck(true);
      } else {
        alert("이미 사용중인 닉네임입니다.");
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
    if (!nickNameCheck) newErrors.nickname = "닉네임 중복 확인을 해주세요.";
    if (!nickName.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (!bio.trim()) newErrors.bio = "자기소개를 입력해주세요.";
    if (tags.length === 0) newErrors.tags = "하나 이상의 태그를 선택해주세요.";
    if (!gender) newErrors.gender = "성별을 선택해주세요.";

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
        alert("회원가입 성공");
        router.push("/routes/Home");
      }
    } catch (err) {
      alert("회원가입 실패");
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
          사용하실 프로필 사진을 설정해주세요
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          닉네임
        </Text>
        <TextInput
          value={nickName}
          onChangeText={setNickName}
          placeholder="사용하실 닉네임을 적어주세요"
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
            width: "20%",
            marginTop: 10,
            padding: 2,
            backgroundColor: "green",
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>중복확인</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          자기소개
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
          placeholder="자기소개를 적어주세요(최대 20자)"
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          # 설정
        </Text>
        <Text style={{ fontSize: 12 }}>
          본인을 표현할 수 있는 # 선택해주세요(최대 5개)
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              style={{
                backgroundColor: tags.includes(tag) ? "blue" : "gray",
                padding: 5,
                borderRadius: 10,
                margin: 5,
              }}
            >
              <Text style={{ color: "white" }}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          성별
        </Text>
        <Picker selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label="선택" value="" />
          <Picker.Item label="남성" value="male" />
          <Picker.Item label="여성" value="female" />
          <Picker.Item label="기타" value="other" />
        </Picker>

        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          생년월일
        </Text>

        {Platform.OS === "web" ? (
          <TextInput
            style={{ borderWidth: 1, padding: 10 }}
            value={birthDate.toISOString().split("T")[0]}
            onChangeText={(text) => setBirthDate(new Date(text))}
            placeholder="YYYY-MM-DD"
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ borderBottomWidth: 1, paddingVertical: 10 }}
            >
              <Text>{birthDate.toISOString().split("T")[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  if (date) setBirthDate(date);
                }}
              />
            )}
          </>
        )}
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
          회원가입 완료하기
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
