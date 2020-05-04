import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import StarRating from "react-native-star-rating";
import RatesContext from "../context/RatesContext";
import axios from "axios";

class CategoryRates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: undefined,
      finished: "",
      rates: "",
      token: "",
      ratesAndFinished: "",
      loggedUserId: "",
      category: "",
      userId: "",
      avg: "",
      updateData: "",
    };
    this.addRate = this.addRate.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.deleteRate = this.deleteRate.bind(this);
    this.rate = this.rate.bind(this);
    this.newData = this.newData.bind(this);
  }

  static contextType = RatesContext;

  async componentDidMount() {
    const ratesAndFinished = await this.context;
    let { category } = this.props.route.params;
    let userRate;
    await AsyncStorage.getItem("auth-token")
      .then((value) => {
        this.setState({
          token: value,
          rates: ratesAndFinished.rates[category],
          loggedUserId: ratesAndFinished.loggedUserId,
          finished: ratesAndFinished.finished[category].length,
          category: category,
          userId: ratesAndFinished.userId,
          updateData: ratesAndFinished.updateData,
        });
      })
      .then(() => {
        userRate = ratesAndFinished.rates[category].find(
          (rate) => rate._id === ratesAndFinished.loggedUserId
        );
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

    if (userRate) {
      this.setState({ starCount: userRate.rate });
    }
  }

  async newData() {
    let userRate;
    await axios
      .get(`http://c9892455.ngrok.io/api/user/${this.state.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .then((res) =>
        this.setState({
          rates: res.data.rates[this.state.category],
        })
      )
      .then(() => {
        userRate = this.state.rates.find(
          (rate) => rate._id === this.state.loggedUserId
        );
      })
      .catch((error) => {
        console.log(
          "Category Rates (get user/id error): " + error.response.data.errors
        );
      });
    if (this.state.rates.length > 0) {
      let allRates = 0;
      this.state.rates.forEach((element) => {
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
    if (userRate) {
      this.setState({ starCount: userRate.rate });
    }
    this.state.updateData();
  }

  async addRate(rating) {
    this.setState({ starCount: rating });
    await axios
      .post(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/rate`,
        {
          category: this.state.category,
          rate: rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .then(() => this.componentDidMount())
      .catch((error) => {
        console.log("CategoryRates (post error): " + error.response.data.msg);
      });
    this.newData();
  }

  async changeRate(rating) {
    this.setState({ starCount: rating });
    await axios
      .put(
        `http://c9892455.ngrok.io/api/user/${this.state.userId}/rate`,
        {
          category: this.state.category,
          rate: rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": this.state.token,
          },
        }
      )
      .catch((error) => {
        console.log("CategoryRates (put error): " + error.response.data.msg);
      });
    this.newData();
  }

  async deleteRate() {
    this.setState({ starCount: undefined });
    await axios
      .delete(`http://c9892455.ngrok.io/api/user/${this.state.userId}/rate`, {
        data: { category: this.state.category },
        headers: {
          "Content-Type": "application/json",
          "auth-token": this.state.token,
        },
      })
      .catch((error) => {
        console.log("CategoryRates (delete error): " + error.response.data.msg);
      });
    this.newData();
  }

  rate(rating) {
    if (!this.state.starCount) {
      this.addRate(rating);
    } else if (rating == this.state.starCount) {
      this.deleteRate();
    } else {
      this.changeRate(rating);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StarRating
          disabled={false}
          emptyStar={"star-outline"}
          fullStar={"star"}
          iconSet={"MaterialCommunityIcons"}
          maxStars={5}
          rating={this.state.starCount}
          emptyStarColor={"black"}
          selectedStar={(rating) => {
            this.setState({ starCount: rating });
            this.rate(rating);
          }}
          fullStarColor={"gold"}
          starSize={50}
        />
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => deleteRate()}>
            <Text>(rates: {this.state.rates.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeRate()}>
            <Text>(avg: {this.state.avg})</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => console.log(this.state.starCount)}>
          <Text style={{ fontSize: 20 }}>
            Finished {this.state.category} events: {this.state.finished}
          </Text>
        </TouchableOpacity>
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
  },
  textContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
});

export default CategoryRates;
