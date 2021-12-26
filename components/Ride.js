import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { setRides, setSelctedRide, signUser } from "../redux/actions/actions";
import { useFonts } from "expo-font";

export default function RideComp(props) {
  const [openModal, setOpenModal] = useState(false);
  const ticket = useSelector((state) => state.allData.ticketDetails);
  const dispatch = useDispatch();
  const [fontsLoaded] = useFonts({
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      setOpenModal(props.modalVisible);
      let resp = await axios.get(
        "http://fast-rider.herokuapp.com/api/v1/rides?token=433898df4a3e992b8411004109e4d574a90695e39e&api_key=/v1/rides"
      );
      dispatch(setRides(resp.data));
    }
    fetchData();
  }, []);

  const getTime = () => {
    let time = new Date(ticket.ticket.ride.return_time);
    let hour = time.getHours();
    let minutes = time.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let returnTime = hour + ":" + minutes;
    return returnTime;
  };

  const onCloseModal = () => {
    console.log(ticket);
    setOpenModal(false);
    dispatch(setSelctedRide({}));
    dispatch(signUser(ticket));
    props.closeModal(false);
  };
  return (
    <SafeAreaView>
      {fontsLoaded ? (
        <Modal
          style={{ height: "100%", width: "100%" }}
          visible={openModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setOpenModal(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.confirmText}>
              <Text style={styles.title}>The Jungle™ FastRider Service</Text>
              <Image
                style={[styles.ConfirmImage, { width: 30, height: 30 }]}
                source={require("../assets/ico-04.png")}
              />
              <Text style={styles.modalText}>
                Thank you for using the The Jungle™ FastRider ticket system -
                your access code is now ready!
              </Text>
            </View>

            <View style={styles.card}>
              <Card containerStyle={styles.ride}>
                <View
                  style={{
                    borderBottomColor: ticket.ticket.ride.zone.color,
                    borderBottomWidth: 5,
                  }}
                />
                <View Style={styles.zoneDetails}>
                  <Text style={styles.zone}>
                    {ticket.ticket.ride.zone.name}
                  </Text>
                  <Text style={styles.rideName}>{ticket.ticket.ride.name}</Text>
                </View>
                <View style={styles.detailsArea}>
                  <Text style={styles.detailsText}>Return At</Text>
                  <Text style={styles.ticketDetails}>{getTime()}</Text>
                  <Text style={styles.detailsText}>Use Access Code</Text>
                  <Text style={styles.ticketDetails}>
                    {ticket.ticket.access_code}
                  </Text>
                </View>
              </Card>

              <Pressable style={[styles.button]} onPress={onCloseModal}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : (
        <ActivityIndicator size="small" color="white" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    position: "relative",
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    alignContent: "center",
  },
  confirmText: {
    position: "absolute",
    top: "10%",
    alignItems: "center",
    fontFamily: "OpenSans-Regular",
  },
  title: {
    fontSize: 18,
    color: "white",
    fontFamily: "OpenSans-Bold",
    marginBottom: 20,
  },
  modalText: {
    width: "40%",
    textAlign: "center",
    color: "#656565",
    fontFamily: "OpenSans-Bold",
  },
  button: {
    position: "absolute",
    top: "50%",
    left: "36%",
    width: "30%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: "center",
    backgroundColor: "#4c4c4b",
  },

  card: {
    position: "absolute",
    width: "80%",
    height: "70%",
    top: "35%",
  },

  ConfirmImage: {
    backgroundColor: "#4d4c4c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
    borderRadius: 50,
  },
  ride: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: "#373737",
  },

  zone: {
    margin: 5,
    color: "#656565",
    textAlign: "right",
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
  },
  rideName: {
    position: "absolute",
    width: "50%",
    margin: 5,
    textAlign: "left",
    top: 0,
    color: "white",
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
  },
  detailsArea: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  detailsText: {
    color: "#656565",
    textAlign: "right",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
  },
  ticketDetails: {
    margin: 5,
    textAlign: "left",
    color: "white",
    fontFamily: "OpenSans-Bold",
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 5,
  },
});
