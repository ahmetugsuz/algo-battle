import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import './OptionPageElements.css';
import {InfoBtn, LeftArrow, RightArrow} from "../ButtonElements.js";


function OptionPage(){
    const navigate = useNavigate()
    const [imageHoverTesla, setImageHoverTesla] = useState(false);
    const [imageHoverAlan, setImageHoverAlan] = useState(false);
    const [imageHoverKidy, setImageHoverKidy] = useState(false);
    const [algoritme, setAlgorimte] = useState('Tesla'); /*Her skal vi si hvem algoritme vi har valgt */
    const [antallBokser, setAntallBokser] = useState(10);
    const [validInput, setValidinput] = useState(true);
    const [validAlgoritme, setValidAlgoritme] = useState(true);
    const [colorTesla, setColorTesla] = useState('white')
    const [colorAlan, setColorAlan] = useState('white')
    const [colorKidy, setColorKidy] = useState('white')
    const [enemiesPlayed, setEnemiesPlayed] = useState([])
    const [TeslaDisabled, setTeslaDisabled] = useState(false)
    const [AlanDisabled, setAlanDisabled] = useState(false)
    const [KidyDisabled, setKidyDisabled] = useState(false)
    const [TotalScore, setTotalScore] = useState(0);
    const [ShowResults, setShowResults] = useState(false);
    const [finalResults, setFinalResults] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [UserData, setUserData] = useState();
    const [InfoVisible, setInfoVisible] = useState(false);
    const names = ["Alan", "Tesla", "Kidy"]
    const [konstantOppdateringer, setKonstantOppdateringer] = useState(0);
    const [counter, setCounter] = useState(0);
    const [counterChanges, setCounterChanges] = useState(0);
    const [kallAPI, setKallAPI] = useState(0);
    const [previousTotalScore, setPreviousTotalScore] = useState(0);
    const handleClick = () =>{  
        fetch('/algoritme_data', {
          method: 'POST',
          body: JSON.stringify({"antall": antallBokser, "algoritme": algoritme, "enemies_played": enemiesPlayed, "total_points": TotalScore}),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
        .then(response => {
          if (response.status === 200) {
            console.log("Success")
          } else {
            // do something with the data returned from the server
            console.log(response)
          }
          }).then(() => {
            
          })
          .catch(error => {
            // handle any errors that may occur
            console.error("Error at receiving ACK from algoritmeData ",error);
          });
          navigate('/arena')
      };

      //mottar data for hvem som har blitt spilt mot
      const [dataFetched, setDataFetched] = useState(false);

      useEffect(() => {

          fetch("/last_standing", {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.enemies_played.length > enemiesPlayed.length){
              setEnemiesPlayed(data.enemies_played);
            }
            console.log("previos: ",previousTotalScore)
            if (previousTotalScore > data.total_points) {
              // previous TotalScore was higher
              console.log('Previous TotalScore was higher');
            }
            if (data.total_points > TotalScore){
              setTotalScore(data.total_points);
            }
            if (data.enemies_played.length > 2){
              setShowResults(true);
            }
            // checks if we have already played against algorithms, set them to disabled
            if (data.enemies_played.includes(names[0])){
              setAlanDisabled(true);
            }
            if (data.enemies_played.includes(names[1])){
              setTeslaDisabled(true);
            }
            if (data.enemies_played.includes(names[2])){
              setKidyDisabled(true);
            }
            setDataFetched(true); // set the flag to true once the data has been fetched
          })

          setPreviousTotalScore(TotalScore);

        if (counterChanges < 5){
          setCounterChanges(counterChanges+1)
        }

      }, [counterChanges, dataFetched]);


    useEffect(() => {
      let teller = 0
      for(let i = 0; i < enemiesPlayed.length; i++){
        teller++
      }
      if(teller >= 3){
        console.log("Showing final rusults")
        setFinalResults(true);
        setShowResults(true);
        console.log("YES the showResult is now true -- DEBUG 2")
      }

      // Check for disabled states here, after the state updates have been applied
      if (AlanDisabled === true && TeslaDisabled === true && KidyDisabled === true){
        setShowResults(true);
      }
    }, [konstantOppdateringer]);


      useEffect(() => {
        // Check for disabled states here, after the state updates have been applied
        if (AlanDisabled === true && TeslaDisabled === true && KidyDisabled === true){
          setShowResults(true);
        }
      }, [names])

      useEffect(() => {
        fetch('/retrieve_database')
          .then((res) => res.json())
          .then((data) => {
            setUserData(data);
          })
      }, []);

      const handleHoverTesla = () => {
        {imageHoverTesla ? setImageHoverTesla(false) : setImageHoverTesla(true)}
      }
      const handleHoverAlan = () => {
        {imageHoverAlan ? setImageHoverAlan(false) : setImageHoverAlan(true)}
      }
      const handleHoverKidy = () => {
        {imageHoverKidy ? setImageHoverKidy(false) : setImageHoverKidy(true)}
      }
    
      const handleInfoBtn = () => {
        {InfoVisible ? setInfoVisible(false) : setInfoVisible(true)}
      }
    
      const handlePageClick = () => {
        if (InfoVisible){
          setInfoVisible(false);
        }
        setKonstantOppdateringer(konstantOppdateringer + 1)

      } 
      
      const handleAlgoritme = (props) =>{
        setAlgorimte(props)
        setValidAlgoritme(false);
        if(props === "Tesla"){
          setColorTesla(colorTesla === 'white' ? 'green' : 'white');
          setColorAlan("white");
          setColorKidy("white");
        }
        else if(props === "Alan"){
          setColorAlan(colorAlan === 'white' ? 'green' : 'white');
          setColorTesla("white");
          setColorKidy("white");
        }
        else if(props === "Kidy"){
          setColorKidy(colorKidy === 'white' ? 'green' : 'white');
          setColorAlan("white");
          setColorTesla("white");
        }
      }
    
      const handleAntallBokser = (event) => {
          if(event.target.value.length === 0){
            setValidinput(true);
            setAntallBokser(5);
          }else{
            setValidinput(false);
            if (event.target.value > 30){
              setAntallBokser(30)
            }else if(event.target.value < 5){
              setAntallBokser(5);
            }
            else{
              setAntallBokser(event.target.value);
            }
        }
      }
    
      const handleShowLeaderboard = () =>{
        {showLeaderboard ? setShowLeaderboard(!showLeaderboard) : setShowLeaderboard(!showLeaderboard)}
      }
    
      const handleToResults = () => {
        navigate('/resultpage')
      }

    return (
        <div id="optionpage" className='OptionPageContainer' onClick={handlePageClick}>
        <div className='mainSectionContainer'>
          <div className='top'>
            <div className='infoSection'>
              <p className='welcometext'>Welcome To The Game Options</p>
              <InfoBtn onClick={handleInfoBtn} className='infoBtn '>info</InfoBtn>
              {InfoVisible ?
              <div className='infoContainer'>
                <div className='infoTextContainer'>
                  <p className='infoOptions'>Some information about the game and the options </p>
                  <p className='infoOptions'> - To make the game more up to you and your cleverness, you choose how many boxes you want.
                  As this has an impact on the game, it is important that you choose the number carefully in relation to the algorithm you want to play against.
                  </p>
                  <p className='infoOptions'> - You have the option to select the number of boxes in the game, with a minimum of 5 boxes and a maximum of 30 boxes. If you choose a number outside of these limits, it will automatically be adjusted to the nearest limit.  </p>
                  <p className='infoOptions'> - There are three algorithms to choose from, each with a unique way of thinking and box selection.</p>
                  <p className='infoOptions'> - To start the game, you must specify the number of boxes and select one of the available algorithms!</p>
  
                </div>
              </div>
              :
              <div></div>
              }
            </div>
            <form className='inputField' >
              <label className='antallBoxT'>Number of boxes</label>
              <input className='antallBox' type="number" placeholder='Boxes' onChange={handleAntallBokser} />
            </form>
          </div> 
          <div className='middle'>
            <p className='select'>Select an algorithm</p>
            <div className='algorithmOptions'>
  
              {TeslaDisabled ? 
              <div className='BtnTesla LockedPicture' onMouseEnter={handleHoverTesla} onMouseLeave={handleHoverTesla}>
                {imageHoverTesla ? 
                  <p className='LockedTextTesla '>Locked</p>
                :
                  <p className='RobotName '>Tesla</p>
                }
              </div>
              :
              <div className='BtnTesla' onMouseEnter={handleHoverTesla} onMouseLeave={handleHoverTesla} onClick={() => handleAlgoritme("Tesla")} style={{border: "solid 4px "+colorTesla}} >
                {imageHoverTesla ? 
                  <p className='ImageInfo teslaT'>Like we know, tesla loves to see things as linearly</p>
                :
                  <p className='RobotName'>Tesla</p>
                }
              </div>
              }
  
              {AlanDisabled ? 
                <div className='BtnAlan LockedPicture' onMouseEnter={handleHoverAlan} onMouseLeave={handleHoverAlan}>
                  {imageHoverAlan ? 
                    <p className='LockedTextAlan'>Locked</p>
                  :
                    <p className='RobotName'>Alan</p>
                  }
                </div>
  
              :
                <div className='BtnAlan' onMouseEnter={handleHoverAlan} onMouseLeave={handleHoverAlan}  onClick={() => handleAlgoritme("Alan")} style={{border: "solid 4px "+colorAlan}} disabled={AlanDisabled}>
                  {imageHoverAlan ? 
                    <p className='ImageInfo AlanT'>Alan, the smart guy, prefers to think algorithmically, and therefore always seeks the most efficient solution.</p>
                  :
                    <p className='RobotName'>Alan</p>
                  }
                </div>
              }
  
              {KidyDisabled ?
                <div className='BtnKidy LockedPicture' onMouseEnter={handleHoverKidy} onMouseLeave={handleHoverKidy}>
                  {imageHoverKidy ? 
                    <p className='LockedTextKidy kiddyHoverText'>Locked</p>
                  :
                    <p className='RobotName kiddyHoverText'>Kidywolf</p>
                  }
                </div>
              :
              <div className='BtnKidy' onMouseEnter={handleHoverKidy} onMouseLeave={handleHoverKidy} onClick={() => handleAlgoritme("Kidy")} style={{border: "solid 4px "+colorKidy}} disabled={KidyDisabled}>
                {imageHoverKidy ? 
                  <p className='ImageInfo kiddyT'>Kidy likes to engage in a variety of activities, including playing video games on a console, golfing, and interacting with people. He says his choices depend on the weather conditions.</p>
                :
                  <p className='RobotName kiddyHoverText'>Kidywolf</p>
                }
              </div>
              }
            </div>
          </div>
          <div className='bottom'>
            {ShowResults ?
              <div className='gameoption'>
                <button className='button-54' onClick={handleToResults}><RightArrow />Results </button>
              </div>
            :
            <div className='gameoption'>
              {showLeaderboard ? 
                <div className='tableContainer tableWrapper'>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="table-header">Username</th>
                        <th className="table-header">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(typeof UserData === "undefined") ? (
                        <p>Loading..</p>
                      ) : (
                      UserData.map((item, index) => (
                        <tr key={index}>
                          <td className="table-data">{item.username}</td>
                          <td className="table-data">{item.points}</td>
                        </tr>
                        ))
                      )}
                      </tbody>
                    </table>
                  </div>
                  :
                  <div></div>
              }
              <div className='bottomOptionsContainer'>
                <button className='scoreboardBtn button-54' onClick={handleShowLeaderboard}> {showLeaderboard ? <RightArrow /> : <LeftArrow />}  Scoreboard</button>
                <button className='startGameBtn button-54' onClick={() => handleClick()} disabled={validInput || validAlgoritme}>Start the game</button>
                <div className='wrapPoints'><p className='CurrentPoints'> Current Points: {TotalScore}</p></div>
              </div>
            </div>
            }
          <p className='noteBugsT'>There may be some issues with the API call when retrieving data from the server. To resolve this, try refreshing the browser or switching to a different one (such as Google Chrome). </p>
          </div>
        </div>
      </div>
    )
}

export default OptionPage;