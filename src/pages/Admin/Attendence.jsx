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
  DatePicker,
  Tooltip,
  Divider,
} from "antd";
import { doc, setDoc,collection, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../../config/Firebase";
import {  AiFillDelete } from "react-icons/ai";



export default function Students() {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendence, setAttendence] = useState([]);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState("");
  const [section, setSection] = useState("");
  const [courseValue, setCourseValue] = useState("");
  const [attendenceValue, setAttendenceValue] = useState("");


  const handleChange = (value) => {
    setAttendenceValue(value);
  };
  const handleDate = (_, date) => setDate(s => ({ ...s, date }))
  const handleCourse = (value) => {
    setCourseValue(value)
  };


  const handleDelete = async (attend) => {
    setIsProcessingDelete(true);
    try {
      await deleteDoc(doc(firestore, "attendence", attend.id));
      let newStudents = attendence.filter((doc) => {
        return attend.id !== doc.id;
      });
      setAttendence(newStudents);
      message.success("Student has been deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
    setIsProcessingDelete(false);
  };

  const handleFinish = async (values) => {
    const { name, rollno } = values;
    const randomId = Math.random().toString(36).slice(2);
    const formData = {
      name,
      date:date,
      section,
     attendence :attendenceValue,
      rollno,
      course:courseValue,
      id: randomId,
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
            <Divider  />

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
                        <th>Section</th>
                        <th>Date</th>
                        <th>Attendence</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody >
                      {attendence.map((student,i)=>{
                         return(
                          <tr key={i}>
                          <td>{student.name}</td>
                          <td style={{fontWeight:600}}>{student.rollno}</td>
                          <td>{student.course}</td>
                          <td>{student.section}</td>
                          <td>{student.date.date}</td>
                          <td>{student.attendence}</td>
                          <td>
                             <Tooltip title="Delete" color="red">
                                      <Button
                                        className="btn btn-danger"
                                        size="large"
                                        icon={<AiFillDelete />}
                                        loading={isProcessingDelete}
                                        disabled={isProcessingDelete}
                                        onClick={() => {
                                          handleDelete(student);
                                        }}
                                      />
                                    </Tooltip></td>
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
 
>
  {courses.map((course) => (
    <Select.Option  key={course.id} value={course.title} >
      {course.title}
    </Select.Option>
  ))}
</Select>
<Select
  className="w-100 mb-5"
  placeholder="Select Section"
  label="Section"
  name="section"
  rules={[
    {
      required: true,
      message: "Please select a Section",
    },
  ]}
  hasFeedback
  onChange={section => setSection(section)}
>
  
    <Select.Option  value="A">
      A
    </Select.Option>
    <Select.Option  value="B">
      B
    </Select.Option>
    <Select.Option  value="C">
      C
    </Select.Option>
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
<Form.Item name="date"  rules={[
  {required:true,message:"Please enter date "}
]}>
   <DatePicker className="w-100" name="date" placeholder="Select Date" onChange={handleDate} />
</Form.Item>

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






      

