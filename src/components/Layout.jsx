import React, { useState } from "react";
// import AddTask from '../Dashboard/AddTask';
import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {AiOutlineDashboard} from "react-icons/ai"
import {BsFillPeopleFill} from "react-icons/bs"
import {TfiPencilAlt} from "react-icons/tfi"
import {SiBookstack} from "react-icons/si"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { Sider, Content } = Layout;

  
  return (
    <>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            minWidth: "250px",
            minHeight: "100vh",
            marginRight: "10px",
            // background: "#001845",
            margin: "0px",
            padding: "0px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "20px",
              display: "inline-block",
              height: "40px",
              lineHeight: "60px",
              marginLeft: "15px",
            }}
          >
            {collapsed ? "" : "Menu"}
          </span>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "white",
              float: "right",
            }}
          />

          <div className="demo-logo-vertical" />
          <Menu
            style={{
              marginTop: "20px",
              height:"82vh",
              background: "#002855",
              
            }}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                type:"group",
                key: "tasks",
                label: "Admin",
              },

              {
                key: "1",
                icon: <AiOutlineDashboard />,
                label: (
                  <Link style={{ textDecoration: "none" }} to="/">
                    Dashboard
                  </Link>
                ),
              },
              {
                key: "2",
                icon: <BsFillPeopleFill />,
                label: (
                  <Link style={{ textDecoration: "none" }}  to="/students">
                    Students
                  </Link>
                ),
              },
              {
                key: "3",
                icon: <TfiPencilAlt />,
                label: (
                  <Link style={{ textDecoration: "none" }} to="/attendence" >
                    Attendence
                  </Link>
                ),
              },

              {
                key: "4",
                icon: <SiBookstack />,
                label: (
                  <Link style={{ textDecoration: "none" }} to="/courses">
                    Courses
                  </Link>
                ),
              },
              
            ]}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              width:"100%",
              padding: "0px ",
              maxHeight: "100vh",
              overflow: "auto",    
              background: "white",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}



