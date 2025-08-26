import React, { useState } from 'react';
import { Form, Input, Select, Radio, Flex, Button, message } from 'antd';
import MyTag from './tags';
import "../CSS/MyMiniform.css";


const { Option } = Select;
const MyMiniForm: React.FC<any> = (props:any) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string | undefined>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  /*****************/
  const handleTypeChange = (value: string) => {
    setType(value);
  };
  /*****************/

  const onFinish = (values: any) => {
    console.log('Form verisi:', values);
    props.veriGonder(values);
   // formu sıfırlamak için
    setTimeout(() => {
      messageApi.open({
        type: 'success',
        content: 'Veri gönderildi!',
        duration: 1,
      });
    }, 1000);
  

  form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} >
      <Form.Item label="Tip" name="type">
        <Select placeholder="Bir tip seçin" onChange={handleTypeChange}>
          <Option value="proje">Proje</Option>
          <Option value="görev">Görev</Option>
        </Select>
      </Form.Item>

      {type === 'proje' && (
        <>
          <Form.Item label="Proje Adı" name="projectName" rules={[{ required: true, message: 'Bir tür seçin!' }]}>
            <Input  placeholder="Proje adını girin" />
          </Form.Item>

          <Form.Item label="Proje Amacı" name="projectGoal" rules={[{ required: true, message: 'Bir tür seçin!' }]}>
            <Input placeholder="Proje amacını girin" />
          </Form.Item>

          <Form.Item label="Etiketler" name="tags" rules={[{ required: true, message: 'Bir tür seçin!' }]}>
            <MyTag />
          </Form.Item>

          <br></br>

        </>

      )}
      {type === 'görev' && (
        <>
          <Form.Item label="Görev Adı" name="projectName" rules={[{ required: true, message: 'Bir tür seçin!' }]}>
            <Input placeholder="Görev adını girin" />
          </Form.Item>

          <Form.Item label="Görev Amacı" name="projectGoal" rules={[{ required: true, message: 'Bir tür seçin!' }]}>
            <Input placeholder="Görev amacını girin" />
          </Form.Item>

          <Flex vertical gap="middle" >
            <Form.Item label="Görevin Büyüklüğü" name="taskType" rules={[{ required: true, message: 'Bir tür seçin!' }]} >
              <Radio.Group size="large">
                <Radio.Button value="xs">x-small</Radio.Button>
                <Radio.Button value="sm">small</Radio.Button>
                <Radio.Button value="md">medium</Radio.Button>
                <Radio.Button value="lg">large</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Flex>

          <Form.Item  name="tags" >
            <MyTag/>
          </Form.Item>
          <br></br>
        </>

      )}
      <Form.Item >
        <>
        {contextHolder}
        <Button className="button" color='red' variant='solid' disabled={!type} htmlType="submit" >
          Create
        </Button>
        </>
      </Form.Item>
    </Form>
  );

};

export default MyMiniForm;
