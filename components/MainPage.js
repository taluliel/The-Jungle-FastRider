import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import RidesComp from "./Rides";
import RideComp from "./Ride";
import { useSelector, useDispatch } from "react-redux";
import { setRides, FastRiderAccessCode } from "../redux/actions/actions";
import { useFonts } from "expo-font";

export default function MainComp() {
  const [PIN, setPIN] = useState("");
  const ride = useSelector((state) => state.allData.selectedRide);
  const ticket = useSelector((state) => state.allData.ticketDetails);
  const users = useSelector((state) => state.users);
  const [InvalidPinMsg, setInvalidPinMsg] = useState("");
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [ShowSubmit, setShowSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cantAssignModal, setCantAssignModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const screenHeigth = Dimensions.get("window").height;
  const [currentDate, setCurrentDate] = useState("");
  const [fontsLoaded] = useFonts({
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        let resp = await axios.get(
          "http://fast-rider.herokuapp.com/api/v1/rides?token=433898df4a3e992b8411004109e4d574a90695e39e&api_key=/v1/rides"
        );
        dispatch(setRides(resp.data));
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   setPIN(ticket.PIN);
  // }, [ticket]);

  useEffect(() => {
    const startTime = "09:00";
    const endTime = "19:00";
    let date = new Date();
    let currentTime = getTime(date);
    setCurrentDate(currentTime);
    if (currentTime <= endTime && currentTime >= startTime) {
      setModalVisible(false);
      setModalText("");
    } else {
      setModalVisible(true);
      setPIN("");
      setModalText(
        "FastRider tickets can not be assign outside of park working hours. \n\n Please try between 09:00-19:00."
      );
    }
  }, []);

  const getTime = (date) => {
    let time = new Date(date);
    let hour = time.getHours();
    let minutes = time.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hour = hour < 10 ? "0" + hour : hour;
    let returnTime = hour + ":" + minutes;
    return returnTime;
  };

  const getAccessCode = async () => {
    if (PIN === "" || Object.keys(ride).length === 0) {
      setInvalidPinMsg("Please Select PIN Number & Ride");
    } else if (ride.remaining_tickets === 0) {
      setInvalidPinMsg("No more tickect left for this ride");
    } else
      try {
        setInvalidPinMsg("");
        let checkIfPinIsValid = checkPINnumber(PIN);
        if (checkIfPinIsValid) {
          const findPin = users.users.find((user) => user.PIN === PIN);
          if (findPin) {
            let returnTimeTicket = getTime(findPin.ticket.ride.return_time);
            if (currentDate < returnTimeTicket) {
              setModalText(
                "Only one FastRider ticket can be held at any given time.\n\n Please try after your ride at " +
                  returnTimeTicket
              );
              setModalVisible(true);
              setCantAssignModal(true);
            }
          } else {
            let rideDetails = {
              pin: PIN,
              ride_id: ride.id,
              token: "433898df4a3e992b8411004109e4d574a90695e39e",
            };
            let resp = await axios.post(
              "http://fast-rider.herokuapp.com/api/v1/tickets?api_key=/v1/rides",
              rideDetails
            );

            dispatch(FastRiderAccessCode(resp.data, PIN));
            setShowConfirmation(true);
            // setPIN("");
            setShowSubmit(false);
          }
        } else {
          setInvalidPinMsg("Invalid park ticket PIN number");
        }
      } catch (error) {
        setInvalidPinMsg(error.response.data.massage);
      }
  };

  const checkPINnumber = (pinNumber) => {
    let PinRegExp = /^JN\-[0-9]{4}\-[0-9]{4}\-[A-Z]{2}?$/;
    let validPIN = PinRegExp.test(pinNumber);

    if (validPIN) {
      let splitPIN = pinNumber.split("-");
      let splitNum1 = splitPIN[1].split("");
      let ASCII = getAscii(splitNum1);
      let splitNum2 = splitPIN[2].split("");
      let ASCII2 = getAscii(splitNum2);
      let Chars = String.fromCharCode(ASCII) + String.fromCharCode(ASCII2);
      console.log(Chars);
      return Chars === splitPIN[3];
    } else {
      return false;
    }
  };

  const getAscii = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      let num = 0;
      (i + 1) % 2 === 0 ? (num = arr[i] * 2) : (num = arr[i]);
      if (num > 9) {
        num = num
          .toString()
          .split("")
          .map(Number)
          .reduce(function (a, b) {
            return a + b;
          }, 0);
      }
      newArr.push(num);
    }
    let sumArr = newArr.map(Number).reduce(function (a, b) {
      return a + b;
    }, 0);
    let ASCII = (sumArr % 26) + 65;

    return ASCII;
  };

  return (
    <SafeAreaView style={styles.container}>
      {fontsLoaded ? (
        <View
          style={{
            height: screenHeigth,
            width: screenWidth,
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              height: screenWidth > 900 ? screenHeigth : 2400,
            }}
            onScroll={({ nativeEvent }) => {
              if (
                nativeEvent.contentOffset.y === 0 &&
                PIN !== "" &&
                Object.keys(ride).length !== 0
              ) {
                setShowSubmit(true);
              } else {
                setShowSubmit(false);
              }
            }}
            scrollEventThrottle={400}
          >
            <Modal
              style={{ height: "100%", width: "100%" }}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalTime}>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../assets/ico-03.png")}
                  />
                  <Text style={styles.time}>{currentDate}</Text>
                </View>
                <Text style={styles.modalText}>{modalText}</Text>
                {cantAssignModal && (
                  <Pressable
                    style={styles.CloseButton}
                    onPress={() => {
                      setModalVisible(false);
                      setCantAssignModal(false);
                    }}
                  >
                    <Text style={{ fontFamily: "OpenSans-Regular" }}>
                      Close
                    </Text>
                  </Pressable>
                )}
              </View>
            </Modal>
            {ShowConfirmation && (
              <View>
                <RideComp
                  modalVisible={ShowConfirmation}
                  closeModal={(data) => setShowConfirmation(data)}
                />
              </View>
            )}
            <View
              style={
                screenWidth > 900
                  ? styles.InstructionsContainerWeb
                  : styles.InstructionsContainer
              }
            >
              <Text style={styles.title}>The Jungle™ FastRider Service</Text>
              <View style={styles.Instructions}>
                <Image
                  style={styles.InstructionsImage}
                  source={require("../assets/ico-01.png")}
                />
                <Text style={styles.InstructionsText}>
                  Enter your park ticket #PIN number, then select the desire
                  ride while noting the stated return time
                </Text>
              </View>
              <View style={styles.Instructions}>
                <Image
                  style={styles.InstructionsImage}
                  source={require("../assets/ico-02.png")}
                />
                <Text style={styles.InstructionsText}>
                  Press 'submit' to confirm and retrieve your access code
                </Text>
              </View>
              <View style={styles.Instructions}>
                <Image
                  style={styles.InstructionsImage}
                  source={require("../assets/ico-03.png")}
                />
                <Text style={styles.InstructionsText}>
                  When the time comes, use the special FastRider line to cut out
                  a considerable wait time
                </Text>
              </View>
              <Text style={styles.InvalidPinMsg}>{InvalidPinMsg}</Text>
              <View
                style={
                  screenWidth > 900
                    ? styles.inputContainerWeb
                    : styles.inputContainer
                }
              >
                <TextInput
                  style={[
                    styles.input,
                    { width: screenWidth > 900 ? "70%" : "92%" },
                  ]}
                  placeholder="#PIN"
                  value={PIN}
                  onChangeText={(text) => setPIN(text)}
                />

                {screenWidth > 900 && (
                  <Pressable
                    style={[
                      styles.SubmitButtonWeb,
                      {
                        opacity:
                          PIN === "" && Object.keys(ride).length === 0
                            ? 0.7
                            : 1,
                      },
                    ]}
                    onPress={getAccessCode}
                    disabled={
                      PIN === "" && Object.keys(ride).length === 0
                        ? true
                        : false
                    }
                  >
                    <Text style={styles.ButtonInputText}>SUBMIT</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <View style={screenWidth > 900 ? styles.RidesWeb : styles.Rides}>
              <RidesComp />
            </View>
            {ShowSubmit && screenWidth < 900 && (
              <View style={styles.SubmitButton}>
                <Pressable style={styles.button} onPress={getAccessCode}>
                  <Text style={styles.ButtonInputText}>SUBMIT</Text>
                </Pressable>
              </View>
            )}
            <StatusBar style="auto" />
          </ScrollView>
        </View>
      ) : (
        <ActivityIndicator size="small" color="white" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: "white",
    margin: 10,
    fontFamily: "OpenSans-Bold",
  },
  InstructionsContainer: {
    position: "absolute",
    alignItems: "center",
    alignContent: "center",
    top: "3%",
    width: "100%",
  },
  InstructionsContainerWeb: {
    position: "absolute",
    alignItems: "center",
    top: "2%",
    width: "50%",
    left: "25%",
  },
  InstructionsImage: {
    width: 45,
    height: 45,
    backgroundColor: "#333333",
    borderRadius: 50,
  },
  Instructions: {
    position: "relative",
    width: "60%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
  },
  InstructionsText: {
    textAlign: "center",
    color: "#656565",
    margin: 10,
    fontFamily: "OpenSans-Regular",
  },
  input: {
    backgroundColor: "white",
    height: 50,
    textAlign: "left",
    color: "black",
    fontWeight: "bold",
    paddingLeft: "10%",
  },
  InvalidPinMsg: {
    textAlign: "left",
    color: "#8b0000",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  inputContainer: {
    width: "100%",
    left: "4%",
    margin: 5,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inputContainerWeb: {
    width: "98%",
    margin: 5,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  SubmitButton: {
    position: "absolute",
    top: "30.5%",
    alignContent: "center",
    width: "100%",
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 10,
  },
  SubmitButtonWeb: {
    position: "absolute",
    right: 0,
    alignContent: "center",
    width: "30%",
    height: 50,
    backgroundColor: "#4c4c4b",
    padding: 10,
  },
  button: {
    backgroundColor: "#4c4c4b",
    justifyContent: "center",
    padding: 20,
  },
  CloseButton: {
    width: "30%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: "center",
    backgroundColor: "#4c4c4b",
  },
  ButtonInputText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "OpenSans-Bold",
  },
  Rides: {
    position: "absolute",
    top: "24%",
  },
  RidesWeb: {
    position: "absolute",
    top: "65%",
    width: "50%",
    left: "25%",
  },
  centeredView: {
    position: "relative",
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontFamily: "OpenSans-Bold",
    padding: 20,
    margin: 30,
    width: "80%",
    borderWidth: 3,
    borderColor: "#4c4c4b",
  },
  modalTime: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  time: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontFamily: "OpenSans-Bold",
    marginLeft: 5,
  },
});
