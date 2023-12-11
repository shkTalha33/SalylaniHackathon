import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Form, Image, Input, Modal, Progress, Row, Typography, message } from 'antd';
import { doc, setDoc,collection, getDocs, deleteDoc, query } from "firebase/firestore";
import { firestore,storage } from "../../config/Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const { Title } = Typography;


      


const initialstate = { title: '', description: '' }
export default function Courses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([])
    const [state, setState] = useState(initialstate)
    const [file, setFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        let { title, description ,code} = state
        if (!title) return message.error('Please Enter Course Details Correctly')

        const todo = {
            title, description,code,
            dateCreated: new Date().getTime(),
            id: Math.random().toString(36).slice(2),
            file: "",
        }
        setIsProcessing(true)
        if (file) {
            if (file.size > 500000) {
                setIsProcessing(false)
                return message.error("Your file size greater than 500 KB")
            }
            uploadFile(todo)
        } else {
            createDocument(todo)
        }
    }

    const createDocument = async (todo) => {
        try {
            await setDoc(doc(firestore, "courses", todo.id), todo);
            message.success("A new todo added successfully")
            setDocuments(docs => [...docs, todo])
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setIsProcessing(false)
        setIsModalOpen(false)
    }

    const uploadFile = (todo) => {
        const fileName = todo.id
        var fileExtension = file.name.split('.').pop();
        const storageRef = ref(storage, `images/${fileName}.${fileExtension}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                message.error("Something went wrong while uploading file")
                setIsProcessing(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let data = { ...todo, file: downloadURL }
                    createDocument(data)
                });
            }
        );
    }

    const getTodos = async () => {
        const q = query(collection(firestore, "courses"));
        const querySnapshot = await getDocs(q);
        const array = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            array.push(data);
        });
        setDocuments(array);
    };

    useEffect(() => {
        getTodos()
    }, [])


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <main>
            <div className="container courses">
                <div className="row my-4">
                    <div className="col d-flex justify-content-between top-section">
                        <h1 className="title"> Courses Section</h1>
                        <button className='btn btn-primary btn-sm button' onClick={showModal}>Add  Course</button>
                        <Modal open={isModalOpen} onCancel={handleCancel} onOk={handleCancel} footer={null} style={{ zIndex: 99 }}>
                            <Title level={2} className="text-center my-1  " >Add Course</Title>
                            <Divider />
                            <Form layout='vertical'>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Title">
                                            <Input placeholder='Input your title' name='title' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Course Code">
                                            <Input placeholder='Input your title' name='code' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Image">
                                            <Input type='file'  className="w-100" placeholder='Upload picture' onChange={e => { setFile(e.target.files[0]) }} />
                                        </Form.Item>
                                    </Col>
                                   
                                    <Col span={24}>
                                        <Form.Item label="Description" >
                                            <Input.TextArea placeholder='Input your description' name='description' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={{ span: 12, offset: 6 }} lg={{ span: 8, offset: 8 }} >
                                        <Button type='primary' htmlType='submit' className='w-100' loading={isProcessing} onClick={handleSubmit}>Add Todo</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    </div>
                </div>
                <Divider />
                <div className="row my-5 d-flex flex-wrap m-auto">
                    {documents.map((todo, i) => (
                        <Card  className="col-10 col-md-5 col-lg-3 border border-0 m-4 m-md-3 m-lg-5 card" style={{
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                            padding: '0',
                            overflow: 'hidden',
                          
                          
                        }} key={i}>
                            <img src={todo.file} alt={todo.title} style={{
                                width: '100%',
                                height: '200px'
                            }} />
                            <div className="m-3">
                                <h5 className='mt-3'> <strong>{todo.title}</strong></h5>
                                <p>{todo.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}

