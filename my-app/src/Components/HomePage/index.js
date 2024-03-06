import React from 'react'
import { useNavigate } from "react-router-dom";
import './HomePageElements.css'


function HomePage() {
    let navigate = useNavigate();
    
    const handleToOptions = () =>{
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
          //console.log(data.enemies_played) // it should be empty
          navigate('/optionpage')
        })
      .catch(error => {
          // handle any errors that may occur
        console.error("Error at receiving ACK from to_options ",error);
      });
      
    };
    

    return(
        <div id="homepage" className='HomePageContainer'>
        <div className='InformationSection'>
          <div className='topHomePage'>
            <div className='infoSection'>
              <p className='welcomeText'> Welcome To AlgoBattle </p>
            </div>
          </div>
          
          <div className='middleHomePage'>
            <div className='middleInfoSection'>
              <p className='AboutTheGameText HvaDetErOmTekst'>Welcome to the exciting world of algorithms!
              In this game, players will be challenged to find the elusive green box among a sea of other boxes before the algorithm does.
              By competing against other players and choosing different algorithms to compare against, players will not only have fun but also learn valuable skills in the field of algorithms.
              Keep track of your progress and compete for the top spot on our leaderboard. Get ready to sharpen your instinct feeling!
              </p>
              <div className='NoticeText'>
                <p className='AboutTheGameText NoticeT'>------------------Notice------------------</p>
                <p className='AboutTheGameText NoticeT'> * Experience optimal gameplay by using a up-to-date web browser. The game is hosted on a server and using an outdated browser may result in conflicts and impede the updating of your choices. </p>
                <p className='AboutTheGameText NoticeT'> * Please keep in mind that this is a beta version of the game, if you encounter any issues or bugs, please reach out to me through my <a href='https://ahmettu.com/' target="_blank">Website</a>.</p>
              </div>
            </div>
          </div>
            
          <div className='bottomHomePage'>
            <div className='GameStartContainer'></div>
              <button onClick={handleToOptions} className='button-54'>Let's get started</button>
            </div>
        </div>
      </div>
    )
}

export default HomePage;