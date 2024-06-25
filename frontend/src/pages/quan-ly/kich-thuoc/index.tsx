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
import { sizeStore, TypeSize } from '@/stores/size.store';

const Index = () => {
  const { getSize, loading, data, totalCount, create, update, remove } = sizeStore();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState<ParamsSearch>({
    page: 1,
    take: 10,
    keySearch: '',
    sortOrder: 'ASC',
  });
  const [objModal, setObjModal] = useState({
    type: '',
    idSize: '',
    open: false,
  });
  useEffect(() => {
    getSize(search);
  }, [search]);

  const onChange = debounce((e) => {
    setSearch((prev) => ({
      ...prev,
      keySearch: e.target.value,
    }));
  }, 300);

  const addSize = () => {
    setObjModal((prev) => ({
      ...prev,
      idSize: '',
      type: 'add',
      open: true,
    }));
  };

  const editSize = (record: TypeSize) => {
    setObjModal((prev) => ({
      ...prev,
      type: 'edit',
      open: true,
      idSize: record.id,
    }));
    formRef.setFieldsValue({ name: record.name });
  };

  const onCancel = () => {
    setObjModal((prev) => ({
      ...prev,
      type: '',
      open: false,
    }));
    formRef.setFieldsValue({ name: '' });
  };

  const onRemove = (id: string) => {
    confirmAction({
      title: 'Bạn có chắc chắn muốn xóa kích thước này không?',
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

  const columns: TableProps<TypeSize>['columns'] = [
    {
      key: 'date',
      title: 'Ngày tạo',
      width: 300,
      render: (record) => getDate(record?.createdAt),
    },
    {
      key: 'name',
      title: 'Tên kích thước',
      render: (record) => record?.name,
    },
    {
      key: 'action',
      title: '',
      width: 100,
      render: (record) => (
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => editSize(record)} />
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

  const onFinish = (values: TypeSize) => {
    if (objModal.type === 'add') {
      create(values.name, () => {
        setObjModal({
          type: '',
          open: false,
          idSize: '',
        });
        formRef.setFieldsValue({ name: '' });
        getSize(search);
      });
    }
    if (objModal.type === 'edit') {
      update({ name: values.name, id: objModal.idSize }, () => {
        setObjModal({
          type: '',
          open: false,
          idSize: '',
        });
        formRef.setFieldsValue({ name: '' });
        getSize(search);
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
      <DefaultSeo {...SEO} title="Danh sách kích thước" />
      <Form>
        <Row>
          <Col span={24}>
            <Flex justify="space-between">
              <Typography.Title>Danh sách kích thước</Typography.Title>
              <ButtonCustom type="default" className="text-[#fff]" onClick={addSize}>
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
              footer={() => [
                <Pagination
                  key="getSize"
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
        title={`${objModal.type === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} kích thước`}
        open={objModal.open}
        width={500}
        onCancel={onCancel}
        footer={null}
      >
        <Form form={formRef} onFinish={onFinish}>
          <FormItem
            name="name"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY]}
            placeholder="Nhập tên kích thước"
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
