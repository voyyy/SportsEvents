import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import RatesContext from "../context/RatesContext";

class UserStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: "",
      rates: "",
      category: "",
      avg: "",
    };
    this.loadData = this.loadData.bind(this);
  }

  static contextType = RatesContext;

  async loadData() {
    const ratesAndFinished = await this.context;
    let { category } = this.props.route.params;

    this.setState({
      rates: ratesAndFinished.rates[category],
      finished: ratesAndFinished.finished[category].length,
      category: category,
    });

    if (ratesAndFinished.rates[category].length > 0) {
      let allRates = 0;
      ratesAndFinished.rates[category].forEach((element) => {
        allRates += element.rate;
      });
      this.setState({
        avg: (allRates / this.state.rates.length).toFixed(1),
      });
    } else {
      this.setState({
        avg: 0,
      });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.starsContainer}>
          <ImageBackground
            source={require("../assets/star.png")}
            style={styles.star}
          >
            <Text style={{ fontSize: 35, fontWeight: "600" }}>
              {this.state.avg}
            </Text>
          </ImageBackground>
          <View>
            <Text>(rates: {this.state.rates.length})</Text>
          </View>
        </View>
        <Text style={{ fontSize: 20 }}>
          Finished {this.state.category} events: {this.state.finished}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 110,
  },
  starsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "70%",
  },
  star: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserStatistics;
