import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Card } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { setSelctedRide } from "../redux/actions/actions";

export default function RidesComp() {
  const rides = useSelector((state) => state.allData.rides);
  const selcetedRideStatus = useSelector((state) => state.allData.selectedRide);
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get("window").width;
  const [backgroundColor, setBackgroundColor] = useState({
    id: "",
    color: "#373737",
  });

  const updateBackgroundColor = (id) => {
    if (Object.keys(selcetedRideStatus).length === 0) {
      return "#373737";
    }
    if (id === backgroundColor.id) {
      return backgroundColor.color;
    } else {
      return "#373737";
    }
  };

  const onPressCard = (ride) => {
    if (backgroundColor.id === ride.id) {
      setBackgroundColor({ id: "", color: "#373737" });
      dispatch(setSelctedRide({}));
    } else {
      setBackgroundColor({ id: ride.id, color: ride.zone.color });
      dispatch(setSelctedRide(ride));
    }
  };
  const getTime = (returnTimeRide) => {
    let time = new Date(returnTimeRide);
    let hour = time.getHours();
    let minutes = time.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let returnTime = hour + ":" + minutes;
    return returnTime;
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {rides &&
          rides.map((ride) => {
            return (
              <TouchableOpacity
                key={ride.id}
                style={{
                  width: screenWidth > 900 ? "25%" : "50%",
                  opacity: ride.remaining_tickets === 0 ? 0.6 : 1,
                }}
                onPress={() => onPressCard(ride)}
                disabled={ride.remaining_tickets === 0 ? true : false}
              >
                <Card
                  containerStyle={[
                    styles.ride,
                    {
                      backgroundColor: updateBackgroundColor(ride.id),
                    },
                  ]}
                >
                  <View
                    style={{
                      borderBottomColor: ride.zone.color,
                      borderBottomWidth: 5,
                    }}
                  />
                  <View>
                    <Text style={styles.zone}>{ride.zone.name}</Text>
                    <Text style={styles.rideName}>{ride.name}</Text>
                  </View>
                  <View style={[styles.detailsContainer]}>
                    <View style={styles.returnTimeContainer}>
                      <Image
                        style={styles.iconImage}
                        source={require("../assets/ico-g-03.png")}
                      />
                      <Text style={styles.text}>
                        {getTime(ride.return_time)}
                      </Text>
                    </View>

                    <View style={styles.remainingTicketsContainer}>
                      <Image
                        style={[styles.iconImage]}
                        source={require("../assets/ico-g-01.png")}
                      />
                      <Text style={styles.text}>{ride.remaining_tickets}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  ride: {
    padding: 0,
    borderWidth: 0,
    width: "95%",
    height: 130,
    margin: 8,
  },
  zone: {
    color: "#656565",
    textAlign: "right",
  },
  rideName: {
    margin: 10,
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: "#656565",
  },
  detailsContainer: {
    position: "absolute",
    top: 100,
    width: "92%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 5,
    justifyContent: "space-between",
  },
  returnTimeContainer: {
    flexDirection: "row",
    marginRight: 25,
    justifyContent: "flex-start",
  },
  remainingTicketsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconImage: {
    marginLeft: 5,
    marginRight: 5,
    width: 20,
    height: 20,
  },
});
