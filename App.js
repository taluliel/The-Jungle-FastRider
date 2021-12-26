import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, View } from "react-native";
import MainComp from "./components/MainPage";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <View style={[styles.container]}>
        <MainComp />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    justifyContent: "center",
  },
});
