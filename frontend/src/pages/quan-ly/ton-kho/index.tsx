import FormItem from '@/components/CommonComponent/FormItem';
import { SEO } from '@/configs/seo.config';
import { inventoryStore, PramsSearchInventory } from '@/stores/inventories.store';
import { getDate } from '@/utils/helper';
import { variables } from '@/utils/variables';
import { Col, Form, Pagination, Row, Table, Typography } from 'antd';
import { debounce } from 'lodash';
import { DefaultSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd/es/table';

const Index = () => {
  const { dataInventoryEntry, totalCountInventoryEntry, loading, getInventoryEntry } =
    inventoryStore();
  const [search, setSearch] = useState<PramsSearchInventory>({
    page: 1,
    take: 10,
    keySearch: '',
    sortOrder: 'DESC',
    fromDate: null,
    toDate: null,
  });

  useEffect(() => {
    getInventoryEntry(search);
  }, [search]);

  const columns: TableProps['columns'] = [
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 150,
      className: 'min-w-[110px]',
      render: (record) => getDate(record?.createdAt, variables.DATE_FORMAT.DATE_TIME),
    },
    {
      key: 'updatedAt',
      title: 'Ngày cập nhật',
      width: 150,
      className: 'min-w-[110px]',
      render: (record) => getDate(record?.updatedAt, variables.DATE_FORMAT.DATE_TIME),
    },
    {
      key: 'product',
      title: 'Sản phẩm',
      width: 180,
      className: 'min-w-[180px]',
      render: (record) => record?.product?.name,
    },
    {
      key: 'unit',
      title: 'Số lượng tồn kho',
      width: 200,
      className: 'min-w-[100px]',
      render: (record) => `${record?.quantity} ${record?.unitInventory?.name}`,
    },
    {
      key: 'unitConversion',
      title: 'Số lượng tồn kho quy đổi',
      width: 200,
      className: 'min-w-[100px]',
      render: (record) => `${record?.conversionQuantity} ${record?.unitConversion?.name}`,
    },
  ];

  const onChangePage = (page: number, pageSize: number) => {
    setSearch((prev) => ({
      ...prev,
      page,
      take: pageSize,
    }));
  };

  const onChangeDate = (dates: string[]) => {
    setSearch((prev) => ({
      ...prev,
      fromDate: getDate(dates[0]),
      toDate: getDate(dates[1]),
    }));
  };

  const onChange = debounce((e, key) => {
    if (key === 'keySearch') {
      setSearch((prev) => ({
        ...prev,
        keySearch: e.target.value,
      }));
    } else {
      setSearch((prev) => ({
        ...prev,
        [key]: e,
      }));
    }
  }, 300);

  return (
    <>
      <DefaultSeo {...SEO} title="Tồn kho" />
      <Form>
        <Row gutter={20}>
          <Col span={24} className="mb-3">
            <Typography.Title>Hàng tồn kho</Typography.Title>
          </Col>
          <Col span={8}>
            <FormItem
              name=""
              label=""
              type={variables.INPUT_SEARCH}
              value={search.keySearch}
              placeholder="Nhập tên sản phẩm"
              onChange={(value) => onChange(value, 'keySearch')}
            />
          </Col>
          <Col span={6}>
            <FormItem
              name="date"
              label=""
              type={variables.RANGE_PICKER}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={onChangeDate}
              picker="date"
            />
          </Col>
          <Col span={24}>
            <Table
              dataSource={dataInventoryEntry}
              loading={{ spinning: loading }}
              columns={columns}
              pagination={false}
              rowKey={(record) => record.id}
              bordered
              scroll={{ x: true }}
              footer={() => [
                <Pagination
                  key="getProduct"
                  current={search?.page}
                  showSizeChanger
                  hideOnSinglePage={totalCountInventoryEntry <= 0}
                  pageSize={search.take}
                  pageSizeOptions={[5, 10, 20, 30, 50]}
                  onChange={onChangePage}
                  total={totalCountInventoryEntry}
                  className="flex flex-row justify-end"
                />,
              ]}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Index;
