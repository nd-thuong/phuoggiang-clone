import { Select } from 'antd';
import { RenderChildrenProps } from '../type-props-form';

export const FormSelect: React.FC<RenderChildrenProps> = ({
  options,
  optionClassName,
  allowClear,
  onChange,
  value,
  disabled,
  popupClassName,
  autoFocus = false,
  maxCount,
  mode,
  open,
  placement,
  searchValue,
  size = 'small',
  suffixIcon,
  loading,
  filterOption = true,
  showSearch = false,
  placeholder,
}) => (
  <Select
    onChange={onChange}
    popupClassName={popupClassName}
    loading={loading}
    allowClear={allowClear}
    value={value}
    disabled={disabled}
    autoFocus={autoFocus}
    maxCount={maxCount}
    mode={mode}
    open={open}
    placement={placement}
    searchValue={searchValue}
    size={size}
    suffixIcon={suffixIcon}
    filterOption={filterOption}
    showSearch={showSearch}
    placeholder={placeholder}
  >
    {options?.map((item) => (
      <Select.Option value={item.value} key={item.value} clasName={optionClassName}>
        {item.label}
      </Select.Option>
    ))}
  </Select>
);
