import React, { useState, useEffect  } from "react";

export default function Landing({stageHandler}) {
  const [img, setImage] = useState("");

  const enterHandler = () => {
    stageHandler(0);
  }
 
   useEffect(() => {
    const textSpan = document.querySelectorAll('.text');

    textSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add('active');
      }, (idx + 1) * 400);
    });

    setTimeout(() => {
      textSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove('active');
          span.classList.add('fade');
        }, (idx + 1) * 50);
      });
      textSpan.forEach((span, idx) => {
        span.classList.add('stay');
      }
    );
    }, 2000);
  }, []);
  

  return (
   <div className="container">
    <div className="landing">
      <div className="panel_background">
        <img className="logo" width="150px" src="logo.png" 
          style={{
           animation: 'pop 1s ease-in-out',
           animationName: 'popIn',
           animationIterationCount: 'infinite',
           animationDirection: 'alternate',
           animationTimingFunction: 'ease-in-out',
           animationDuration: '1s',
           width: '200px',
           height: '200px',
           transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={e => (e.target.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.target.style.transform = 'scale(0.8)')}/>
       <h1>Sideworld</h1>
       <p className="subTitle" >
          Post your <b className="highlightedText">ideas</b> into the real world
          using <span class='text'> Augmented </span><span class='text'> Reality</span>
       </p>

       <div className="button_container_three">
          <button id="login" onClick={enterHandler}>
           Join the dreamers
       </button>
       </div>
        <div className="logo_header">
        <a href='https://discord.gg/tHKkGk4c'>
           <img className="discord_logo" src="discord.png" alt="Discord Logo"/>
        </a>
        <a href='https://twitter.com/SideWorldAR'>
           <img className="twitter_logo" src="Twitter.png" alt="Twitter Logo"/>
        </a>
       </div>
   </div>
  </div>
  </div>
  );
}


// import { useState } from "react";

// export default function Landing({stageHandler}) {
//   const [img, setImage] = useState("");

//   const enterHandler = () => {
//     stageHandler(0);
//   }

//   return (
//     <div className="landing">
//       <div className="title_header">
//         <img className="logo" width="150px" src="sideworld_logo.jpg" />
//         <h1>Sideworld</h1>
//         <p className="subTitle">
//           Post your <b className="highlightedText">ideas</b> into the real world
//           using <b className="highlightedText">augmented reality</b>
//         </p>
//       </div>
//       <div className="button_container_three">
//         <button id="login" onClick={enterHandler}>
//           Join the dreamers
//         </button>
//       </div>
//     </div>
//   );
// }
