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
import {AiFillEdit,AiFillDelete} from "react-icons/ai"


export default function Students() {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

  const handleDelete = async(student) => {
    setIsProcessingDelete(true)
    try {
      await deleteDoc(doc(firestore, "students", student.id));
      let newStudents=  students.filter((doc)=>{
        return student.id !== doc.id
      })
      setStudents(newStudents)
      message.success("Student has been deleted successfully")
        
    } catch (error) {
        console.error(error);
        message.error("Something went wrong")

    }
    setIsProcessingDelete(false)
  }

  const handleFinish = async (values) => {
    const { name, rollno, email, phone } = values;
    const randomId = Math.random().toString(36).slice(2);
    const formData = {
      name,
      rollno,
      email,
      phone,
      id: randomId,
    };
    setIsLoading(true);
    try {
      await setDoc(doc(firestore, "students", formData.id), formData);
      setStudents(students=>[...students,formData])
      message.success("Student Added Successfully");

    } catch (error) {
      message.error("Something went wrong while adding user");
    }
    setIsLoading(false);
    setIsModalOpen(false)
  };

const getStudents = async() => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "students"));
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      array.push(data)
    });
    setStudents(array)
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
      <div className="container mx-0 px-0 students">
        <div className="row">
        <div className="col">
            <div className="row mt-5 mx-0 mx-md-5 ">
              <div className="col-12 col-md-10 m-auto">
              <div className="top-section">
                <h1 className="title">Students </h1>
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
                <h2 className="mb-4 text-center" style={{fontFamily:"monospace"}}>Students List</h2>
                <div className="table-responsive">
                  {!students ? "No Students Added Yet" 
                  : 
                  <table className="table table-striped  text-center">
                    <thead>
                      <tr>
                        <th>RollNo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody >
                      {students.map((student,i)=>{
                         return(
                          <tr key={i}>
                          <td style={{fontWeight:600}}>{student.rollno}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.phone}</td>
                          <td><button className="btn btn-danger "  onClick={()=>{handleDelete(student)}}
                          loading={isProcessingDelete} disabled={isProcessingDelete}>{<AiFillDelete />}</button></td>
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
            <Title level={2}>Add Students</Title>
            <Form.Item
              label="Name"
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
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please Enter Correct Email",
                  type: "email",
                },
              ]}
              hasFeedback
            >
              <Input name="email" placeholder="Enter Student Email" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please Enter Phone Number",
                },
                {
                  min: 11,
                  message: "Please Enter Valid Phone number",
                },
                {
                  pattern: /^[0-9]+$/,
                  message: "Please enter only numbers",
                },
              ]}
              hasFeedback
            >
              <Input name="phone" placeholder="Enter Student Phone Number" />
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
