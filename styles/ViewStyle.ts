import { StyleSheet, ViewComponent } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  NavBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  NavBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginRight: 20,
  },
  NavBarIcon: {
    justifyContent:"space-evenly",
    width: 30,
    height: 30,
    marginBottom: 20,
    marginLeft: 45,
    marginRight: 20,
  },
  NavBarText: {
    justifyContent:"space-evenly",
    marginRight: 5,
    textAlign: "center",
    fontSize: 6,
    fontWeight: "bold",
    color: "black",
    marginTop:5,
  },
  headerContainer: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between", 
  alignItems: "center",           
  paddingHorizontal: 20,           
  paddingTop: 20,                  
},
headerIcon: {
  width: 30,
  height: 30,
  marginLeft:10
},
planContainer:{
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
},
planTitle:{
   fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
},
card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  day: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#4f46e5",
  },
  entry: {
    marginBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    marginLeft: 4,
    color: "#111",
    flexShrink: 1,
  },
}); 

