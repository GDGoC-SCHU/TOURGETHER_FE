import { StyleSheet } from "react-native";

/**
 * 앱 전체에서 사용되는 공통 스타일
 */
export const styles = StyleSheet.create({
  // 공통 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  
  // 제목 스타일
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  
  // 구분선 스타일
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  
  // 헤더 관련 스타일
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
  headerIcon: {
    marginRight: 15,
    marginTop: 20,
  },
  
  // 네비게이션 바 관련 스타일
  NavBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  
  NavBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
  },
  
  NavBarIcon: {
    alignItems: "center",
  },
  
  NavBarText: {
    fontSize: 10,
    marginTop: 5,
  },
  
  // 카드 관련 스타일
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // 여행 계획 관련 스타일
  planContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  
  planTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  
  day: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  
  entry: {
    flexDirection: "row",
    marginBottom: 8,
  },
  
  label: {
    fontWeight: "bold",
    width: 100,
  },
  
  value: {
    flex: 1,
  },
  
  // 전화번호 인증 관련 스타일
  verifyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  
  verifyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  
  verifySubtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
    maxWidth: 300,
  },
  
  verifyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    maxWidth: 400,
  },
  
  verifyInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  
  verifyButton: {
    backgroundColor: "#3897f0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  
  verifyButtonDisabled: {
    backgroundColor: "#b2dffc",
  },
  
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
}); 

