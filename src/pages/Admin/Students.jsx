import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Modal,
  message,
  Space,
  Tooltip,
  Divider,
} from "antd";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../config/Firebase";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

export default function Students() {
  const [form] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const handleDelete = async (student) => {
    setIsProcessingDelete(true);
    try {
      await deleteDoc(doc(firestore, "students", student.id));
      let newStudents = students.filter((doc) => {
        return student.id !== doc.id;
      });
      setStudents(newStudents);
      message.success("Student has been deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
    setIsProcessingDelete(false);
  };

  const handleFinish = async (values) => {
    const { name, rollno, email, phone } = values;
    const randomId = Math.random().toString(36).slice(2);
    const newStudent = {
      name,
      rollno,
      email,
      phone,
      id: randomId,
    };
    setIsLoading(true);
    try {
      await setDoc(doc(firestore, "students", newStudent.id), newStudent);
      setStudents((students) => [...students, newStudent]);
      message.success("Student Added Successfully");
      setIsLoading(false);
      setIsAddModalOpen(false);
    } catch (error) {
      message.error("Something went wrong while adding user");
      setIsLoading(false);
      setIsAddModalOpen(false);
    }
  };

  const handleUpdate = async (values) => {
    const { name, rollno, email, phone } = values;
    const updatedStudent = {
      ...selectedStudent,
      name,
      email,
      rollno,
      phone,
    };

    try {
      setIsUpdateLoading(true)
      await updateDoc(
        doc(firestore, "students", selectedStudent.id),
        updatedStudent
      );
      message.success("Student data updated successfully");
      setStudents((students) =>
        students.map((student) =>
          student.id === selectedStudent.id ? updatedStudent : student
        )
      );

      setSelectedStudent(null);
      setIsUpdateLoading(false)
      setIsEditModalOpen(false);
    } catch (e) {
      message.error("Something went wrong while updating student data");
      setIsUpdateLoading(false)
      setIsEditModalOpen(false);
    }
  };

  const getStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "students"));
      let array = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        array.push(data);
      });
      setStudents(array);
    } catch (error) {
      message.error("Something Went wrong");
    }
  };

  const showModal = (student) => {
    setSelectedStudent(student);
    if (student) {
      setIsEditModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);
  useEffect(() => {
    if (!isEditModalOpen) {
      form.resetFields(); 
    }
    if (!isAddModalOpen) {
      form.resetFields(); 
    }
  }, [isEditModalOpen,isAddModalOpen]);
  

  const { Title } = Typography;
  return (
    <>
      <div className="container mx-0 px-0 students">
        <div className="row">
          <div className="col">
            <div className="row mt-5 mx-0 mx-md-5 ">
              <div className="col-12 col-md-10 m-auto">
                <div className="top-section">
                  <h1 className="title" onClick={() => showModal(null)}>
                    Students Section
                  </h1>
                  <div
                    className="btn btn-primary button"
                    onClick={() => {
                      setIsAddModalOpen(true);
                    }}
                  >
                    Add User
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="row mt-5">
              <div className=" col-12 col-md-10 m-auto">
                <Card className="card">
                  <h2
                    className="mb-4 text-center"
                    style={{ fontFamily: "monospace" }}
                  >
                    Students List
                  </h2>
                  <div className="table-responsive">
                    {!students ? (
                      "No Students Added Yet"
                    ) : (
                      <table className="table table-striped  text-center">
                        <thead>
                          <tr>
                            <th>RollNo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, i) => {
                            return (
                              <tr key={i}>
                                <td style={{ fontWeight: 600 }}>
                                  {student.rollno}
                                </td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>
                                  <Space>
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
                                    </Tooltip>
                                    <Tooltip title="Edit" color="blue">
                                      <Button
                                        className="btn btn-primary"
                                        size="large"
                                        icon={<AiFillEdit />}
                                        onClick={() => {
                                          showModal(student);
                                        }}
                                      />
                                    </Tooltip>
                                  </Space>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Modal
          className="centered-modal"
          open={isAddModalOpen}
          destroyonclose={true}
          onCancel={() => {
            setIsAddModalOpen(false);

          }}
          onOk={() => {
            setIsAddModalOpen(false);
          }}
        >
          <Form layout="vertical" onFinish={handleFinish} form={form}>
            <Title level={2}> Add Student </Title>
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




        <Modal
          className="centered-modal"
          open={isEditModalOpen}
          destroyonclose={true}
          
          onCancel={() => {
            setIsEditModalOpen(false); 
            setSelectedStudent(null);
          }}
          
          onOk={() => {
            setIsEditModalOpen(false); 
            setSelectedStudent({});
          }}
        >
          <Form layout="vertical" onFinish={handleUpdate} form={form} >
            <Title level={2}> Update Student </Title>
           <Space direction="vertical" className="w-100">
               
           <Form.Item
              label="Name"
              name="name"
              initialValue={selectedStudent ? selectedStudent.name : ""} 
              rules={[
                {
                  required: true,
                  min: 3,
                  message: "Student name must contain atleast 3 letters",
                },
              ]}
              hasFeedback
            >
            
              <Input name="name" placeholder="Enter Student Name"    />
           </Form.Item>
           <Form.Item
              label="Email"
              initialValue={selectedStudent ? selectedStudent.email : ""}
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
              <Input name="email"  placeholder="Enter Student Email"    />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              initialValue={selectedStudent ? selectedStudent.phone : ""}
              rules={[
                {
                  required: true,
                  message: "Please Enter Phone Number",
                },
                {
                  min: 11,
                  message: "Please Enter a Valid Phone number",
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
              // initialValue={selectedStudent ? selectedStudent.rollno : ""}
              initialValue={selectedStudent?.rollno}
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
                loading={isUpdateLoading}
                disabled={isUpdateLoading}
              >
                Update
              </Button>
            </Form.Item>
           </Space>
          </Form>
        </Modal>
      </div>
    </>
  );
}
