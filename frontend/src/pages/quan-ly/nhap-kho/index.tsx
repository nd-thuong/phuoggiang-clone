import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import { SEO } from '@/configs/seo.config';
import { inventoryStore, PramsSearchInventory } from '@/stores/inventories.store';
import { getDate } from '@/utils/helper';
import { variables } from '@/utils/variables';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, Flex, Form, Pagination, Row, Table, Typography } from 'antd';
import type { TableProps } from 'antd/es/table';
import { debounce } from 'lodash';
import { DefaultSeo } from 'next-seo';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, loading, totalCount, getInventory } = inventoryStore();
  const [search, setSearch] = useState<PramsSearchInventory>({
    page: 1,
    take: 10,
    keySearch: '',
    sortOrder: 'DESC',
    fromDate: null,
    toDate: null,
  });

  useEffect(() => {
    getInventory(search);
  }, [search]);

  const columns: TableProps['columns'] = [
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 110,
      className: 'min-w-[110px]',
      render: (record) => getDate(record?.createdAt, variables.DATE_FORMAT.DATE_TIME),
    },
    {
      key: 'updatedAt',
      title: 'Ngày cập nhật',
      width: 120,
      className: 'min-w-[120px]',
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
      title: 'Đơn vị',
      width: 100,
      className: 'min-w-[100px]',
      render: (record) => record?.unit?.name,
    },
    {
      key: 'currentStock',
      title: 'Số lượng Nhập',
      width: 140,
      className: 'min-w-[140px]',
      render: (record) => record?.quantity,
    },
    {
      key: 'action',
      title: '',
      width: 80,
      className: 'min-w-[80px]',
      render: (record) => (
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={() => router.push(`${pathname}/${record?.id}`)}
        />
      ),
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
      <DefaultSeo {...SEO} title="Sản phẩm nhập kho" />
      <Form>
        <Row>
          <Col span={24}>
            <Flex justify="space-between">
              <Typography.Title>Sản phẩm nhập kho</Typography.Title>
              <ButtonCustom
                type="primary"
                icon={<PlusCircleFilled />}
                onClick={() => router.push(`${pathname}/them-moi`)}
              >
                Thêm mới
              </ButtonCustom>
            </Flex>
          </Col>
          <Col span={24}>
            <Row gutter={20}>
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
              <Col>
                <FormItem
                  name="date"
                  label=""
                  type={variables.RANGE_PICKER}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={onChangeDate}
                  picker="date"
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              dataSource={data}
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
                  hideOnSinglePage={totalCount <= 0}
                  pageSize={search.take}
                  pageSizeOptions={[5, 10, 20, 30, 50]}
                  onChange={onChangePage}
                  total={totalCount}
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
