import { Button, Avatar, Grid, Typography } from "@mui/material";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";


import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Floorplan from "../../assets/floorplan.png";
import {useDrawerContext} from "../../hook/useDrawerContext"

const ManagementFacility = () => {
  // const [editRoom, setEditRoom] = useState(false);
  // const [plotCoordinates, setPlotCoordinates] = useState([]);

  // const handleStartClick = () => {
  //   setEditRoom(true);
  // };

  // const handleFinishClick = () => {
  //   setEditRoom(false);
  //   setPlotCoordinates([])
  // };

  // const handleClickOnImage = (e) => {
  //   if (editRoom) {
  //     const coor = [...plotCoordinates];
  //     coor.push({ x: e.clientX, y: e.clientY });
  //     setPlotCoordinates(coor);
  //   }
  // };

  const points = [
    { name: "101A", x: 15, y: 625 },
    { name: "101B", x: 45, y: 638 },
    { name: "110C", x: 75, y: 652 },
    { name: "101D", x: 40, y: 580 },

    { name: "102A", x: 130, y: 683 },
    { name: "102B", x: 168, y: 700 },
    { name: "102C", x: 150, y: 652 },
    { name: "102D", x: 183, y: 665 },

    { name: "103A", x: 75, y: 510 },
    { name: "103A", x: 55, y: 552 },
    { name: "103A", x: 110, y: 575 },
    { name: "103A", x: 130, y: 540 },

    { name: "104A", x: 176, y: 588 },
    { name: "104B", x: 160, y: 632},
    { name: "104C", x: 190, y: 642},
    { name: "104D", x: 210, y: 600},

    { name: "105A", x: 88 , y: 482},
    { name: "105B", x: 102, y: 425},
    { name: "105C", x: 130, y: 438},
    { name: "105D", x: 160, y: 450},

    { name: "106A", x: 235, y: 555},
    { name: "106B", x: 201, y: 470},
    { name: "106C", x: 250, y: 510},
    { name: "106D", x: 225, y: 500},

    { name: "107A", x: 310, y: 253},
    { name: "107B", x: 310, y: 284},
    { name: "107C", x: 310, y: 315},
    { name: "107D", x: 370, y: 253},

    { name: "108A", x: 310, y: 375},
    { name: "108B", x: 310, y: 406},
    { name: "108C", x: 310, y: 437},
    { name: "108D", x: 370, y: 437},


    { name: "109A", x: 400, y: 253},
    { name: "109B", x: 442, y: 253},
    { name: "109C", x: 442, y: 284},
    { name: "109D", x: 442, y: 315},
    
    { name: "110A", x: 408, y: 375},
    { name: "110B", x: 438, y: 394},
    { name: "110C", x: 438, y: 437},
    { name: "110D", x: 398, y: 437},

    { name: "111A", x: 470, y: 253},
    { name: "111B", x: 499, y: 253},
    { name: "111C", x: 530, y: 253},
    { name: "111D", x: 470, y: 315},

    { name: "112A", x: 465, y: 394},
    { name: "112B", x: 465, y: 437},
    { name: "112C", x: 506, y: 394},
    { name: "112D", x: 506, y: 437},

    { name: "113A", x: 559, y: 253},
    { name: "113B", x: 585, y: 253},
    { name: "113C", x: 612, y: 253},
    { name: "113D", x: 612, y: 295},

    { name: "114A", x: 550, y: 437},
    { name: "114B", x: 581, y: 437},
    { name: "114C", x: 612, y: 437},
    { name: "114D", x: 612, y: 389},

    { name: "115A", x: 640, y: 253},
    { name: "115B", x: 640, y: 284},
    { name: "115C", x: 640, y: 315},
    { name: "115D", x: 674, y: 253},

    { name: "116A", x: 643, y: 381},
    { name: "116B", x: 675, y: 381},
    { name: "116C", x: 644, y: 437},
    { name: "116D", x: 675, y: 437},


    { name: "117A", x: 705, y: 253},
    { name: "117B", x: 736, y: 253},
    { name: "117C", x: 767, y: 253},
    { name: "117D", x: 767, y: 315},

    { name: "118A", x: 705, y: 437},
    { name: "118B", x: 736, y: 437},
    { name: "118C", x: 767, y: 437},
    { name: "118D", x: 767, y: 396},


    { name: "119A", x: 785, y: 545},
    { name: "119B", x: 785, y: 585},
    { name: "119C", x: 815, y: 525},
    { name: "119D", x: 846, y: 525},


    { name: "120A", x: 919, y: 460},
    { name: "120B", x: 955, y: 460},
    { name: "120C", x: 919, y: 500},
    { name: "120D", x: 955, y: 500},

    { name: "121A", x: 919, y: 530},
    { name: "121B", x: 955, y: 530},
    { name: "121C", x: 930, y: 580},
    { name: "121D", x: 955, y: 580},

    { name: "122A", x: 785, y: 620},
    { name: "122B", x: 815, y: 610},
    { name: "122C", x: 785, y: 660},
    { name: "122D", x: 846, y: 610},

    { name: "123A", x: 919, y: 610},
    { name: "123B", x: 950, y: 610},
    { name: "123C", x: 919, y: 660},
    { name: "123D", x: 952, y: 660},

    { name: "124A", x: 785, y: 688},
    { name: "124B", x: 785, y: 719},
    { name: "124C", x: 785, y: 750},
    { name: "124D", x: 845, y: 750},

    { name: "125A", x: 900, y: 750},
    { name: "125B", x: 950, y: 690},
    { name: "125C", x: 950, y: 721},
    { name: "125D", x: 950, y: 750},
  ]

  // document.onmouseup = getXYPosition;
  // var myX, myY, xyOn, myMouseX, myMouseY;
  // xyOn = true;
  // function getXYPosition(e) {
  //   myMouseX = e.clientX;
  //   myMouseY = e.clientY;
  //   console.log(myMouseX, myMouseY)
  //   if (document.documentElement.scrollTop > 0) {
  //     myMouseY = myMouseY + document.documentElement.scrollTop;
  //   }
  // }

  const {open} = useDrawerContext();
  const drawerWidth = 280;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  return (
    <>
      <PageHeader
        title="Facility Management"
        subtitle="View facility vacancy or manage rooms status"
        icon={
          <RoomPreferencesIcon
            sx={{ fontSize: 60, justifyContent: "center" }}
          />
        }
      />

      <div>
        <img
          style={{ width: 1000, height: 600, position: "relative" }}
          src={Floorplan}
          alt="Floorplan"
          onLoad={handleImageLoad}/>
      </div>

      {isImageLoaded && points.map((pt, idx) => (
          <Avatar
            key={idx}
            sx={{
              position: "absolute",
              left: open===true ? pt.x + drawerWidth: pt.x,
              top: pt.y,
              width: 30,
              height: 30,
            }}>
              <Typography variant="subtitle2" color="black">{pt.name}
                </Typography>
            </Avatar>

      ))}

      {/* <Grid container spacing={2}>
        <Grid item>
          {!editRoom && <Button onClick={handleStartClick}>Start</Button> }
          {editRoom && <Button onClick={handleFinishClick}>Finish</Button> }
        </Grid>
        <Grid item>
          <div onClick={handleClickOnImage}>
            <img
              style={{ width: 1000, height: 600 }}
              src={Floorplan}
              alt="Floorplan"
              size="100"
            />
            {editRoom && plotCoordinates.map((plot, index) => (
              <Avatar key={index} sx={{position: 'absolute', width: 30, height: 30, top: plot.y -14, left: plot.x-15}}>
                A
              </Avatar>
            ))}

          </div>
        </Grid>
      </Grid> */}
    </>
  );
};

export default ManagementFacility;
