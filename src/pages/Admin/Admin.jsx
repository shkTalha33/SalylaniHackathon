import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Modal,
  message,
  Divider,
} from "antd";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../config/Firebase";
import {BsFillPeopleFill} from "react-icons/bs"
import {TfiPencilAlt} from "react-icons/tfi"
import {SiBookstack} from "react-icons/si"


export default function Students() {
  const [courses, setCourses] = useState("");
  const [student, setStudent] = useState("");
  const [attendence, setAttendence] = useState("");


const getStudents = async() => {
  try {
    const studentsCollectionRef = collection(firestore, "attendence");

    const querySnapshot = await getDocs(studentsCollectionRef);
    
    const numberOfDocuments = querySnapshot.size;
    setAttendence(numberOfDocuments)
     
  } catch (error) {
    message.error("Something Went wrong")
  }
}
const getCourses = async() => {
  try {
    const studentsCollectionRef = collection(firestore, "courses");

    const querySnapshot = await getDocs(studentsCollectionRef);
    
    const numberOfDocuments = querySnapshot.size;
    setCourses(numberOfDocuments)
     
  } catch (error) {
    message.error("Something Went wrong")
  }
}
const getAttendence = async() => {
  try {
    const studentsCollectionRef = collection(firestore, "students");

    const querySnapshot = await getDocs(studentsCollectionRef);
    
    const numberOfDocuments = querySnapshot.size;
    setStudent(numberOfDocuments)
     
  } catch (error) {
    message.error("Something Went wrong")
  }
}




  useEffect(() => {
    getStudents()
    getCourses()
    getAttendence()
  }, [])
  
  const { Title } = Typography;
  return (
    <>
      <div className="container mx-0 px-0 admin">
        <div className="row">
        <div className="col">
            <div className="row mt-5">
              <div className=" col-12 col-md-10 m-auto">
               <Card  className="card">
                <div className="row d-md-flex justify-content-md-around">

                    <Card className="col-md-3 card mb-3"> 
                      {<BsFillPeopleFill size={30} />}
                      <h2 className="mt-2" >Student</h2>
                      <h1> {student}</h1>
                    </Card>
                    <Card className="col-md-3 card mb-3">
                      {<SiBookstack size={30} />}
                    <h2 className="mt-2">Courses</h2>
                       <h1>{courses}</h1>
                    </Card>
                    <Card className="col-md-3 card mb-3">
                      {<TfiPencilAlt size={30} />}
                    <h2 className="mt-2">Attendence</h2>
                       <h1>{attendence}</h1>
                    </Card>
                </div>
               </Card>
              </div>
            </div>
          </div>
       
        </div>
      </div>
    </>
  );
}
      

