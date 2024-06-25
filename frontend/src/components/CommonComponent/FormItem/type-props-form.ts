import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export interface OptionSelect {
  value: string;
  label: string;
}

interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}

type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;
type PanelMode = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade';
type DisabledDate<DateType = any> = (
  date: DateType,
  info: {
    type: PanelMode;
    /**
     * Only work in RangePicker.
     * Tell the first date user selected on this range selection.
     * This is not care about what field user click.
     */
    from?: DateType;
  }
) => boolean;
type PickerMode = Exclude<PanelMode, 'datetime' | 'decade'>;
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  disabledMilliseconds?: (
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number
  ) => number[];
};

export interface RenderChildrenProps {
  placeholder?: string | string[];
  data?: OptionSelect[];
  handleScroll?: () => void;
  onChange?: (value: any) => void;
  disabled?: boolean;
  disabledDate?: DisabledDate;
  fieldNames?: FieldNames;
  maxTagCount?: number;
  onSearch?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  onSelect?: () => void;
  allowClear?: boolean;
  picker?: PickerMode;
  radioInline?: boolean;
  disabledKeys?: any[];
  options?: any[];
  checked?: boolean;
  value?: any;
  notFoundContent?: string;
  disabledOptions?: any[];
  bordered?: boolean;
  showCount?: boolean;
  minNumber?: number;
  onFocus?: () => void;
  onKeyUp?: () => void;
  prefix?: string;
  format?: string;
  suffix?: string;
  loading?: boolean;
  showToday?: boolean;
  className?: string;
  popupClassName?: string;
  maxCount?: number;
  mode?: 'multiple' | 'tags';
  open?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  searchValue?: string;
  size?: 'large' | 'middle' | 'small';
  suffixIcon?: ReactNode;
  autoFocus?: boolean;
  optionClassName?: string;
  filterOption?: boolean | FilterFunc<OptionSelect>;
  showSearch?: boolean;
  disabledTime?: DisabledTime;
  minuteStep?: number;
}

export interface FormItemProps extends RenderChildrenProps {
  name: string;
  type: string;
  label?: string;
  rules?: Rule[];
  defaultValue?: string;
}
