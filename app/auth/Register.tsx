import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  ImageBackground,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/authContext';
import api, { profileApi, fileApi } from '@/app/config/api';

// 색상 팔레트 불러오기
const primaryColor = '#4A89DC'; // 하늘색/바다색 - 자유와 모험
const accentColor = '#FF9500';  // 주황색/일몰색 - 따뜻함과 에너지
const secondaryColor = '#5AC8FA'; // 밝은 하늘색 - 신선함
const tertiaryColor = '#34C759'; // 녹색 - 자연, 탐험
const neutralLight = '#F5F5F7'; // 밝은 회색 - 배경
const neutralDark = '#333333';  // 어두운 회색 - 텍스트

// 에러 타입 정의
interface ErrorsType {
  nickname?: string;
  bio?: string;
  tags?: string;
  gender?: string;
  phone?: string;
  code?: string;
  birthDate?: string;
  submit?: string;
  image?: string;
}

export default function Register() {
  // useAuth 훅에서 필요한 정보 가져오기
  const { user, userId, getAuthHeader, checkAuthStatus, isAuthenticated } = useAuth();
  const router = useRouter();

  // 프로필 설정 상태
  const [nickName, setNickName] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 태그 카테고리 및 태그 목록
  const [mbtiTags, setMbtiTags] = useState<string[]>([]);
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [hobbyTags, setHobbyTags] = useState<string[]>([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  // 전화번호 인증 상태
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 공통 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ErrorsType>({});

  // 컴포넌트 마운트 시 인증 상태 및 태그 목록 조회
  useEffect(() => {
    const init = async () => {
      // 인증 상태 확인
      const authStatus = await checkAuthStatus();
      console.log("Auth status:", authStatus);
      console.log("Current userId:", userId);
      
      if (!isAuthenticated || !userId) {
        console.error('인증되지 않은 사용자 또는 userId 없음:', { isAuthenticated, userId });
        router.push('./login');
        return;
      }

      // 태그 목록 조회
      fetchTags();
    };
    
    init();
  }, [isAuthenticated, userId]);

  // 태그 목록 조회
  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const result = await profileApi.getTags();
      
      // 카테고리별 태그 목록 설정
      if (result) {
        setMbtiTags(result.MBTI || []);
        setInterestTags(result.INTEREST || []);
        setHobbyTags(result.HOBBY || []);
        setTagsLoaded(true);
      }
    } catch (error) {
      console.error('태그 목록 조회 중 오류 발생:', error);
      setMessage('태그 목록을 불러오는데 실패했습니다. 기본 태그를 사용합니다.');
      
      // 태그 API 오류 시 기본 태그 사용
      setMbtiTags([
        "ENFP", "ENFJ", "ENTP", "ENTJ", 
        "INFJ", "INFP", "INTP", "INTJ",
        "ESTP", "ESTJ", "ESFP", "ESFJ",
        "ISTP", "ISTJ", "ISFP", "ISFJ"
      ]);
      
      setInterestTags([
        "Cafe", "Food", "SightSeeing", "Activity", "Staycation"
      ]);
      
      setHobbyTags([
        "Music", "Movie", "Reading", "Sports", "Art",
        "Gaming", "Hiking", "Photography", "Cooking", "Traveling"
      ]);
      
      setTagsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 해시태그 선택/해제
  const toggleTag = useCallback((tag: string) => {
    setTags((prev) => 
      prev.includes(tag) 
        ? prev.filter((t) => t !== tag) 
        : prev.length < 5 
          ? [...prev, tag] 
          : prev
    );
  }, []);

  // 프로필 사진 선택
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        
        // 이미지 업로드 처리는 프로필 완성 시에 함께 처리하도록 변경
        setMessage("이미지가 선택되었습니다. 회원가입 완료 시 업로드됩니다.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      setMessage("이미지 선택 중 오류가 발생했습니다.");
    }
  };

  // nickName 중복 검사
  const checkNickName = async () => {
    if (!nickName.trim()) {
      setErrors(prev => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
      return;
    }
    
    try {
      setIsLoading(true);
      // 새로운 API 함수 사용
      const response = await profileApi.checkNickname(nickName);

      if (response.available) {
        setErrors(prev => ({ ...prev, nickname: undefined }));
        setNickNameCheck(true);
        setMessage("사용 가능한 닉네임입니다!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setErrors(prev => ({ ...prev, nickname: "이미 사용 중인 닉네임입니다." }));
        setNickNameCheck(false);
      }
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, nickname: "닉네임 확인 중 오류가 발생했습니다." }));
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 선택기 토글
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // 날짜 변경 처리
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  // 날짜 형식 변환
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 전화번호 형식 포맷팅
  const formatPhoneNumber = (input: string): string => {
    const numbers = input.replace(/[^0-9]/g, "");
    if (numbers.startsWith("0")) {
      return "+82" + numbers.substring(1);
    }

    if (input.startsWith("+")) {
      return input;
    }

    return "+82" + numbers;
  };

  // 전화번호 인증 코드 발송
  const sendVerificationCode = async () => {
    if (!phone.trim()) {
      setErrors(prev => ({ ...prev, phone: "전화번호를 입력해주세요." }));
      return;
    }
  
    if (!userId) {
      console.error('사용자 ID가 없습니다:', userId);
      setMessage("사용자 인증에 문제가 발생했습니다. 다시 로그인해주세요.");
      return;
    }
  
    try {
      setIsLoading(true);
      setMessage("인증 코드를 발송하고 있습니다...");
  
      const formattedPhone = formatPhoneNumber(phone);
      console.log(`인증 코드 발송 중: ${formattedPhone}, userId: ${userId}`);
  
      const authHeader = await getAuthHeader();
      const response = await api.post(
        '/api/phone/sendVerification',
        { 
          phoneNumber: formattedPhone,
          userId: userId
        },
        authHeader
      );
  
      if (response.data.success) {
        setIsCodeSent(true);
        setMessage("인증 코드가 발송되었습니다. 휴대폰을 확인해주세요.");
        
        if (response.data.expiresInSeconds) {
          setRemainingSeconds(response.data.expiresInSeconds);
          startCooldownTimer();
        }
      } else {
        throw new Error(response.data.message || "인증 코드 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증 코드 발송 오류:", error);
      setMessage("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 인증 코드 확인
  const verifyCode = async () => {
    if (!code.trim()) {
      setErrors(prev => ({ ...prev, code: "인증 코드를 입력해주세요." }));
      return false;
    }
  
    if (!userId) {
      console.error('사용자 ID가 없습니다:', userId);
      setMessage("사용자 인증에 문제가 발생했습니다. 다시 로그인해주세요.");
      return false;
    }
  
    try {
      setIsLoading(true);
      setMessage("인증 코드를 확인하고 있습니다...");
  
      const formattedPhone = formatPhoneNumber(phone);
      console.log(`인증 코드 확인 중: ${formattedPhone}, userId: ${userId}`);
  
      const authHeader = await getAuthHeader();
      const response = await api.post(
        '/api/phone/verifyCode',
        {
          phoneNumber: formattedPhone,
          code: code,
          userId: userId
        },
        authHeader
      );
  
      if (response.data.success) {
        setMessage("휴대폰 인증이 완료되었습니다!");
        setPhoneVerified(true);
        
        try {
          await updatePhoneVerificationStatus();
          await checkAuthStatus();
        } catch (updateError) {
          console.error("휴대폰 인증 상태 업데이트 중 오류 발생:", updateError);
        }
        
        return true;
      } else {
        throw new Error(response.data.message || "잘못된 인증 코드입니다.");
      }
    } catch (error) {
      console.error("인증 코드 확인 오류:", error);
      setMessage("인증에 실패했습니다. 다시 시도해주세요.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 상태 업데이트
  const updatePhoneVerificationStatus = async () => {
    try {
      if (!userId) {
        console.error("사용자 ID가 없습니다:", userId);
        throw new Error("사용자 ID가 없습니다.");
      }
  
      console.log("휴대폰 인증 상태 업데이트 중 - userId:", userId);
      
      const authHeader = await getAuthHeader();
      const response = await api.post(
        `/api/users/${userId}/verifyPhone`,
        { phoneNumber: formatPhoneNumber(phone) },
        {
          withCredentials: true,
          headers: {
            ...authHeader.headers
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "인증 상태 업데이트에 실패했습니다.");
      }
  
      console.log("휴대폰 인증 상태가 성공적으로 업데이트되었습니다.");
      return true;
    } catch (error) {
      console.error("휴대폰 인증 상태 업데이트 오류:", error);
      throw error;
    }
  };
  
  // 재발송 제한 타이머 시작
  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  // 인증 코드 재전송
  const resendVerificationCode = async () => {
    if (remainingSeconds > 0) {
      setMessage(`재전송 전 ${remainingSeconds}초 대기해주세요.`);
      return;
    }
    
    setCode("");
    await sendVerificationCode();
  };

  // 폼 전체 검증
  const validateForm = () => {
    const newErrors: ErrorsType = {};
    
    if (!nickNameCheck) newErrors.nickname = "닉네임 중복 확인을 해주세요.";
    if (!nickName.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (!bio.trim()) newErrors.bio = "자기소개를 입력해주세요.";
    if (tags.length === 0) newErrors.tags = "하나 이상의 해시태그를 선택해주세요.";
    if (!gender) newErrors.gender = "성별을 선택해주세요.";
    if (!phoneVerified) newErrors.phone = "휴대폰 인증을 완료해주세요.";
    if (!birthDate) newErrors.birthDate = "생년월일을 선택해주세요.";
    if (!image) newErrors.image = "프로필 사진을 선택해주세요.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 완료
  const submitRegistration = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setMessage("프로필을 생성하고 있습니다...");
    
    try {
      // 프로필 데이터 준비
      const profileData = {
        nickname: nickName,
        bio,
        gender,
        birthDate: birthDate.toISOString().split("T")[0],
        tags
      };

      console.log('회원가입 요청 데이터:', profileData);
      console.log('프로필 이미지:', image ? '이미지 있음' : '이미지 없음');

      // 새로운 API 함수 사용
      const response = await profileApi.setupProfile(profileData, image);
      console.log('회원가입 응답:', response);

      // 회원가입 성공 시 AuthContext 갱신
      await checkAuthStatus();

      Alert.alert(
        "회원가입 완료",
        "프로필이 성공적으로 생성되었습니다!",
        [
          {
            text: "계속하기",
            onPress: () => {
              console.log("홈으로 이동 시도...");
              // 홈화면으로 이동 - 정확한 라우트 사용
              router.replace('/(tabs)');
            }
          }
        ]
      );
    } catch (err) {
      console.error('회원가입 오류:', err);
      setMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
      setErrors(prev => ({ ...prev, submit: "회원가입 실패" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/jeju.png")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.85)']}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: '100%' }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile Setup</Text>
              <Text style={styles.headerSubtitle}>Set up your profile to connect with travel buddies</Text>
            </View>

            {/* 프로필 이미지 섹션 */}
            <View style={styles.profileImageContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.profileImageButton}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <FontAwesome name="user" size={40} color="#ccc" />
                  </View>
                )}
                <View style={styles.cameraIconContainer}>
                  <FontAwesome name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profileImageText}>프로필 사진 설정</Text>
              {!image && errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
            </View>

            {/* 상태 메시지 표시 */}
            {message ? (
              <View style={styles.messageContainer}>
                <Text style={[
                  styles.message,
                  message.includes('fail') || message.includes('error') || message.includes('invalid')
                    ? styles.errorMessage
                    : styles.successMessage
                ]}>
                  {message}
                </Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              {/* 닉네임 입력 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nickname</Text>
                <View style={styles.nickNameContainer}>
                  <TextInput
                    value={nickName}
                    onChangeText={(text) => {
                      setNickName(text);
                      setNickNameCheck(false);
                    }}
                    placeholder="Enter your nickname (max 10 chars)"
                    placeholderTextColor="#aaa"
                    maxLength={10}
                    style={[
                      styles.input,
                      errors.nickname ? styles.inputError : null,
                      { flex: 1 }
                    ]}
                  />
                  <TouchableOpacity
                    onPress={checkNickName}
                    disabled={isLoading}
                    style={[
                      styles.checkButton,
                      nickNameCheck ? styles.checkButtonSuccess : null,
                      isLoading ? styles.buttonDisabled : null
                    ]}
                  >
                    {isLoading && nickName ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.checkButtonText}>
                        {nickNameCheck ? "Verified" : "Verify"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                {errors.nickname && <Text style={styles.errorText}>{errors.nickname}</Text>}
              </View>

              {/* 자기소개 입력 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  multiline={true}
                  maxLength={20}
                  style={[
                    styles.input, 
                    styles.bioInput,
                    errors.bio ? styles.inputError : null
                  ]}
                  placeholder="Tell us about yourself (max 20 chars)"
                  placeholderTextColor="#aaa"
                />
                {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
                <Text style={styles.charCount}>{bio.length}/20</Text>
              </View>

              {/* 해시태그 선택 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hashtags</Text>
                <Text style={styles.inputSubLabel}>
                  Choose hashtags that represent you (max 5)
                </Text>
                
                {/* MBTI 태그 - API에서 가져온 태그로 대체 */}
                <View style={styles.tagSection}>
                  <Text style={styles.tagCategory}>MBTI Types</Text>
                  <View style={styles.tagsContainer}>
                    {tagsLoaded ? mbtiTags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagButton,
                          styles.mbtiTag,
                          tags.includes(tag) ? styles.tagSelected : styles.tagUnselected
                        ]}
                      >
                        <Text style={tags.includes(tag) ? styles.tagTextSelected : styles.tagTextUnselected}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    )) : <ActivityIndicator color={primaryColor} />}
                  </View>
                </View>
                
                {/* 여행 관심사 - API에서 가져온 태그로 대체 */}
                <View style={styles.tagSection}>
                  <Text style={styles.tagCategory}>Travel Interests</Text>
                  <View style={styles.tagsContainer}>
                    {tagsLoaded ? interestTags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagButton,
                          tags.includes(tag) ? styles.tagSelected : styles.tagUnselected
                        ]}
                      >
                        <Text style={tags.includes(tag) ? styles.tagTextSelected : styles.tagTextUnselected}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    )) : <ActivityIndicator color={primaryColor} />}
                  </View>
                </View>
                
                {/* 취미 태그 - API에서 가져온 태그로 대체 */}
                <View style={styles.tagSection}>
                  <Text style={styles.tagCategory}>Hobbies</Text>
                  <View style={styles.tagsContainer}>
                    {tagsLoaded ? hobbyTags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagButton,
                          tags.includes(tag) ? styles.tagSelected : styles.tagUnselected
                        ]}
                      >
                        <Text style={tags.includes(tag) ? styles.tagTextSelected : styles.tagTextUnselected}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    )) : <ActivityIndicator color={primaryColor} />}
                  </View>
                </View>
                
                {errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}
                <Text style={styles.tagCount}>{tags.length}/5 selected</Text>
              </View>

              {/* 성별 선택 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={[
                  styles.pickerContainer,
                  errors.gender ? styles.inputError : null
                ]}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={setGender}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select your gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>

              {/* 생년월일 선택 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                {Platform.OS === "web" ? (
                  <View style={[styles.dateInputContainer, errors.birthDate ? styles.inputError : null]}>
                    <input
                      type="date"
                      value={birthDate.toISOString().split("T")[0]}
                      onChange={(e) => setBirthDate(new Date(e.target.value))}
                      placeholder="YYYY-MM-DD"
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        height: '50px',
                        fontSize: '16px',
                        padding: '0 14px',
                        color: '#333',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.datePickerButton, errors.birthDate ? styles.inputError : null]}
                    onPress={toggleDatePicker}
                  >
                    <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                  </TouchableOpacity>
                )}
                {showDatePicker && Platform.OS !== "web" && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
              </View>

              {/* 전화번호 인증 섹션 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Verification</Text>
                <Text style={styles.inputSubLabel}>
                  Verify your phone number for secure access
                </Text>

                {/* 전화번호 입력 */}
                {!isCodeSent ? (
                  <View>
                    <View style={styles.phoneContainer}>
                      <View style={[
                        styles.phoneInputContainer,
                        errors.phone ? styles.inputError : null
                      ]}>
                        <Feather name="phone" size={20} color={primaryColor} style={styles.phoneIcon} />
                        <TextInput
                          style={styles.phoneInput}
                          placeholder="01012345678"
                          keyboardType="phone-pad"
                          value={phone}
                          onChangeText={setPhone}
                          editable={!isLoading}
                          placeholderTextColor="#999"
                        />
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.verifyButton,
                          isLoading ? styles.buttonDisabled : null
                        ]}
                        onPress={sendVerificationCode}
                        disabled={isLoading || !phone.trim()}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.verifyButtonText}>
                            Send Code
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                  </View>
                ) : (
                  // 인증 코드 입력
                  <View>
                    <View style={[
                      styles.codeContainer,
                      errors.code ? styles.inputError : null
                    ]}>
                      <Feather name="lock" size={20} color={primaryColor} style={styles.phoneIcon} />
                      <TextInput
                        style={styles.codeInput}
                        placeholder="Enter verification code"
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                        editable={!isLoading && !phoneVerified}
                        maxLength={6}
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity
                        style={[
                          styles.codeButton,
                          (isLoading || phoneVerified) ? styles.buttonDisabled : null
                        ]}
                        onPress={verifyCode}
                        disabled={isLoading || !code.trim() || phoneVerified}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.verifyButtonText}>
                            {phoneVerified ? "Verified" : "Verify"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                    
                    {/* 타이머 및 재전송 버튼 - 인증 완료 시 표시하지 않음 */}
                    {!phoneVerified && (
                      <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                          {remainingSeconds > 0 
                            ? `Time remaining: ${Math.floor(remainingSeconds / 60)}:${remainingSeconds % 60 < 10 ? '0' : ''}${remainingSeconds % 60}` 
                            : "Code expired"}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.resendButton, 
                            (isLoading || remainingSeconds > 0) ? styles.buttonDisabled : null
                          ]}
                          onPress={resendVerificationCode}
                          disabled={isLoading || remainingSeconds > 0 || phoneVerified}
                        >
                          <Text style={[
                            styles.resendText,
                            (isLoading || remainingSeconds > 0 || phoneVerified) ? styles.textDisabled : null
                          ]}>
                            Resend
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* 제출 버튼 */}
            <TouchableOpacity
              onPress={submitRegistration}
              disabled={isSubmitting || !phoneVerified || !image}
              style={[
                styles.submitButton,
                (isSubmitting || !phoneVerified || !image) ? styles.submitButtonDisabled : null
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>회원가입 완료</Text>
              )}
            </TouchableOpacity>
            {errors.submit && <Text style={styles.submitErrorText}>{errors.submit}</Text>}
            {!phoneVerified && (
              <Text style={styles.verificationReminder}>
                휴대폰 인증을 완료해야 회원가입이 가능합니다
              </Text>
            )}
            {!image && (
              <Text style={styles.verificationReminder}>
                프로필 사진을 등록해야 회원가입이 가능합니다
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageButton: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'visible',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: primaryColor,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: primaryColor,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    alignSelf: 'center',
    maxWidth: 600,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#D32F2F',
  },
  successMessage: {
    color: '#388E3C',
  },
  formContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: neutralDark,
    marginBottom: 8,
  },
  inputSubLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  nickNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkButton: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkButtonSuccess: {
    backgroundColor: tertiaryColor,
  },
  checkButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 6,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  tagSection: {
    marginBottom: 16,
  },
  tagCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 8,
  },
  mbtiTag: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagSelected: {
    backgroundColor: primaryColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagUnselected: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  tagTextUnselected: {
    color: '#666',
  },
  tagCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    flex: 1,
  },
  phoneIcon: {
    padding: 12,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  codeInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  codeButton: {
    backgroundColor: primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: primaryColor,
    fontWeight: '500',
    fontSize: 14,
  },
  textDisabled: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: accentColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ffcc80',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  submitErrorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  verificationReminder: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 600,
    alignSelf: 'center',
  },
  dateInputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  }
});