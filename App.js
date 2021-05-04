import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import styles from './styles'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#72542d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hidemode: {
        flex: 1,
        backgroundColor: '#f00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textDanger: {
        color: '#f00',
        fontstyle: 'bold',
    },
    textNormal: {
        color: '#fff',
        fontstyle: 'bold',
    },
    btnTime: {
        fontsize: '5px',
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center'
    }
});

class Count extends React.Component
{
    format(time) {
        // Hours, minutes and seconds
        let hrs = ~~(time / 3600);
        let mins = ~~((time % 3600) / 60);
        let secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    render() {
        return (
            <View>
                <Text style={this.getStyle()}>{this.format(this.props.count)}</Text>
            </View>
        )
    }

    getStyle() {
        if (this.props.count < 20) {
            return styles.textDanger
        }
        return styles.textNormal
    }
}

export default class App extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            count: 30,
            started: false,
            title: "Start",
            pause: false,
            alert: "Le temps est écoulé !",
            isEnd: false,
        }
    }

    startCount = () => {
        if (!this.state.started) {
            this.interval = setInterval(this.inc, 1000);
            this.state.started = true;
            this.state.title = "Travail";
        } else {
            if (!this.state.pause) {
                this.setState(prevState => ({title: "Pause"}))
            } else {
                this.setState(prevState => ({title: "Travail"}))
            }
            this.state.pause = !this.state.pause;
            this.setState(prevState => ({isEnd: false}));
        }
    }

    resetCount = () => {
        if (this.state.started) {
            this.setState(prevState => ({title: "Start"}))
            this.setState(prevState => ({count: 30}))
            this.state.pause = true
            this.setState(prevState => ({isEnd: false}));
        }
    }

    removeTime = (time) => {
        if (this.state.count - time > 0) {
            this.setState(prevState => ({count: prevState.count - time}))
        }
    }

    addTime = (time) => {
        this.setState(prevState => ({count: prevState.count + time}))
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUnmount() { clearInterval(this.interval) }

    inc = () => {
        if (!this.state.pause) {
            if (this.state.count > 0) {
                this.setState(prevState => ({count: prevState.count - 1}))
            } else {
                this.setState(prevState => ({title: "Start"}))
                this.setState(prevState => ({count: 30}))
                this.state.pause = !this.state.pause
                this.setState(prevState => ({isEnd: true}));
            }
        }
    }

    render()
    {
        return (
            <View style={styles.container}>
                <Text>Temps restant</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center',}}>
                    <Button style={styles.btnTime} onPress={() => this.removeTime(60)} title={"-1 min"}></Button>
                    <Button style={styles.btnTime} onPress={() => this.removeTime(30)} title={"-30 sec"}></Button>
                    <Count count={this.state.count} main={this}/>
                    <Button style={styles.btnTime} onPress={() => this.addTime(30)} title={"+30 sec"}></Button>
                    <Button style={styles.btnTime} onPress={() => this.addTime(60)} title={"+1 min"}></Button>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center',}}>
                    <Button onPress={this.startCount} title={this.state.title} />
                    <Button onPress={this.resetCount} title={"Reset"} />
                </View>
                <Text style={styles.textDanger}>{this.state.isEnd ? this.state.alert : ""}</Text>
                <StatusBar style="auto" />
            </View>
        );
    }
}