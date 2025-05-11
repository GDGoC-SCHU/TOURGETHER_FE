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
    fontSize: 8,
    fontWeight: "bold",
    color: "black",
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
},

}); 

