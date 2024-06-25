import {
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
  Typography,
} from 'antd';
import React from 'react';
import { FormItemProps, RenderChildrenProps } from './type-props-form';
import { SearchOutlined } from '@ant-design/icons';
import { FormSelect } from './Select';
import { variables } from '@/utils/variables';
import classNames from 'classnames';
import { isArray, isEmpty } from 'lodash';

// const filter = (inputValue: string, rootVlue: Option[]) =>
//   rootVlue.some(
//     (option) => Helper.slugify(option?.name).indexOf(Helper.slugify(_.trim(inputValue))) > -1,
//   );

const renderChildren = ({
  placeholder = '',
  data = [],
  handleScroll,
  onChange,
  disabled,
  disabledDate,
  fieldNames,
  maxTagCount,
  onSearch,
  onBlur,
  onClear,
  dropdownRender,
  onSelect,
  allowClear,
  picker,
  radioInline,
  disabledKeys,
  options,
  checked,
  value,
  notFoundContent,
  filterOption,
  disabledOptions,
  bordered,
  showCount,
  minNumber,
  onFocus,
  onKeyUp,
  prefix,
  format,
  suffix,
  loading,
  showToday = false,
  showSearch,
  disabledTime,
  minuteStep,
  className,
  size = 'middle',
  mode,
}: RenderChildrenProps) => ({
  input: (
    <Input
      disabled={disabled}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Nhập'}
      value={value}
      onBlur={onBlur}
      suffix={suffix}
      prefix={prefix}
    />
  ),
  inputNumber: (
    <InputNumber
      disabled={disabled}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Nhập'}
      onBlur={onBlur}
      suffix={suffix}
      prefix={prefix}
      min={minNumber}
    />
  ),
  inputPassword: (
    <Input.Password
      onChange={onChange}
      placeholder={(placeholder as string) || 'Nhập'}
      autoComplete="new-password"
    />
  ),
  inputSearch: (
    <Input
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Nhập'}
      prefix={<SearchOutlined />}
    />
  ),
  textArea: (
    <Input.TextArea
      disabled={disabled}
      autoSize={{ minRows: 3, maxRows: 5 }}
      placeholder={(placeholder as string) || 'Nhập'}
      showCount={showCount}
    />
  ),
  select: (
    <FormSelect
      allowClear={allowClear}
      options={data}
      onChange={onChange}
      onSearch={onSearch}
      placeholder={(placeholder as string) || 'Chọn'}
      value={value}
      disabled={disabled}
      onClear={onClear}
      loading={loading}
      filterOption={filterOption}
      size={size}
      mode={mode}
    />
  ),
  cascader: (
    <Cascader
      // fieldNames={fieldNames}
      options={data}
      placeholder={(placeholder as string) || 'Chọn'}
      showSearch={showSearch}
    />
  ),
  rangePicker: (
    <DatePicker.RangePicker
      disabledDate={disabledDate}
      disabled={disabled}
      format={picker === 'year' ? ['YYYY', 'YYYY'] : ['DD/MM/YYYY', 'DD/MM/YYYY']}
      onChange={onChange}
      placeholder={
        picker === 'year'
          ? ['Từ năm', 'Đến năm']
          : [
              isArray(placeholder) ? placeholder[0] : 'dd/mm/yyyy',
              isArray(placeholder) ? placeholder[1] : 'dd/mm/yyyy',
            ]
      }
      value={value}
      allowClear={allowClear}
      picker={picker}
    />
  ),
  datePicker: (
    <DatePicker
      disabled={disabled}
      allowClear={allowClear}
      disabledDate={disabledDate}
      format={format || [variables.DATE_FORMAT.DATE, variables.DATE_FORMAT.DATE_VI]}
      onChange={onChange}
      placeholder={(placeholder as string) || 'ngày/tháng/năm'}
      value={value}
      showToday={showToday}
    />
  ),
  monthYearPicker: (
    <DatePicker
      disabled={disabled}
      allowClear={allowClear}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.MONTH_YEAR}
      onChange={onChange}
      placeholder="tháng/năm"
      value={value}
    />
  ),
  monthPicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format="[Tháng] MM/YYYY"
      onChange={onChange}
      placeholder="Chọn"
      picker="month"
      allowClear={allowClear}
      value={value}
    />
  ),
  yearPicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format="[Năm] YYYY"
      onChange={onChange}
      placeholder="Chọn"
      picker="year"
      allowClear={allowClear}
      value={value}
    />
  ),
  weekPicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format="[Tuần] WW - [Tháng] MM"
      onChange={onChange}
      placeholder="Chọn"
      picker="week"
      allowClear={allowClear}
      value={value}
    />
  ),
  dateTimePicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.DATE_TIME}
      onBlur={onBlur}
      placeholder={(placeholder as string) || 'ngày/tháng/năm'}
      showTime={{ format: 'HH:mm' }}
      value={value}
    />
  ),
  timeRange: (
    <TimePicker.RangePicker
      format={variables.DATE_FORMAT.HOUR}
      onBlur={onBlur}
      placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
      value={value}
    />
  ),
  timePicker: (
    <TimePicker
      format={variables.DATE_FORMAT.HOUR}
      onChange={onChange}
      disabledTime={disabledTime}
      placeholder={(placeholder as string) || 'Chọn'}
      disabled={disabled}
      minuteStep={15}
      value={value}
    />
  ),
  treeSelect: (
    <TreeSelect
      className={classNames('styles.treeSelect', className)}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
      value={value}
    />
  ),
  treeSelectAdd: (
    <TreeSelect
      className={classNames('styles.treeSelect', className)}
      dropdownRender={dropdownRender}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
      value={value}
    />
  ),
  treeSelectSingle: (
    <TreeSelect
      className={className}
      onChange={onChange}
      placeholder={(placeholder as string) || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      treeCheckable={false}
      treeData={data}
      treeDefaultExpandAll
      value={value}
      disabled={disabled}
    />
  ),
  checkbox: (
    <Checkbox.Group onChange={onChange} disabled={disabled}>
      {data.map((item, index) => (
        <Checkbox key={item?.value || index} value={item?.value}>
          {item?.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  ),
  checkboxSingle: (
    <Checkbox
      onChange={onChange}
      checked={checked}
      className={classNames(`styles['checkbox--large]`, className)}
    />
  ),
  checkboxform: (
    <Checkbox
      className={classNames(`styles['checkbox--large']`, className)}
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  ),
  radio: (
    <Radio.Group className="radio-custom" onChange={onChange}>
      {!isEmpty(data) ? (
        data.map((item, index) => (
          <Radio
            key={index}
            value={item?.value}
            className={classNames({
              'd-inline-block': radioInline,
              'my-0': radioInline,
            })}
            disabled={(disabledKeys || []).includes(item?.value)}
          >
            {item?.label}
          </Radio>
        ))
      ) : (
        <Typography.Text className="no-data">Không có dữ liệu</Typography.Text>
      )}
    </Radio.Group>
  ),
  switch: <Switch onChange={onChange} checked={checked} />,
});

const FormItem: React.FC<FormItemProps> = ({ type, label, rules, ...rest }) => {
  const child = renderChildren(rest)[type as keyof typeof renderChildren];
  return (
    <Form.Item {...rest} label={label} rules={rules}>
      {child}
    </Form.Item>
  );
};

export default FormItem;
