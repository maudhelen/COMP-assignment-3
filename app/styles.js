import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  appNameContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#ffb6c1",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff69b4",
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ff69b4",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffb6c1",
  },
  usernameText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerItemStyle: {
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#ff69b4",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  button: {
    backgroundColor: "#ff69b4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
});