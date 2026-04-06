import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { register } from "../Api";

const  newLocal = <img src="/logo.png" alt="Logo" style={{ width: '150px', height: '45px', marginRight: '16px' }}/>
const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await register(values.email, values.password);

      if (res.message === "success") {
        message.success("Kayıt başarılı!");
        navigate("/login");
      }
    } catch (err: any) {
      if (err.response?.data?.message === "user_exists") {
        message.error("Bu email zaten kayıtlı!");
      } else {
        message.error("Bir hata oluştu");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card title={newLocal} style={{ width: 500 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Şifre" />
          </Form.Item>

          <Button style={{ backgroundColor: "#cb2828" }} type="primary" htmlType="submit" onClick={() => navigate("/login")} block>
            Kayıt Ol
          </Button>
          <Button style={{ color: "red" }} type="link" onClick={() => navigate("/login")}>
                      Zaten hesabın var mı? Giriş yap
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;