import React, {useEffect, useState} from 'react'
import './ResultPageElements.css'
import { useNavigate } from "react-router-dom";
import { RefreshArrows } from '../ButtonElements';
function ResultPage(){
    const navigate = useNavigate()
    const [totalScore, setTotalScore] = useState(0);
    const [username, setUsername] = useState('');
    const [UserData, setUserData] = useState();
    const [counterChanges, setCounterChanges] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [success, setSuccess] = useState(false);
    const [nyttDataCounter, settNyttDataCounter] = useState(0);
    const [teller, setTeller] = useState(0);
    const [refreshText, setRefreshText] = useState('');
    //mottar data for poeng brukeren har samlet
    useEffect(() => {
      fetch("/last_standing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => res.json())
      .then(data => {
        if (data.total_points > totalScore) {
          setTotalScore(data.total_points);
        }
      })
      if (counterChanges < 5){
        setCounterChanges(+1)
      }
    }, [counterChanges])
    
    const handleRefreshPage = () =>{
      setCounterChanges(counterChanges+1)
      settNyttDataCounter(nyttDataCounter +1)

      setRefreshText("Refreshing. Updating table and Collecting data points...")
      const timeout = setTimeout(() => {
        setRefreshText('');
      }, 3000);
      return () => clearTimeout(timeout);
    }

    useEffect(() => {
      fetch('/retrieve_database')
      .then((res) => res.json())
      .then((data) => {
        setUserData(data)
      })
    }, [nyttDataCounter]);

    const handleCheckUsername = (event) =>{
      fetch('/retrieve_all_users')
      .then((res) => res.json())
      .then((data) => {
        if (data.usernames.includes(event.target.value)){
          setFeedback("Username Exists")
        }else{
          setFeedback("Success")
        }
      })

    }

    const handleNewUserName = (event) => {
      if (event.target.value.length !== 0){
        setUsername(event.target.value);
      }
    }

    const sjekkFeedback = () => {
      if (feedback == 'SUCCESS'){
        return "rgb(77, 234, 77)"
      }else{
        return "red"
      }
    }
  
    const handleNewUser = (event) => {
      event.preventDefault();
      fetch('/retrieve_all_users')
        .then((res) => res.json())
        .then((data) => {
          if (data.includes(username.toLowerCase())) {
            setFeedback("Username Exists")
          } else {
            setFeedback("SUCCESS")
            //console.log("Success on adding on new user")
            setSuccess(true)
            fetch('/register_user_points', {
              method: 'POST',
              body: JSON.stringify({"username": username, "total_points": totalScore}), // sending the server the username, so it can register to database
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then((res) => res.json())
              .then(data => {
                // do something with the data returned from the server

                //setFeedback(data.feedback)
              })
              .catch(error => {
                // handle any errors that may occur
                console.error(error);
              });
              setCounterChanges(nyttDataCounter+1)
          }
        })
        .catch(error => {
          // handle any errors that may occur
          console.error(error);
        });
      event.target.reset()
      setTeller(teller+1)
    }
    
    
    useEffect(() => {
      setCounterChanges(nyttDataCounter+1)
    }, [teller])

    const handleTryAgain = () => {
      fetch('/lets_begin', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => 
        {
          if(data.enemies_played !== []){
            fetch('/lets_begin', {
              method: 'POST',
              body: JSON.stringify({}),
              headers: {
                'Content-Type': 'application/json'
              }
            })
          }
        })
      .catch(error => {
          // handle any errors that may occur
        console.error("Error at receiving ACK from to_options ",error);
      });
      navigate('/')
    }

    return (
        <div className='ResultPageContainer' id="resultpage">
            <div className='ResultsContainer'>
              <div className='topResult'>
                <div className='topBarResult'>
                <div className='pointTextContainer'>
                  <p className='totalPoints'>total points: {totalScore}</p>
                  <div onClick={handleRefreshPage}>
                    <RefreshArrows />
                  </div>
                  <p className='refreshT'>{refreshText}</p>
                </div>
                </div>
              </div>
              <div className='midResult'>
                <div className='tableAndPContainer'>
                <p className='LeaderboardHeadline'>Leaderboard</p>
                <div className='tableContainer'>
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
                  </div>
                  <div className='registerPointsContainer'>
                    <form className='inputUsernameContainer' onSubmit={handleNewUser}>
                      <label className='registerTekst'>Register Your Points</label>
                      <input className='inputUsername' type="text" id='username' placeholder='Username' onChange={handleNewUserName}/> 
                      <button className='usernameBtn' type="submit" disabled={success}>Submit</button>
                    </form>
                    <p className='feedback' style={{color: sjekkFeedback()}}>{feedback}</p>
                  </div>
              </div>
              <div className='bottomResult'>
                <div className='BtnWrapper'>
                  <button className='button-54' onClick={handleTryAgain}>Play Again</button>
                </div>
              </div>
            </div>
        </div>
    )
}

export default ResultPage;