import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import FormItem from '@/components/CommonComponent/FormItem';
import {
  inventoryStore,
  TypeCreateInventory,
  TypeResponseInventory,
} from '@/stores/inventories.store';
import { productStore } from '@/stores/product.store';
import { unitStore } from '@/stores/unit.store';
import { getDate } from '@/utils/helper';
import { variables } from '@/utils/variables';
import { Col, Form, Row, Table, Typography } from 'antd';
import type { TableProps } from 'antd/es/table';
import { isEmpty } from 'lodash';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const FormInventory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [form] = Form.useForm();
  const { loading, create, update, getInventory, detail, getDetail, resetDetail } =
    inventoryStore();
  const { getProduct, getDetailProduct, detail: detailProduct, data: products } = productStore();
  const { getUnit, data: units } = unitStore();
  const [formRef] = Form.useForm();
  const [productInventory, setProductInventory] = useState<TypeResponseInventory[]>([]);

  useEffect(() => {
    getProduct({
      page: 1,
      take: 50,
      sortOrder: 'DESC',
      productTypeId: null,
      sizeId: null,
      surfaceId: null,
      brandId: null,
      unitId: null,
      productGroupId: null,
    });
    getUnit({
      page: 1,
      take: 50,
    });
  }, []);

  useEffect(() => {
    if (params?.id) {
      getDetail(params?.id as string, (response) => {
        if (response) {
          formRef.setFieldsValue(response);
        }
      });
    }
    return () => {
      if (!isEmpty(detail)) {
        resetDetail();
      }
    };
  }, [params?.id]);

  const onChangeProduct = (id: string) => {
    getInventory(
      {
        page: 1,
        take: 10,
        productId: id,
        sortOrder: 'DESC',
      },
      (response) => {
        setProductInventory(response);
      }
    );

    getDetailProduct(id);
  };

  const columns: TableProps['columns'] = [
    {
      title: 'STT',
      key: '',
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: 'Ngày nhập kho',
      key: 'date',
      render: (record) => getDate(record?.createdAt, variables.DATE_FORMAT.DATE_TIME),
      width: 150,
    },
    {
      title: 'Số lượng nhập',
      key: 'current',
      render: (record) => record?.quantity,
      width: 200,
    },
    {
      title: 'Đơn vị',
      key: '',
      render: (record) => record?.unit?.name,
      width: 50,
    },
  ];

  const onFinish = (values: TypeCreateInventory) => {
    if (params?.id) {
      update({ ...values, id: params?.id as string }, () => {
        router.back();
      });
    } else {
      create(values, () => {
        router.back();
      });
    }
  };

  return (
    <>
      <Form layout="vertical" form={formRef} onFinish={onFinish}>
        <Row gutter={20} className="bg-white py-2">
          <Col span={24} className="mb-5">
            <Typography.Title level={2}>Thêm sản phẩm vào kho</Typography.Title>
          </Col>
          <Col span={24}>
            <FormItem
              label="Sản phẩm nhập kho"
              type={variables.SELECT}
              name="productId"
              data={products.map((el) => ({ value: el.id as string, label: el.name as string }))}
              onChange={onChangeProduct}
              rules={[variables.RULES.EMPTY]}
            />
          </Col>
          {productInventory.length ? (
            <Col span={24} className="mb-2">
              <Typography.Text className="mb-1">Các lần nhập kho trước</Typography.Text>
              <Table
                dataSource={productInventory}
                loading={{ spinning: loading }}
                columns={columns}
                pagination={false}
                rowKey={(record) => record?.id}
                bordered
                scroll={{ x: true }}
              />
            </Col>
          ) : (
            <></>
          )}
          {!params?.id ? (
            <>
              <Col span={12}>
                <FormItem
                  name="quantity"
                  label="Số lượng nhập"
                  type={variables.INPUT_NUMBER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
              <Col span={12}>
                <FormItem
                  label="Đơn vị nhập"
                  type={variables.SELECT}
                  name="unitId"
                  data={units.map((el) => ({ value: el.id as string, label: el.name as string }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
            </>
          ) : (
            <>
              <Col span={8}>
                <FormItem
                  name="quantity"
                  label="Số lượng đã nhập"
                  type={variables.INPUT_NUMBER}
                  rules={[variables.RULES.EMPTY]}
                  disabled
                />
              </Col>
              <Col span={8}>
                <FormItem
                  name="quantityEdit"
                  label="Số lượng chỉnh sửa"
                  type={variables.INPUT_NUMBER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
              <Col span={8}>
                <FormItem
                  label="Đơn vị nhập"
                  type={variables.SELECT}
                  name="unitId"
                  data={units.map((el) => ({ value: el.id as string, label: el.name as string }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </Col>
            </>
          )}
          <Col span={24}>
            <FormItem
              name="note"
              label="Ghi chú"
              type={variables.TEXTAREA}
              // rules={[variables.RULES.EMPTY]}
            />
          </Col>
          <Col span={24}>
            <ButtonCustom type="primary" htmlType="submit" loading={loading}>
              {params?.id ? 'Cập nhật' : 'Thêm mới'}
            </ButtonCustom>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormInventory;
