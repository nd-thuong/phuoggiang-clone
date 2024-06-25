import React, { useEffect, useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@/configs/seo.config';
import { Button, Col, Flex, Form, Pagination, Row, Space, Table, Typography } from 'antd';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { debounce } from 'lodash';
import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import { confirmAction, getDate } from '@/utils/helper';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { PramsSearchProduct, productStore, ResponseProduct } from '@/stores/product.store';
import { productTypeStore } from '@/stores/product-type.store';
import { brandStore } from '@/stores/brand.store';
import { productGroupStore } from '@/stores/productgroup.store';

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { getProduct, loading, data, totalCount, create, update, remove } = productStore();
  const { getProductType, data: productTypes } = productTypeStore();
  const { getBrand, data: brands } = brandStore();
  const { getProductGroup, data: productGroups } = productGroupStore();
  const [search, setSearch] = useState<PramsSearchProduct>({
    page: 1,
    take: 10,
    keySearch: '',
    sortOrder: 'ASC',
    sizeId: null,
    surfaceId: null,
    productGroupId: null,
    productTypeId: null,
    brandId: null,
    unitId: null,
    fromDate: null,
    toDate: null,
  });
  useEffect(() => {
    getProduct(search);
  }, [search]);

  useAsyncEffect(async () => {
    await getBrand({ page: 1, take: 50 });
    await getProductGroup({ page: 1, take: 50 });
    await getProductType({ page: 1, take: 50 });
  }, []);

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

  const onRemove = (id: string) => {
    confirmAction({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      cb: () => {
        remove(id, () => {
          setSearch((prev) => ({
            ...prev,
            keySearch: '',
            page: 1,
          }));
        });
      },
    });
  };

  const columns: TableProps<ResponseProduct>['columns'] = [
    {
      key: 'date',
      title: 'Ngày tạo',
      width: 100,
      render: (record) => getDate(record?.createdAt),
    },
    {
      key: 'name',
      title: 'Tên sản phẩm',
      render: (record) => record?.name,
      width: 200,
    },
    {
      key: 'brand',
      title: 'Thương hiệu',
      render: (record) => record?.name,
      width: 200,
    },
    {
      key: 'type',
      title: 'Loại sản phẩm',
      render: (record) => record?.productType?.name,
      width: 200,
    },
    {
      key: 'group',
      title: 'Nhóm sản phẩm',
      render: (record) => record?.productGroup?.name,
      width: 200,
    },
    {
      key: 'action',
      title: '',
      width: 100,
      render: (record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => router.push(`${pathname}/chi-tiet/${record.id}`)}
          />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onRemove(record.id)}
          />
        </Space>
      ),
    },
  ];

  const onChangePage = (page: number) => {
    setSearch((prev) => ({
      ...prev,
      page,
    }));
  };

  const onChangeDate = (dates: string[]) => {
    setSearch((prev) => ({
      ...prev,
      fromDate: getDate(dates[0]),
      toDate: getDate(dates[1]),
    }));
  };

  return (
    <>
      <DefaultSeo {...SEO} title="Danh sách sản phẩm" />
      <Form>
        <Row gutter={15}>
          <Col span={24}>
            <Flex justify="space-between">
              <Typography.Title>Danh sách sản phẩm</Typography.Title>
              <ButtonCustom
                type="default"
                className="text-[#fff]"
                onClick={() => router.push(`${pathname}/them-moi`)}
              >
                Thêm mới
              </ButtonCustom>
            </Flex>
          </Col>
          <Col span={4}>
            <FormItem
              name=""
              label=""
              type={variables.INPUT_SEARCH}
              value={search.keySearch}
              placeholder="Nhập tìm kiếm"
              onChange={(value) => onChange(value, 'keySearch')}
            />
          </Col>
          <Col span={5}>
            <FormItem
              name="brand"
              label=""
              type={variables.SELECT}
              value={search.brandId}
              placeholder="Chọn thương hiệu"
              onChange={(value) => onChange(value, 'brandId')}
              data={brands.map((item) => ({ value: item.id, label: item.name }))}
              allowClear
            />
          </Col>
          <Col span={5}>
            <FormItem
              name="type"
              label=""
              type={variables.SELECT}
              value={search.productTypeId}
              placeholder="Chọn loại sản phẩm"
              onChange={(value) => onChange(value, 'productTypeId')}
              data={productTypes.map((item) => ({ value: item.id, label: item.name }))}
              allowClear
            />
          </Col>
          <Col span={5}>
            <FormItem
              name="group"
              label=""
              type={variables.SELECT}
              value={search.productGroupId}
              placeholder="Chọn nhóm sản phẩm"
              data={productGroups.map((item) => ({ value: item.id, label: item.name }))}
              onChange={(value) => onChange(value, 'productGroupId')}
              allowClear
            />
          </Col>
          <Col span={5}>
            <FormItem
              name="date"
              label=""
              type={variables.RANGE_PICKER}
              // value={search.keySearch}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={onChangeDate}
              picker="date"
            />
          </Col>
          <Col span={24}>
            <Table
              dataSource={data}
              loading={{ spinning: loading }}
              columns={columns}
              pagination={false}
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
// export default withAuth(Index);
