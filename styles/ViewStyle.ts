import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

/**
 * 앱 전체에서 사용되는 공통 스타일
 * 여행 테마에 맞게 감성적인 디자인 요소 추가
 */
export const styles = StyleSheet.create({
  // 공통 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // 제목 스타일
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 8,
  },
  
  // 부제목 스타일
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  
  // 구분선 스타일
  separator: {
    marginVertical: 30,
    height: 2,
    width: "80%",
    backgroundColor: Colors.light.accent,
    opacity: 0.5,
    borderRadius: 1,
  },
  
  // 헤더 관련 스타일
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: Colors.light.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
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
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    height: 65,
    padding: 0,
    paddingTop: 5,
    paddingBottom: 10,
  },
  
  NavBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  
  NavBarIcon: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    height: "100%",
    paddingBottom: 5,
  },
  
  NavBarText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.light.text,
    marginTop: 2,
    marginBottom: 0,
    width: "100%",
    textAlign: "center",
  },
  
  // 카드 관련 스타일
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  
  // 여행 계획 관련 스타일
  planContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  
  planTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.light.primary,
  },
  
  day: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.light.accent,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.secondary,
    marginTop: 15,
  },
  
  entry: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tertiary,
  },
  
  label: {
    fontWeight: "bold",
    width: 100,
    color: Colors.light.text,
  },
  
  value: {
    flex: 1,
    color: Colors.light.text,
  },
  
  // 전화번호 인증 관련 스타일
  verifyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  
  verifyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.light.primary,
  },
  
  verifySubtitle: {
    fontSize: 16,
    marginBottom: 36,
    textAlign: "center",
    color: Colors.light.text,
    maxWidth: 320,
    lineHeight: 24,
  },
  
  verifyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  },
  
  verifyInput: {
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: Colors.light.card,
  },
  
  verifyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  
  verifyButtonDisabled: {
    backgroundColor: Colors.light.primary + '80', // 50% opacity
  },
  
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // 여행 감성을 위한 추가 스타일
  destinationCard: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  
  destinationName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  
  destinationDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  
  // 검색 스타일
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginVertical: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingLeft: 8,
  },
  
  // 탐색 버튼 스타일
  exploreButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // 여행 태그 스타일
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  
  tag: {
    backgroundColor: Colors.light.secondary + '30', // 30% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
  },
  
  tagText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
}); 

