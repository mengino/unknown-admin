import React from 'react';
import { Cascader, Form } from 'antd';
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';
import { queryRule } from '@/pages/category/service';

interface LazyOptionsProps {
  label?: string;
  name?: string;
  placeholder?: string;
  options: CascaderOptionType[];
}

export default class LazyOption extends React.Component<LazyOptionsProps> {
  state = {
    options: this.props.options,
  };

  onChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => {
    // console.log(value, selectedOptions);
  };

  loadData = async (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions === undefined) {
      return;
    }

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      const { data } = await queryRule({ group: targetOption.value as 1 | 2 | 3 });
      targetOption.loading = false;

      data.forEach((element: CascaderOptionType) => {
        element.label = element.name;
        element.value = element.id;
      });

      targetOption.children = data;
      this.setState({
        options: [...this.state.options],
      });
    } catch (error) {
      targetOption.loading = false;
    }
  };

  render() {
    return (
      <Form.Item name={this.props.name} label={this.props.label}>
        <Cascader
          placeholder={this.props.placeholder}
          options={this.state.options}
          loadData={this.loadData}
          onChange={this.onChange}
          changeOnSelect
        />
      </Form.Item>
    );
  }
}
