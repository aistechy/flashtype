import React from "react";
import "./App.css";
import Nav from "../Nav/Nav";
import Landing from "../Landing/Landing";
import Footer from "../Footer/Footer";
import ChallengeSection from "../ChallengeSection/ChallengeSection";
import { SAMPLE_PARAGRAPHS } from "../../data/sampleParagraphs";

const TotalTime = 60;
const ServiceUrl = "http://metaphorpsum.com/paragraphs/1/9";
const DefaultState = {
    selectedParagraph: " ",
    timerStarted: false,
    timeRemaining: TotalTime,
    words: 0,
    characters: 0,
    wpm: 0,
    testInfo: []

};

class App extends React.Component {
    state = DefaultState;

    fetchNewParagraphFallback = () => {
        const data = SAMPLE_PARAGRAPHS[
            Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)
        ];

        const selectedParagraphArray = data.split("");
        const testInfo = selectedParagraphArray.map(selectedLetter => {
            return {
                testLetter: selectedLetter,
                status: "notAttempted",
            };
        });

        this.setState({
            ...DefaultState,
            testInfo,
            selectedParagraph: data,
        });



    }


    fetchNewParagraph = () => {
        fetch(ServiceUrl)
            .then(response => response.text())
            .then(data => {

            });

    }

    componentDidMount() {
        this.fetchNewParagraph();

    }

    startTimer = () => {
        this.setState({ timerStarted: true });
        const timer = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                //  Change the WPM
                const timeSpent = TotalTime - this.state.timeRemaining;
                const wpm = timeSpent > 0

                    ? (this.state.words / timeSpent) * TotalTime
                    : 0;
                this.setState({
                    timeRemaining: this.state.timeRemaining - 1,
                    wpm: parseInt(wpm),
                });

            } else {
                clearInterval(timer);
            }



        }, 1000);
    };

    startAgain = () => this.fetchNewParagraph();

    handleUserInput = (inputValue) => {
        if (!this.state.timerStarted) this.startTimer();

        /*
         * 1. Handle the underflow case - all the characters should be shown as not attempted
         * 2. Handle the overflow case - early exit
         * 3. Handle the backspace 
                  - mark the [index + 1] element as not attempted (irrespective of whether the indx is less than zero)
                  - But, dont forget to check for to overflow case here
                    (index + 1 -> out of bound, when index === length -1)
         * 4. Update this status in the test info
                    - find the last character in the inputValue and its index
                    - Check if the character at same index in testInfo (state) match
                    - Yes -> "correct" 
                    - No -> "Incorrect"
        * 5. Irrespective of the case, characters, words and speed (wpm) can be updated        
                    
        */

        const characters = inputValue.length;
        const words = inputValue.split(" ").length;
        const index = characters - 1;

        if (index < 0) {
            this.setState({
                testInfo: [
                    {
                        testLetter: this.state.testInfo[0].testLetter,
                        status: "notAttempted"
                    },
                    ...this.state.testInfo.slice(1)
                ],
                characters,
                words,
            });

            return;
        }

        if (index >= this.state.selectedParagraph.length) {
            this.setState({ characters, words });
            return;
        }

        // make a copy of testInfo
        const testInfo = this.state.testInfo;
        if (!(index === this.state.selectedParagraph.length - 1));
        testInfo[index + 1].status = "notAttempted";

        //check for the correct typed letter
        const isCorrect = inputValue[index] === testInfo[index].testLetter;

        //update the testInfo
        testInfo[index].status = isCorrect ? "correct" : "incorrect";

        //update the state
        this.setState({
            testInfo,
            words,
            characters
        })
    };

    render() {
        return (
            <div className="app">
                {/* Nav Section*/}
                <Nav />

                {/* Landing Page */}
                <Landing />

                {/* Challenge Section */}
                <ChallengeSection
                    selectedParagraph={this.state.selectedParagraph}
                    words={this.state.words}
                    characters={this.state.characters}
                    wpm={this.state.wpm}
                    timeRemaining={this.state.timeRemaining}
                    timerStarted={this.state.timerStarted}
                    testInfo={this.state.testInfo}
                    onInputChange={this.handleUserInput}
                    startAgain={this.startAgain}
                />


                {/* Footer */}
                <Footer />

            </div>
        );
    }
}

export default App;