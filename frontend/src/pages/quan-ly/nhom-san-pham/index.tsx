import { ParamsSearch } from '@/types/response-request';
import React, { useEffect, useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@/configs/seo.config';
import { Button, Col, Flex, Form, Modal, Pagination, Row, Space, Table, Typography } from 'antd';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { debounce } from 'lodash';
import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import { confirmAction, getDate } from '@/utils/helper';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import {
  productGroupStore,
  ResponseProductGroup,
  TypeProductGroup,
} from '@/stores/productgroup.store';
import { brandStore, TypeBrand } from '@/stores/brand.store';

const Index = () => {
  const { getProductGroup, loading, data, totalCount, create, update, remove } =
    productGroupStore();
  const { data: brands, getBrand } = brandStore();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState<ParamsSearch>({
    page: 1,
    take: 10,
    keySearch: '',
    sortOrder: 'ASC',
  });
  const [objModal, setObjModal] = useState({
    type: '',
    idProductGroup: '',
    open: false,
  });
  useEffect(() => {
    getProductGroup(search);
  }, [search]);

  useEffect(() => {
    getBrand({
      page: 1,
      take: 100,
      keySearch: '',
    });
  }, []);

  const onChange = debounce((e) => {
    setSearch((prev) => ({
      ...prev,
      keySearch: e.target.value,
    }));
  }, 300);

  const addProductGroup = () => {
    setObjModal((prev) => ({
      ...prev,
      idProductGroup: '',
      type: 'add',
      open: true,
    }));
  };

  const editProductGroup = (record: ResponseProductGroup) => {
    setObjModal((prev) => ({
      ...prev,
      type: 'edit',
      open: true,
      idProductGroup: record.id,
    }));
    formRef.setFieldsValue({
      name: record.name,
      brandIds: record?.brands?.map((item: TypeBrand) => item?.id),
    });
  };

  const onCancel = () => {
    setObjModal((prev) => ({
      ...prev,
      type: '',
      open: false,
    }));
    formRef.resetFields();
  };

  const onRemove = (id: string) => {
    confirmAction({
      title: 'Bạn có chắc chắn muốn xóa nhóm sản phẩm này không?',
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

  const columns: TableProps<ResponseProductGroup>['columns'] = [
    {
      key: 'date',
      title: 'Ngày tạo',
      width: 300,
      render: (record) => getDate(record?.createdAt),
    },
    {
      key: 'name',
      title: 'Tên nhóm sản phẩm',
      render: (record) => record?.name,
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
            onClick={() => editProductGroup(record)}
          />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onRemove(record?.id)}
          />
        </Space>
      ),
    },
  ];

  const onFinish = (values: TypeProductGroup) => {
    if (objModal.type === 'add') {
      create(values, () => {
        setObjModal({
          type: '',
          open: false,
          idProductGroup: '',
        });
        formRef.setFieldsValue({ name: '' });
        getProductGroup(search);
      });
    }
    if (objModal.type === 'edit') {
      update({ name: values.name, brandIds: values.brandIds, id: objModal.idProductGroup }, () => {
        setObjModal({
          type: '',
          open: false,
          idProductGroup: '',
        });
        formRef.setFieldsValue({ name: '' });
        getProductGroup(search);
      });
    }
  };

  const onChangePage = (page: number) => {
    setSearch((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <>
      <DefaultSeo {...SEO} title="Danh sách nhóm sản phẩm" />
      <Form>
        <Row>
          <Col span={24}>
            <Flex justify="space-between">
              <Typography.Title>Danh sách nhóm sản phẩm</Typography.Title>
              <ButtonCustom type="default" className="text-[#fff]" onClick={addProductGroup}>
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
              onChange={onChange}
            />
          </Col>
          <Col span={24}>
            <Table
              dataSource={data}
              loading={{ spinning: loading && !objModal.open, size: 'large' }}
              columns={columns}
              pagination={false}
              rowKey={(record) => record?.id as string}
              footer={() => [
                <Pagination
                  key="getProductGroup"
                  current={search.page}
                  showSizeChanger
                  pageSize={search.take}
                  pageSizeOptions={[5, 10, 20, 30, 50]}
                  onChange={onChangePage}
                  total={totalCount}
                  className="flex flex-row justify-end"
                  hideOnSinglePage={totalCount <= 0}
                />,
              ]}
            />
          </Col>
        </Row>
      </Form>
      <Modal
        title={`${objModal.type === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} nhóm sản phẩm`}
        open={objModal.open}
        width={500}
        onCancel={onCancel}
        footer={null}
      >
        <Form form={formRef} onFinish={onFinish} layout="vertical">
          <FormItem
            name="name"
            label="Tên nhóm sản phẩm"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY]}
            placeholder="Nhập tên nhóm sản phẩm"
          />
          <FormItem
            name="brandIds"
            label="Loại sản phẩm"
            type={variables.SELECT}
            mode="multiple"
            size="middle"
            rules={[variables.RULES.EMPTY]}
            placeholder="Chọn thương hiệu"
            data={brands.map((item) => ({ ...item, value: item.id, label: item.name }))}
          />
          <ButtonCustom
            type="primary"
            htmlType="submit"
            loading={loading}
          >{`${objModal.type === 'add' ? 'Thêm mới' : 'Cập nhật'}`}</ButtonCustom>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
// export default withAuth(Index);
