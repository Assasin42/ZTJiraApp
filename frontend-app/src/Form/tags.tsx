import React from 'react';
import { Flex, Tag } from 'antd';
import '../CSS/tags.css';
const tagsData = ['Ziraat', 'Finans', 'Ziraat Teknoloji', 'Yazılım'];

interface MyTagProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MyTag: React.FC<MyTagProps> = ({ value = [], onChange }) => {
  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...value, tag]
      : value.filter((t) => t !== tag);

    onChange?.(nextSelectedTags); // Form'a bildir
  };

  return (
    <Flex gap={4} wrap align="center">
      <span>Categories:</span>
      {tagsData.map((tag) => (
        <Tag.CheckableTag
          className='my-tag'
          style={{color:'red'}}
          key={tag} 
          checked={value.includes(tag)}
          onChange={(checked) => handleChange(tag, checked)}
          
        >
          {tag}
        </Tag.CheckableTag>
      ))}
    </Flex>
  );
};

export default MyTag;
