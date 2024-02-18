import React, {useState, useEffect, useCallback} from "react";
import './BattleSectionElements.css';
import {NextPageArrow, CloseIcon} from "../ButtonElements.js";
import { useNavigate } from "react-router-dom";
import TeslaImage from "../../Images/thinkingTesla.avif";
import AlanImage from "../../Images/thinkingAlan.png";
import KidyImage from "../../Images/thinkingKidy.png";
function Arena(){
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [motstanderNavn, setmotstanderNavn] = useState(null);
    const [motstanderBilde, setMotstanderBilde] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [svarFunnet, setSvarFunnet] = useState(false);
    const [resultText, setResultText] = useState("");
    const [robotValg, setRobotValg] = useState([]);
    const [maskinTall, setMaskinTall] = useState(null)
    const [keyPropertyBox, setKeyPropertyBox] = useState(null);
    const [maskinFarge, setMaskinFarge] = useState("black");
    const [maskinValg, setMaksinValg] = useState(null);
    const [brukerFantSvar, setBrukerFantSvar] = useState(false)
    const [score, setScore] = useState(0)
    const [KompleksitetBesvart, setKompleksitetBesvart] = useState(false);
    const [KompleksitetRigktigBesvart, setKompleksitetRigktigBesvart] = useState();
    const [kompleksitetColor, setKompleksitetColor] = useState();
    const [counter, setCounter] = useState(0);
    const [teller, setTeller] = useState(0);
    const [alleClickedElements, setAlleClickedElements] = useState([]);
    const [valgteElementer, setValgteElementer] = useState([]);
    const [algoritmeValgteElementer, setAlgoritmeValgteElementer] = useState([]);
    const [enemiesPlayed, setEnemiesPlayed] = useState([]);
    const [backtrackingList, setBacktrackingList] = useState([]); // is actually same as enemies played, holding list from frontend side
    const [spamText, setSpamText] = useState(null);
    const [konstTeller, setKonstTeller] = useState(1);
    const [ventPaaMotstander, setVentPaaMotstander] = useState(false);
    const [algorithmChat, setAlgorithmChat] = useState("You can start to choose a box");
    const [quizOpen, setQuizOpen] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [correctQuizAnswer, setCorrectQuizAnswer] = useState();
    const [quizClosed, setQuizClosed] = useState(false);
    var valgteBokser = [];
    let spilteMotstandere = [];
    let konstantTeller = 0;
    let counterRun = 0;
    const AlgorithmOptions = {
      "Tesla": "n",
      "Alan": "log(n)",
      "Kidy": "n" 
    };

    const AlgorithmUsed = {
      "Tesla": "Linear",
      "Alan": "Binary",
      "Kidy": "Random"
    }

    const talkingBubble = {
      "Tesla": {
        list: ["Think more linearly", "Now im getting closer", "Wait, is the box next to me the right box?"]
      },
      "Alan": {
        list: ["Thinking..", "Try to find before me", "HA HA! Where u going, think smarter, like I do.", "Hmm, this is going to be tough"]
      },
      "Kidy":{
        list: ["The weather looking great today.", "Have u been to Disney Land, the lego there is soo cool"]
      }
    };

    const winTalkMachine = {
      "Tesla": "Yes I Won. By thinking straight forward, slow but secure.",
      "Alan": "I won HA HA! You need to understand my algorithmic brain to win over me!",
      "Kidy": "Can we now go to Disneyland?"
    }

    const bildeAlgoritme = {
      "Tesla": TeslaImage,
      "Alan": AlanImage,
      "Kidy": KidyImage
    }


    const quizQuestions = [
      {
        question: "Which Searching Algorithm did "+motstanderNavn+" use against you?",
        options: ["Linear", "Fibonacci Search", "Binary", "Exponential", "Fibonacci", "Random"],
        correctAnswer: AlgorithmUsed[motstanderNavn],
      },
      {
        question: "What is the time complexity of the algorithm utilized by " + motstanderNavn + "?",
        options: ["1", "n", "log(n)", "n*log(n)", "n*m^2", "log(n^2)", "n*log(n^2)", "n^3"],
        correctAnswer: AlgorithmOptions[motstanderNavn],
      },
      {
        question: "What is the probability that " + motstanderNavn + " hits the right answer on the third try, based on algorithm utilized by Kidy and number of boxes?",
        options: ["25%", "33%", "50%", "100%"],
        correctAnswer: "100%", // Provide the correct answer
      },
      // Add more questions as needed
    ];
    


    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const INITIAL_DELAY = 2000; //  delay in milliseconds
    const MAX_DELAY = 60000; // maximum delay in milliseconds
    const MAX_RETRIES = 15;

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true); // Setting loading to true when starting fetching data
        try {
          const res = await fetch("/arena?t=" + Date.now());
          const data = await res.json();

          console.log("Data fetched:", data);
          
          if (data.algorithm === '') {
            console.log("RetryCount at", retryCount);
            if (retryCount < MAX_RETRIES){
              console.log("Empty algorithm received, retrying connection...");
              setRetryCount(prevRetryCount => prevRetryCount + 1);
              return; // Exit the function to prevent further processing
            }
            else{
              console.log("Unable to fetch data, an error occured. Server error.");
              setIsLoading(false);
              return;
            }
          }
          //Setting up data values
          setData(data);
          setAnswer(data.answer);
          setmotstanderNavn(data.algorithm);
          setAlgoritmeValgteElementer(data.valgte_elementer);
          setEnemiesPlayed(data.enemies_played);
          //setRetryCount(0); // Reset retry count upon successful fetch
        } catch (error) {
          if (retryCount < MAX_RETRIES) {
            console.log("Retrying to fetch data...");
            setTimeout(fetchData, INITIAL_DELAY * Math.pow(2, retryCount), MAX_DELAY);
            setRetryCount(prevRetryCount => prevRetryCount + 1);
          } else {
            console.error("Max retries exceeded. Unable to fetch data.");
            setIsLoading(false); // Set loading to false after all retries fail
          }
        } finally {
          setIsLoading(false); // Always set loading to false after fetch attempt
        }
      };
    
      fetchData(); // Fetch data on mount
    }, [retryCount]); // Retry count as dependency
    
    
    
    



    const checkAnswer = (event) => {
      const selectedUserValue = parseInt(event.target.value);
      if (selectedUserValue === answer) {
        //setSvarFunnet(true);
        setResultText("You Won!");
        event.target.style.backgroundColor = "green"; // Change color directly here
        setScore(score + 10);
        setSvarFunnet(true);
        return; // exit if answer found by user
      } else {

        event.target.style.backgroundColor = "red"; // Change color directly here
        event.target.disabled = true; // Disable incorrect selections
        setSvarFunnet(false);
        setVentPaaMotstander(true);
      }

      setKonstTeller(prevKonstTeller => prevKonstTeller + 1);
      let updatedKonstTeller = konstTeller;
      while (alleClickedElements.includes(algoritmeValgteElementer[updatedKonstTeller]) || algoritmeValgteElementer[updatedKonstTeller] === selectedUserValue){ // ensuring that choosen box by algorithm is not choosen before by neither user or machine.
        //goes to the next box choice if its already choosen
        updatedKonstTeller++;
      }
      if (algoritmeValgteElementer[updatedKonstTeller] === "0" || algoritmeValgteElementer[updatedKonstTeller] === 0){
        updatedKonstTeller++;
      }
      const selectedMachineValue = algoritmeValgteElementer[updatedKonstTeller];
      
      setKonstTeller(updatedKonstTeller);
      
      setAlleClickedElements([...alleClickedElements, selectedMachineValue, selectedUserValue]);
      console.log("All clicked elements: ", alleClickedElements);
      
      valgteBokser.push(selectedMachineValue);
      valgteBokser.push(selectedUserValue);
      let delay = 1000;
      if (motstanderNavn === "Alan"){
        delay = Math.floor(Math.random() * (3500 - 1000 + 1)) + 1000;
      } else if(motstanderNavn === "Kidy"){
        delay = Math.floor(Math.random() * (1200 - 350 + 1)) + 350;
      } else if(motstanderNavn === "Tesla"){
        delay = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
      }

      // Getting a random chat/answer from the algorithm out from the dictionary with a list for each algorithm.
      const listLength = talkingBubble[motstanderNavn].list.length;
      let randomChat = Math.floor(Math.random() * listLength);
      const randomChatMessage = talkingBubble[motstanderNavn].list[randomChat];
      setAlgorithmChat(randomChatMessage);

      console.log("The Delay is: ", delay);
      setTimeout(() => {        
        setMaskinTall(selectedMachineValue); // setter tallat maskinen har valgt.  
        setVentPaaMotstander(false);
      }, delay);
      
    };

    
  
    function checkMaskin(key){     
      if(key === maskinTall-1){
        valgteElementer.push(key)
        if(maskinTall == answer){
          return "green";
        }
        //console.log(maskinValg)
        return "red"
        
      }else{
        for (let i = 0; i < valgteElementer.length; i++){
          if (valgteElementer[i] == key){
            return "red";
          }
        }
      }
    } 

    const handleKompleksitet = (props) => {
      const knapp = document.getElementById(props); // henter knappen som blir trykket, så vi kan endre fargen på den
      if(AlgorithmOptions[motstanderNavn] == props || (motstanderNavn == "Kidy" && props == "1")){ // Vi godtar også randomly selection til å være 1 og n
        //console.log("Right")
        setScore(score+5)
        setKompleksitetRigktigBesvart("Right Answer")
        knapp.style.backgroundColor = "green";
      }else{
        //console.log("Wrong")
        setScore(score+0)
        setKompleksitetRigktigBesvart("Wrong")
        knapp.style.backgroundColor = "red";
      }
      setKompleksitetBesvart(true);
      setTimeout(() => {
        setKompleksitetBesvart(false); // Reset answer state
        setCurrentQuestionIndex(prevCurrentQuestionIndex => prevCurrentQuestionIndex + 1); // Move to next question
      }, 1000); // Adjust timing as needed for transition duration
    }

    const handleAnswer = (selectedAnswer) => {
      // Determine the correct answer based on the current question index
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const correctAnswer = currentQuestion.correctAnswer;
    

      // Check if the selected answer matches the correct answer
      if (selectedAnswer === correctAnswer) {
        // Update score and set feedback for correct answer
        setScore(score + 1);
        setFeedback("Right Answer");
        setCorrectQuizAnswer(true);
      } else {
        // Set feedback for wrong answer
        setFeedback("Wrong Answer");
        setCorrectQuizAnswer(false);
      }

      

      const buttonElement = document.querySelector(`button[value="${selectedAnswer}"]`);

      if (buttonElement) {
        // Update button style based on the correctness of the answer
        buttonElement.style.backgroundColor = selectedAnswer === correctAnswer ? "green" : "red";
      }
    
      // Set state to indicate that an answer has been given
      setKompleksitetBesvart(true);
    
      // Wait for a brief moment before moving to the next question
      setTimeout(() => {
        buttonElement.style.backgroundColor = "";
      }, 550)
      setTimeout(() => {
        // Move to the next question
        if (currentQuestionIndex === quizQuestions.length - 1) {
          // If it's the last question, close the quiz window
          setQuizOpen(false);
          setQuizClosed(true);
        } else {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
        // Reset state for the next question
        setKompleksitetBesvart(false); // Reset answer state
        setFeedback(null);
      }, 1000); // Adjust timing as needed for transition duration
    };
    
    


      
    const startQuiz = () => {
      
    }
  
    const nextRound = async () => {
      const postData = {"poeng": score, "bruker_fant": brukerFantSvar};
    
      try {
        const response = await fetch('/round_results', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (response.status === 200) {
          console.log("Success");
        } else {
          console.log("Error! ", response);
        }
      } catch (error) {
        console.error(error);
      }
    
      navigate('/optionpage');
    };

    const componentData = () =>{
    return(
      <div className="battleContainer">
        <div className='top'>
            <div className='infoBattle'>
              <h2 className='ArenaHeadline'>The Arena</h2>
              {data && (
                <div className='infoContainerArena'>
                <p className='elusiveInfo'>A elusive green box is hidden behind those boxes.
                Find it before {motstanderNavn} does.
                </p>
                <p className='gameTips'>Some robots receive signals indicating the location of a hidden green box every time they reveal a box. 
                  To increase your chances of success, it may be beneficial to crack the algorithm beforehand.</p>
                <p className='gameTips'>Click on any box to start the game. It is randomly determined who will start.</p>
                <img src={motstanderBilde} />
              </div>
              )}
            </div>
          </div>
          <div className='middle'>
            <div className='boxesContainer'>
              {typeof data.gameboard === 'undefined' || data.algorithm === "" ? (
                // Handle the retry count decrement outside JSX
                <p>Something happened with fetching data, please try to re-visit the website, and try it again.</p>
              ) : (
                data.gameboard.map((gameboard, i) => (
                  <div className='boxes' key={i}>
                    <input 
                      className='btnBoxes' 
                      onClick={checkAnswer} 
                      type="button" 
                      id={"targetBox" + i} 
                      value={gameboard} 
                      disabled={svarFunnet || maskinTall === answer || ventPaaMotstander} 
                      style={{backgroundColor: checkMaskin(i)}} 
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className='bottom battleBottomSection'>
              <div className="containerBildeAlgoritme">
              {motstanderNavn === "Tesla" &&
                <img className="bildeAvAlgoritme" src={bildeAlgoritme[motstanderNavn]} alt="image of machine"/>
              } 
              {motstanderNavn === "Alan" && 
                <img className="bildeAvAlgoritme thinkingAlan" src={bildeAlgoritme[motstanderNavn]} alt="image of machine"/>
              }
              {motstanderNavn === "Kidy" &&
                <img className="bildeAvAlgoritme thinkingKidy" src={bildeAlgoritme[motstanderNavn]} alt="image of machine"/>
              }
              </div>
            {svarFunnet ?
              <div className='algorithmChoiceContainer'> 
                <p style={{fontWeight: 100}}> <span style={{fontWeight: 400}}>{motstanderNavn}</span>: "You won, for now..."</p>
              </div>
                :
              <div className='algorithmChoiceContainer'>
                {maskinTall !== null  ?  <p></p> : <p style={{fontWeight: 100}}></p> }
                {maskinTall === answer && !ventPaaMotstander  ? <p style={{fontWeight: 100, width: 400}}> <span style={{fontWeight: 400}}>{motstanderNavn}:</span> "{winTalkMachine[motstanderNavn]}"</p> : <p style={{fontWeight: 100}}><span style={{fontWeight: 400}}>{motstanderNavn}</span>: "{algorithmChat}"</p> }

              </div>
            }
            {maskinTall !== null ?
            <div className="AlgorithmChooseText">
                <p style={{fontWeight: 400, marginRight: 30}}>
                  {motstanderNavn} Choose Box Number: <span style={{fontWeight: 600}}> {maskinTall} </span>
                </p> 
            </div>
            : <p></p>
            }

         
            <div className='resultater'>
            <h1 className='resultText'>{resultText} {maskinTall == answer ?<div> <p style={{fontWeight: 400}}>The Algorithm Won</p><div className='scoreText'><p className='ArenaHeadline'>+{score} <span style={{fontWeight: 400}}> Points</span> </p></div></div> 
            : <p></p>}</h1>
            {svarFunnet ?
            <div className='scoreText'><p className='ArenaHeadline'>Points + {score} </p></div>
            :
            <p></p>}
            </div>
            
            {(maskinTall === answer || svarFunnet) && !quizClosed &&

            <div className="containerMystery">
              <div className="containerMysteryText">
                <p className="mysteryText">Are u willing to take a test about your enemy, to get on the top of the leaderboard. This will train you to the next rounds. A high risk high reward quiz. </p>
              </div>
              <div className="containerMysteryBtn">
                <btn className="button-49 mysteryBtn" onClick={() => setQuizOpen(true)}>?</btn>
              </div>
            </div>
            }

            {svarFunnet || maskinTall == answer ?  <div className='nextBtnContainer'><button className='nextBtn' onClick={nextRound}>Continue </button></div>:
              <></>
            }
          </div>
          {quizOpen && (
          <div className="quizContainer">
            <div className="quizWindow">
              <div style={{}} onClick={() => setQuizOpen(false)}>
                <CloseIcon />
              </div>
              <div className={`quizQuestion `}>
                <div className="questionHeader">
                  <h3>Question {currentQuestionIndex + 1}</h3>
                </div>
                <div className="questionContent">
                  <p className='timeComplexityText'>{quizQuestions[currentQuestionIndex].question}</p>
                  <div className='timeComplexityOptionsContainer'>
                    {quizQuestions[currentQuestionIndex].options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        value={option} // Set the value attribute to the option value
                        className={`complexityOption1 timeComplexityBtn `}
                        onClick={() => handleAnswer(option)}
                        disabled={KompleksitetBesvart}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="questionContent">
                  <p className='resultComplexityAnswerT'>{feedback}</p>
                </div>
              </div>
              {currentQuestionIndex === 2 && 
                <div><p className="timeComplexityText" style={{fontSize: 14}}>This question is particularly important for understanding, through statistics, the efficiency and inefficiency of different algorithms in certain circumstances, with more and less boxes to choose between.</p></div>
              }
              <div><p className="timeComplexityText" >1p per question</p> </div>
            </div>
          </div>
        )}
      </div>
    )
    }


    return (
      <div className='arenaContainer'>

      {isLoading ? (
      <div className="loadingAttribute">
        <p>Loading Data...</p> 
      </div>
      ) : (
        componentData() // Render component when isLoading is false
      )}

      </div>

    );
    
}

export default Arena;