import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../Api";
import Register from "../Login/Register";
const  newLocal = <img src="/logo.png" alt="Logo" style={{ width: '150px', height: '45px', marginRight: '16px' }}/>
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
const role = localStorage.getItem("role");

if (role === "admin") {
  console.log("Admin paneli aç");
}
  const onFinish = async (values: any) => {
    try {
      const res = await login(values.email, values.password);

      if (res.message === "success") {
        // 🔥 TOKEN KAYDET
        localStorage.setItem("token", res.token);
       localStorage.setItem("role", res.role);
        messageApi.success("Giriş başarılı!");

        setTimeout(() => {
          navigate("/home"); // 🔥 YÖNLENDİR
        }, 1000);
      }
    } catch (err) {
      messageApi.error("Email veya şifre yanlış!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      {contextHolder}

      <Card title={newLocal} style={{ width: 500 }}>
        
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Şifre" />
          </Form.Item>

          <Button style={{ backgroundColor: "#cb2828" }} type="primary" htmlType="submit" block>
            Giriş Yap
          </Button>
          
          <Button style={{ color: "#cb2828" }} type="link" onClick={() => navigate("/register")}>
            Hesabın yok mu? Kayıt ol
           </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;