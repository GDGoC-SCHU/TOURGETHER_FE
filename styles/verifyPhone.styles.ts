import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  section: {
    width: "100%",
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  messageText: {
    textAlign: "center",
    fontSize: 14,
  },
  footer: {
    width: "100%",
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
  },
  devCode: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "center",
  },
  devCodeText: {
    fontFamily: "monospace",
    fontSize: 14,
  }
});