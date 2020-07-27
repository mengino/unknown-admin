import React, { useState, CSSProperties } from 'react';
import { Select, Form } from 'antd';
import { LabeledValue } from 'antd/lib/select';

import { queryRule } from '@/pages/product/service';
import { ProductItem } from '@/pages/product/data';

const { Option } = Select;

export interface SearchInputProps {
  name: string;
  placeholder?: string;
  style?: CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const [data, setData] = useState<LabeledValue[]>([]);
  const [value, setValue] = useState<number>();

  let timeout: NodeJS.Timeout | null;

  const handleSearch = async (keyword: string) => {
    if (keyword) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(() => {
        queryRule({ title: keyword }).then((res) => {
          const result: LabeledValue[] = [];
          res.data.forEach((element: ProductItem) => {
            result.push({
              value: element.id,
              label: element.title,
            });
          });
          setData(result);
        });
      }, 500);
    } else {
      setData([]);
    }
  };

  const handleChange = (v: number) => {
    setValue(v);
  };

  return (
    <Form.Item name={props.name}>
      <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={<>找不到相关App</>}
      >
        {data.map((d) => (
          <Option key={d.value} value={d.value}>
            {d.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default SearchInput;
