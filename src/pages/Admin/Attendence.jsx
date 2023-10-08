import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Modal,
  message,
  Select,
} from "antd";
import { doc, setDoc,collection, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../../config/Firebase";
import dayjs from 'dayjs';



export default function Students() {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendence, setAttendence] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseValue, setCourseValue] = useState("");
  const [attendenceValue, setAttendenceValue] = useState("");


  const handleChange = (value) => {
    setAttendenceValue(value);
  };
  const handleCourse = (value) => {
    setCourseValue(value)
  };
  console.log(courseValue)
  const handleFinish = async (values) => {
    const { name, rollno, course } = values;
    const randomId = Math.random().toString(36).slice(2);
    const formData = {
      name,
     attendence :attendenceValue,
      rollno,
      course:courseValue,
      id: randomId,
      dateCreated: new Date().getTime()
    };
    console.log(formData)
    setIsLoading(true);
    try {
      await setDoc(doc(firestore, "attendence", formData.id), formData);
      setAttendence(attendence=>[...attendence,formData])
      message.success("Attendence Added Successfully");

    } catch (error) {
      console.log(error)
      message.error("Something went wrong while adding attendence");
    }
    setIsLoading(false);
    setIsModalOpen(false)
  };

const getStudents = async() => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "attendence"));
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      array.push(data)
    });
    setAttendence(array)
  } catch (error) {
    message.error("Something Went wrong")
  }
}



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "courses"));
        const courseData = [];
        querySnapshot.forEach((doc) => {
             let data= doc.data()
          courseData.push(data);
        });
        setCourses(courseData);
        console.log(courses)
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    getStudents()
    fetchCourses();
  }, [])
  
  const { Title } = Typography;
  return (
    <>
      <div className="container mx-0 px-0 students">
        <div className="row">
        <div className="col">
            <div className="row mt-5 mx-0 mx-md-5 ">
              <div className="col-12 col-md-10 m-auto">
              <div className="top-section">
                <h1 className="title">Attendence </h1>
                <div
                  className="btn btn-primary button"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add User
                </div>
              </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className=" col-12 col-md-10 m-auto">
        <Card className="card">
                <h2 className="mb-4 text-center" style={{fontFamily:"monospace"}}>Attendence Record</h2>
                <div className="table-responsive">
                  {!attendence ? "No Students Added Yet" 
                  : 
                  <table className="table table-striped  text-center">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>RollNo</th>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Attendence</th>
                      </tr>
                    </thead>
                    <tbody >
                      {attendence.map((student,i)=>{
                         return(
                          <tr key={i}>
                          <td>{student.name}</td>
                          <td style={{fontWeight:600}}>{student.rollno}</td>
                          <td>{student.course}</td>
                          <td>{dayjs(student.dateCreated).format('DD/MM/YYYY')}</td>
                          <td>{student.attendence}</td>
                        </tr>
                         )
                      })}
                    </tbody>
                  </table> 
                  }
                </div>
              </Card>
              </div>
            </div>
          </div>
       
        </div>
        <Modal
className="centered-modal"
open={isModalOpen}
onCancel={() => {
  setIsModalOpen(false);
}}
onOk={() => {
  setIsModalOpen(false);
}}
>
<Form layout="vertical" onFinish={handleFinish}>
  <Title level={2}>Add Attendence</Title>
  <Form.Item
    label="Student Name"
    name="name"
    rules={[
      {
        required: true,
        min: 3,
        message: "Student name must contain atleast 3 letters",
      },
    ]}
    hasFeedback
  >
    <Input name="name" placeholder="Enter Student Name" />
  </Form.Item>
  <Form.Item
    label="Roll no"
    name="rollno"
    rules={[
      {
        required: true,
        message: "Please Enter Roll no",
      },
      {
        pattern: /^[0-9]+$/,
        message: "Please enter only numbers",
      },
    ]}
    hasFeedback
  >
    <Input name="rollno" placeholder="Enter Student Roll no" />
  </Form.Item>

 
<Select
  className="w-100 mb-5"
  placeholder="Select Course"
  label="Course"
  name="course"
  rules={[
    {
      required: true,
      message: "Please select a course",
    },
  ]}
  hasFeedback
  onChange={handleCourse} 
  value={courseValue}
>
  {courses.map((course) => (
    <Select.Option  key={course.id} value={course.title}>
      {course.title}
    </Select.Option>
  ))}
</Select>
<Select
  className="w-100 mb-5"
  placeholder="Select Attendence"
  label="Attendence"
  name="attendence"
  rules={[
    {
      required: true,
      message: "Please select a attendence",
    },
  ]}
  hasFeedback
  onChange={handleChange} 
>
  
    <Select.Option  value="present">
      Present
    </Select.Option>
    <Select.Option  value="absent">
      Absent
    </Select.Option>
</Select>

  <Form.Item className="text-center">
    <Button
      type="primary"
      className="w-50"
      htmlType="submit"
      loading={isLoading}
      disabled={isLoading}
    >
      Add Student
    </Button>
  </Form.Item>
</Form>
</Modal>
      </div>
    </>
  );
}






      

