import '../styles/globals.css';
import React, { useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs-core';

function App({ Component, pageProps }) {
  const webcamRef= useRef(null);
  const canvasRef= useRef(null);

  ////Constantes de los keypoints

    //+Left
  const LShoulder = {x: 0, y: 0};
  const LElbow = {x: 0, y: 0};
  const LWrist = {x: 0, y: 0};
  const LeHip = {x: 0, y: 0};
  const LKnee = {x: 0, y: 0};
  const LFoot = {x: 0, y: 0};
  const LEar = {x: 0, y: 0};

  const Nose= {x: 0, y: 0};
  const Middle = {x: 0, y: 0};

    //+Right
  const RShoulder = {x: 0, y: 0};
  const RElbow = {x: 0, y: 0};
  const RWrist = {x: 0, y: 0};
  const RiHip = {x: 0, y: 0};
  const RKnee = {x: 0, y: 0};
  const RFoot = {x: 0, y: 0};
  const REar = {x: 0, y: 0};


  //// Datos de la sentadilla
  // + Sentadilla               //  + Parado Sentadilla
  //         LArm:180,          //         LArm:180,
  //         RArm: 180,         //         RArm: 180,
  //         LArmpit: 100,      //         LArmpit: 100,
  //         RArmpit: 100,      //         RArmpit: 100,
  //         LHip: 120,         //         LHip: 110,
  //         RHip: 120,         //         RHip: 110,
  //         LLeg: 90,          //         LLeg: 180,
  //         RLeg: 90,          //         RLeg: 180,

  ////Datos Ejercicio 01 - Tronco en sedestación
  //    + Recto                 //    Hacia la izquierda          //Hacia la derecha
  //         LArm: 180,         //         LArm:160,            //         LArm:180, 
  //         RArm: 180,         //         RArm: 160,           //         RArm: 180, 
  //         LArmpit: 15,       //         LArmpit: 35,         //         LArmpit:33,
  //         RArmpit: 15,       //         RArmpit: 35,         //         RArmpit: 30,
  //         LHip: 145,         //         LHip: 120,           //         LHip: 170,
  //         RHip: 145,         //         RHip: 170,           //         RHip: 125,
  //         LLeg: 145,         //         LLeg: 150,           //         LLeg: 150,
  //         RLeg: 145,         //         RLeg: 150,           //         RLeg: 150,
  //         Head: 90,          //         Head: 80,            //         Head: 100,

   


  
 
  //* Load Movenet
  const runMovenet = async ()=> {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    setInterval(()=>{
      detect(detector)
    },100)
  }

  //*Create Pose Detector
  const detect = async (detector) =>{
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      //+ Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      

      //+Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //+Make detections
      const pose = await detector.estimatePoses(video);

      //? Consola - ¿Se ve en cámara o no?
      if(pose[0] === undefined){
        console.log("No se ve en cámara")
      }else{

        //* Calculate keypoints coordinates

        Nose.x = pose[0].keypoints[0].x
        Nose.y = pose[0].keypoints[0].y

          //+Left
        LShoulder.x = pose[0].keypoints[5].x
        LShoulder.y = pose[0].keypoints[5].y

        LElbow.x = pose[0].keypoints[7].x
        LElbow.y = pose[0].keypoints[7].y

        LWrist.x = pose[0].keypoints[9].x
        LWrist.y = pose[0].keypoints[9].y

        LeHip.x = pose[0].keypoints[11].x
        LeHip.y = pose[0].keypoints[11].y

        LKnee.x = pose[0].keypoints[13].x
        LKnee.y = pose[0].keypoints[13].y

        LFoot.x = pose[0].keypoints[15].x
        LFoot.y = pose[0].keypoints[15].y

        LEar.x = pose[0].keypoints[3].x
        LEar.y = pose[0].keypoints[3].y

          //+Right
        RShoulder.x = pose[0].keypoints[6].x
        RShoulder.y = pose[0].keypoints[6].y

        RElbow.x = pose[0].keypoints[8].x
        RElbow.y = pose[0].keypoints[8].y

        RWrist.x = pose[0].keypoints[10].x
        RWrist.y = pose[0].keypoints[10].y

        RiHip.x = pose[0].keypoints[12].x
        RiHip.y = pose[0].keypoints[12].y

        RKnee.x = pose[0].keypoints[14].x
        RKnee.y = pose[0].keypoints[14].y

        RFoot.x = pose[0].keypoints[16].x
        RFoot.y = pose[0].keypoints[16].y

        REar.x = pose[0].keypoints[4].x
        REar.y = pose[0].keypoints[4].y

        //+---
        Middle.x = (pose[0].keypoints[5].x + pose[0].keypoints[6].x)/2
        Middle.y = (pose[0].keypoints[5].y + pose[0].keypoints[6].y)/2


        //? Show angles

        document.getElementById("TLArm").innerHTML = "Angulo brazo izq: " + find_angle(LShoulder,LElbow,LWrist) + "º";
        document.getElementById("TRArm").innerHTML = "Angulo brazo der: " + find_angle(RShoulder,RElbow,RWrist) + "º";
        document.getElementById("TLLeg").innerHTML = "Angulo pierna izq: " + find_angle(LeHip,LKnee,LFoot) + "º";
        document.getElementById("TRLeg").innerHTML = "Angulo pierna der: " + find_angle(RiHip,RKnee,RFoot) + "º";
        document.getElementById("TLArmpit").innerHTML = "Angulo axila izq: " + find_angle(LElbow,LShoulder,LeHip) + "º";
        document.getElementById("TRArmpit").innerHTML = "Angulo axila der: " + find_angle(RElbow,RShoulder,RiHip) + "º";
        document.getElementById("TLHip").innerHTML = "Angulo cadera izq: " + find_angle(LShoulder,LeHip,LKnee) + "º";
        document.getElementById("TRHip").innerHTML = "Angulo cadera der: " + find_angle(RShoulder,RiHip,RKnee) + "º";
        document.getElementById("TLHead").innerHTML = "Angulo Cabeza: " + find_angle(LShoulder,Middle,Nose) + "º";


        //? Ejercicio 1 - Etapa 1 - Tronco en sedestación Posicion 1
        if (exercise01e1p1()){
          console.log("Ejercicio01 Posicion 1");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Posicion Inicial";
         
        }

        //? Ejercicio 1 - Etapa 1 - Tronco en sedestación Posicion 2
        if (exercise01e1p2()){
          console.log("Ejercicio01 Posicion 2");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Hacia la Izquierda";
         
        }

        //? Ejercicio 1 - Etapa 1 - Tronco en sedestación Posicion 3
        if (exercise01e1p3()){
          console.log("Ejercicio01 Posicion 3");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Hacia la Derecha";
         
        }

        //? Ejercicio 1 - Etapa 2 - Bipedestacion Posicion 1
        if (exercise01e2p1()){
          console.log("Ejercicio01 Etapa 2 Posicion 1");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Bipedestacion 1 ";
         
        }

        //? Ejercicio 1 - Etapa 2 - Bipedestacion Posicion 2
        if (exercise01e2p2()){
          console.log("Ejercicio01 Etapa 2 Posicion 2");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - pies atrás ";
         
        }

        //? Ejercicio 1 - Etapa 2 - Bipedestacion Posicion 3
        if (exercise01e2p3()){
          console.log("Ejercicio01 Etapa 2 Posicion 3");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Tronco delante ";
         
        }

        //? Ejercicio 1 - Etapa 2 - Bipedestacion Posicion  final
        if (exercise01e2p4()){
          console.log("Ejercicio01 Etapa 2 Posicion final");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Posición final ";
         
        }

        //? Ejercicio 1 - Etapa 3 - Abduccion hombros posicion inicial
        if (exercise01e3p1()){
          console.log("Ejercicio01 Etapa 3 Posicion inicial");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Abduccion hombros Posición inicial ";         
        }

        //? Ejercicio 1 - Etapa 3 - Abduccion hombros Sostenimiento
        if (exercise01e3p2()){
          console.log("Ejercicio01 Etapa 3 Sostenimiento");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 1 - Abduccion hombros Sostenimiento ";         
        } 

         //? Ejercicio 2 - Posicion 1 Sedestacion
         if (exercise02p1()){
          console.log("Ejercicio02 Sedestacion");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 2 - Sedestacion ";         
        } else if(!exercise03p2() && !exercise01e1p1() && !exercise01e1p2() && !exercise01e1p3() && !exercise01e2p1() && !exercise01e2p2() && !exercise01e2p3() && !exercise01e2p4() && !exercise01e3p1() && !exercise01e3p2() && !exercise02p1()){
          document.getElementById("CheckerText").innerHTML = "";
        }

        //? Ejercicio 2 - Posicion 2 Bipedestacion
        if (exercise02p2()){
          console.log("Ejercicio02 Bipedestacion");
          document.getElementById("CheckerText").innerHTML = "Ejercicio 2 - Bipedestacion ";         
        }
        
        //? Ejercicio 3 - Posicion Inicial
        if (exercise03p1()){
          console.log("Ejercicio 3 - Posicion Inicial")
          document.getElementById("CheckerText").innerHTML = "Ejercicio 3 - Posicion Inicial";
        }

         //? Ejercicio 3 - Sentadilla Lograda
         if (exercise03p2()){
          console.log("Ejercicio 3 - Sentadilla")
          document.getElementById("CheckerText").innerHTML = "Ejercicio 3 - Sentadilla";
        }else if(!exercise01e1p1() && !exercise01e1p2() && !exercise01e1p3() && !exercise01e2p1() && !exercise01e2p2() && !exercise01e2p3() && !exercise01e2p4() && !exercise01e3p1() && !exercise01e3p2() && !exercise02p1() && !exercise02p2() && !exercise03p1() && !exercise03p2()){
          document.getElementById("CheckerText").innerHTML = "";
        }

        



      }
      
      
    }
  }
  

  runMovenet();
  


  
  //? Function calculate 3 points angle
  function find_angle(A,B,C) {
    let AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    let BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    let AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return toDegree( Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)));
  }

  //? Convert number to degree
  function toDegree(Num){
    return Math.ceil((Num * 180) /  Math.PI);
  }
  
  //! Pose Ejercicio 01 - Etapa 1 - Tronco en sedestación
  function exercise01e1p1(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      155 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 135 &&
      155 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 135 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      160 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 135 &&
      165 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 135 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
   //! Pose Ejercicio 01 - Etapa 1 - Tronco en sedestación - Hacia la izquierda
   function exercise01e1p2(){
    return (
      180 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 150 &&
      180 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 150 &&
      165 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 140 &&
      165 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 140 &&
      45 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 25 &&
      45 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 25 &&
      130 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 110 &&
      180 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 160 &&
      90 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 70 
    );
  }
  //! Pose Ejercicio 01 - Etapa 1 - Tronco en sedestación - Hacia la derecha
  function exercise01e1p3(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 170 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 170 &&
      165 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 140 &&
      165 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 140 &&
      45 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 25 &&
      45 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 25 &&
      180 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 160 &&
      130 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 110 &&
      110 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 90 
    );
  }
  //! Pose Ejercicio 01 - Etapa 2 - Bipedestación
  function exercise01e2p1(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      170 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 155 &&
      170 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 155 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      165 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 135 &&
      165 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 135 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
  //! Pose Ejercicio 01 - Etapa 2 - Pies atrás
  function exercise01e2p2(){
    return (
      180 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 140 &&
      180 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 140 &&
      150 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 120 &&
      150 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 120 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      160 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 130 &&
      160 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 130 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
  //! Pose Ejercicio 01 - Etapa 2 - Tronco delante
  function exercise01e2p3(){
    return (
      180 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 145 &&
      180 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 145 &&
      160 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 130 &&
      160 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 130 &&
      50 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 30 &&
      50 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 30 &&
      160 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 130 &&
      160 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 130 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
  //! Pose Ejercicio 01 - Etapa 2 - Posición final
  function exercise01e2p4(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      190 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 160 &&
      190 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 160 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      190 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 160 &&
      190 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 160 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
  //! Pose Ejercicio 01 - Etapa 3 - Posición Inicial
  function exercise01e3p1(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      190 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 160 &&
      190 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 160 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      190 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 160 &&
      190 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 160 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 85 
    );
  }
  //! Pose Ejercicio 01 - Etapa 3 - Sostenimiento
  function exercise01e3p2(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      190 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 160 &&
      190 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 160 &&
      110 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 80 &&
      110 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 80 &&
      185 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 165 &&
      185 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 165 &&
      100 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 70 
    );
  }
  //! Pose Ejercicio 02 - Sedestacion
  function exercise02p1(){
    return (
      50 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 20 &&
      50 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 20 &&
      100 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 70 &&
      100 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 70 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      115 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 85 &&
      115 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 85 &&
      40 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 20 
    );
  }
  //! Pose Ejercicio 02 - Bipedestacion
  function exercise02p2(){
    return (
      60 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 30 &&
      60 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 30 &&
      190 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 160 &&
      190 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 160 &&
      25 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 5 &&
      25 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 5 &&
      185 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 155 &&
      185 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 155 &&
      80 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 50 
    );
  }
  //! Pose Ejercicio 03 - Posicion inicial
  function exercise03p1(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      190 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 160 &&
      190 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 160 &&
      100 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 70 &&
      100 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 70 &&
      185 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 155 &&
      185 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 155 &&
      80 >= find_angle(LShoulder,Middle,Nose) &&
      find_angle(LShoulder,Middle,Nose) >= 50 
    );
  }
  //! Pose Ejercicio 03 - Objetivo logrado Sentadilla
  function exercise03p2(){
    return (
      190 >= find_angle(LShoulder, LElbow, LWrist) &&
      find_angle(LShoulder, LElbow, LWrist) >= 160 &&
      190 >= find_angle(RShoulder, RElbow, RWrist) &&
      find_angle(RShoulder, RElbow, RWrist) >= 160 &&
      110 >= find_angle(LeHip, LKnee, LFoot) &&
      find_angle(LeHip, LKnee, LFoot) >= 75 &&
      110 >= find_angle(RiHip, RKnee, RFoot) &&
      find_angle(RiHip, RKnee, RFoot) >= 75 &&
      115 >= find_angle(LElbow, LShoulder, LeHip) &&
      find_angle(LElbow, LShoulder, LeHip) >= 90 &&
      115 >= find_angle(RElbow, RShoulder, RiHip) &&
      find_angle(RElbow, RShoulder, RiHip) >= 90 &&
      130 >= find_angle(LShoulder, LeHip, LKnee) &&
      find_angle(LShoulder, LeHip, LKnee) >= 105 &&
      130 >= find_angle(RShoulder, RiHip, RKnee) &&
      find_angle(RShoulder, RiHip, RKnee) >= 105
    );
  }


  //* Create canvas | camera | Text
  return (
    <div className="App">
      <header className="App-header">
        <Webcam 
        ref={webcamRef}
        style={{ 
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width:640,
          height:480,
          cssText : "cssText: -moz-transform: scale(-1, 1);                   -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1);                   transform: scale(-1, 1); filter: FlipH"
        }}
        />
        <div>
          <canvas
          ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width:640,
              height:480,
            }}
            
          />
          <p id="TLArm" style={{position: "absolute", left: 10, top: 0}}></p>
          <p id="TRArm"style={{position: "absolute", left: 10, top: 30}}></p>
          <p id="TLLeg"style={{position: "absolute", left: 10, top: 60}}></p>
          <p id="TRLeg"style={{position: "absolute", left: 10, top: 90}}></p>
          <p id="TLArmpit"style={{position: "absolute", left: 10, top: 120}}></p>
          <p id="TRArmpit"style={{position: "absolute", left: 10, top: 150}}></p>
          <p id="TLHip"style={{position: "absolute", left: 10, top: 180}}></p>
          <p id="TRHip"style={{position: "absolute", left: 10, top: 210}}></p>
          <p id="TLHead"style={{position: "absolute", left: 10, top: 240}}></p>
          <h1 id="CheckerText" style={{color: "green", position: "absolute", left: 10, top: 280}}></h1>
        </div>
      
      </header>
    </div>
    
  );
}

export default App
