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
import { doc, setDoc,collection, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../../config/Firebase";


export default function Students() {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);


  const handleFinish = async (values) => {
    const { detail, code, title } = values;
    const randomId = Math.random().toString(36).slice(2);
    const formData = {
      detail,
      code,
      title,
      id: randomId,
      dateCreated: new Date().getTime()
    };
    setIsLoading(true);
    try {
      await setDoc(doc(firestore, "courses", formData.id), formData);
      setCourses(students=>[...students,formData])
      message.success("Student Added Successfully");

    } catch (error) {
      message.error("Something went wrong while adding user");
    }
    setIsLoading(false);
    setIsModalOpen(false)
  };

const getStudents = async() => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "courses"));
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      array.push(data)
    });
    setCourses(array)
  } catch (error) {
    message.error("Something Went wrong")
  }
}




  useEffect(() => {
    getStudents()
  }, [])
  
  const { Title } = Typography;
  return (
    <>
      <div className="container mx-0 px-0 courses">
        <div className="row">
        <div className="col">
        <div className="row mt-5 mx-0 mx-md-5 ">
              <div className="col-12 col-md-10 m-auto">
              <div className="top-section">
                <h1 className="title" style={{fontFamily:"monospace"}}>Courses </h1>
                <div
                  className="btn btn-primary button"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Course
                </div>
              </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className=" col-12 col-md-10 m-auto">
               <Card className="card" >
                <h2 className="mb-4 text-center" style={{fontFamily:"monospace"}}>Latest Course</h2>
                <div className="row  d-md-flex justify-content-md-around ">
                {courses.map((course,i)=>{
                  return (
                    <Card key={i} hoverable={true} className="col-12 col-md-5 col-lg-5 "  style={{maxWidth:400,maxHeight:400,boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",marginBottom:30}}>
                         <h2 className="text-center mb-2">{course.title}</h2>
                         <Divider />
                         <h3 className="text-center">{course.code}</h3>
                         <p style={{fontFamily:"sans-serif",fontSize:17}}>{course.detail}</p>
                    </Card>
                  )
                })}

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
            <Title level={2}>Add Students</Title>
            <Form.Item
              label="Course Title"
              name="title"
              rules={[
                {
                  required: true,
                  min: 5,
                  message: "Course name must contain atleast 5 letters",
                },
              ]}
              hasFeedback
            >
              <Input name="title" placeholder="Enter Course Name" />
            </Form.Item>
            <Form.Item
              label=" Course Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please Enter Course Code",
                },
              ]}
              hasFeedback
            >
              <Input name="code" placeholder="Enter Course Code" />
            </Form.Item>
            <Form.Item
              label="Course Description"
              name="detail"
              rules={[
                {
                  required: true,
                  message: "Please Enter Description",
                },
                {
                  min: 10,
                  message: "Please Enter atleast 10 letters",
                },
              ]}
              hasFeedback
            >
                <Input.TextArea rows={5} name="detail" placeholder="Enter Enter Description" />
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
      
