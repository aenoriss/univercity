import React, { useState, useEffect } from "react";

export default function Landing({ stageHandler }) {
  const [img, setImage] = useState("");
  const [isMobile, setIsMobile] = useState();
  const [carrousel, setCarrousel] = useState();
  const [carrouselStage, setCarrouselStage] = useState(0);
  const [carrDir, setcarrDir] = useState("right");
  const [prevStone, setprevStone] = useState(5);
  const [hide, setHide] = useState(false);
  const [dreamstones, setDreamstones] = useState([
    {
      title: "Multicolor",
      description: "Share your thoughts with people around you",
      style: "mobilePanel_carrousel_content_multicolorCrystal_title",
      img: "./crystals/crystal_all.png",
    },
    {
      title: "Green",
      description: "Creates an Augmented Reality thread",
      style: "mobilePanel_carrousel_content_greenCrystal_title",
      img: "./crystals/crystal_green.png",
    },
    {
      title: "Blue",
      description: "Deploys a portal to connect two places",
      style: "mobilePanel_carrousel_content_blueCrystal_title",
      img: "./crystals/crystal_blue.png",
    },
    {
      title: "Pink",
      description:
        "Chat privately with someone in a similar place or situation",
      style: "mobilePanel_carrousel_content_pinkCrystal_title",
      img: "./crystals/crystal_pink.png",
    },
    {
      title: "Yellow",
      description:
        "Summons up to 5 random sidewalkers to your place!",
      style: "mobilePanel_carrousel_content_yellowCrystal_title",
      img: "./crystals/crystal_yellow.png",
    },
    {
      title: "Red",
      description: "Announces an event on the map for everyone to see.",
      style: "mobilePanel_carrousel_content_redCrystal_title",
      img: "./crystals/crystal_red.png",
    },
  ]);

  const enterHandler = () => {
    stageHandler(0);
  };

  useEffect(() => {
    setHide(false);
    setTimeout(() => {
      setHide(true);
    }, 500);

  }, [carrouselStage]);

  useEffect(() => {
    const textSpan = document.querySelectorAll(".text");

    textSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      }, (idx + 1) * 400);
    });

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    setTimeout(() => {
      textSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove("active");
          span.classList.add("fade");
        }, (idx + 1) * 50);
      });
      textSpan.forEach((span, idx) => {
        span.classList.add("stay");
      });
    }, 2000);
  }, []);

  useEffect(() => {
  }, [isMobile]);

  useEffect(() => {
  }, [carrouselStage]);

  const handleCarrousel = (e) => {
    if (e.target.id == "right") {
      setcarrDir("right");
      setCarrouselStage(carrouselStage < 4 ? carrouselStage + 1 : 0);
    } else {
      setcarrDir("left");
      setCarrouselStage(carrouselStage > 0 ? carrouselStage - 1 : 5);
    }
  };

  return (
    <div className="container">
      <div className="landing">
        <div className="panel_background">
          {isMobile && (
            <div className="mobilePanel">
              <img
                className="logo"
                width="150px"
                src="logo.png"
                style={{
                  animation: "pop",
                  animationName: "spin",
                  animationIterationCount: "infinite",
                  animationDuration: "20s",
                  animationDirection: "alternate",
                  width: "150px",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(0.8)")}
              />
              <div className="landing_title">SIDEWORLD</div>
              <p className="subTitle">
                <p>
                  <span className="highlightedText">Twist</span> space.
                </p>
                <p>
                  <span className="highlightedText">Meet</span> cool people!
                </p>
              </p>

              <div className="button_container_three">
                <button id="login" onClick={enterHandler}>
                  Join the dreamers
                </button>
              </div>

              <div className="mobilePanel_carrousel_container">
                <h3 className="mobilePanel_carrousel_content_title">
                  Dreamstones
                </h3>
                <div className="mobilePanel_carrousel_content">
                  <div
                    id="left"
                    className="mobilePanel_carrousel_arrow"
                    onClick={handleCarrousel}
                  >
                    {" "}
                    {`<`}{" "}
                  </div>
                  {dreamstones.map((dreamstone, i) => {

                    return (
                      carrouselStage == i  && (
                        <div
                          className={`mobilePanel_carrousel_crystal`}
                          style={{
                            animation: carrDir == "right"
                              ? (carrouselStage == i
                                  ? "right_slide-right 1.5s forwards"
                                  : "right_slide-left 1.5s forwards")
                              : (carrouselStage == i
                                  ? "left_slide-right 1.5s forwards"
                                  : "left_slide-left 1.5s forwards")
                          }}
                        >
                          <div className="mobilePanel_carrousel_img">
                            <img height="85%" src={dreamstone.img} />
                          </div>
                          <div className="mobilePanel_carrousel_description">
                            <div className="mobilePanel_carrousel_content_blueCrystal_title">
                              {dreamstone.title}
                            </div>
                            <p>{dreamstone.description}</p>
                          </div>
                        </div>
                      )
                    );
                  })}

                  <div
                    id="right"
                    className="mobilePanel_carrousel_arrow"
                    onClick={handleCarrousel}
                  >
                    {" "}
                    {`>`}{" "}
                  </div>
                </div>
              </div>

              <div className="logo_header1">
                <a href="https://discord.gg/tHKkGk4c">
                  <img
                    className="discord_logo"
                    src="discord.png"
                    alt="Discord Logo"
                  />
                </a>
                <a href="https://twitter.com/SideWorldAR">
                  <img
                    className="twitter_logo"
                    src="Twitter.png"
                    alt="Twitter Logo"
                  />
                </a>
              </div>
              <div className="backgroundMapContainer">
              <img
                className="backgroundMap"
                src="sideworldFooterBackground.png"
              ></img>
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="desktopWarning">
              <img src="sideworld_logo.png" width="200"></img>
              <div className="desktopWarning_content">
                <div className="desktopWarning_content_section_text">
                  <div className="desktopWarning_content_section_text">
                    <span>
                      <span className="reverie_title_bigger">Sorry</span>
                      <span className="desktopWarning_content_emoji">😔</span>
                    </span>
                    <p className="desktopWarning_content_section_text">
                      The Portal isn't open for Desktop yet.{" "}
                    </p>
                  </div>
                  <div className="logo_header2">
                    <a href="https://discord.gg/tHKkGk4c">
                      <img
                        className="discord_logo"
                        src="discord.png"
                        alt="Discord Logo"
                      />
                    </a>
                    <a href="https://twitter.com/SideWorldAR">
                      <img
                        className="twitter_logo"
                        src="Twitter.png"
                        alt="Twitter Logo"
                      />
                    </a>
                  </div>
                </div>
                <div className="desktopWarning_content_QR_text">
                  <p className="reverie_title_bigger">Join us!</p>
                  <img width="180px" src="sideworldQR.png"></img>
                </div>
              </div>
            </div>
          )}
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
