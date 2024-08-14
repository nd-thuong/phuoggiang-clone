import { SEO } from '@/configs/seo.config';
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Spin,
  Switch,
  Table,
  TableProps,
  Upload,
  UploadProps,
} from 'antd';
import { DefaultSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import { productTypeStore } from '@/stores/product-type.store';
import { brandStore } from '@/stores/brand.store';
import { productGroupStore } from '@/stores/productgroup.store';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { TypeFile, uploadStore } from '@/stores/upload.store';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { unitStore } from '@/stores/unit.store';
import { sizeStore } from '@/stores/size.store';
import { surfaceStore } from '@/stores/surface.store';
import csx from 'classnames';
import { ButtonCustom } from '@/components/CommonComponent/Button/ButtonCustom';
import Editor from '@/components/CommonComponent/Editor';
import { productStore, TypeCreateProduct, TypeValueUnitConversion } from '@/stores/product.store';
import { FormSelect } from '@/components/CommonComponent/FormItem/Select';
import { v4 as uuidV4 } from 'uuid';
import { useRouter } from 'next/navigation';

const Index = () => {
  const router = useRouter();
  const { loading, create } = productStore();
  const { getProductType, data: productTypes } = productTypeStore();
  const { getBrand, data: brands } = brandStore();
  const { getProductGroup, data: productGroups } = productGroupStore();
  const { uploadSingleLocal, removeFileLocal, uploadSingleCloudinary, removeFileCloudinary } =
    uploadStore();
  const { getUnit, data: units } = unitStore();
  const { getSize, data: sizes } = sizeStore();
  const { getSurface, data: surfaces } = surfaceStore();
  const [formRef] = Form.useForm();
  const [listImageResult, setListImageResult] = useState<TypeFile[]>([]);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();
  const [boolSwitch, setSwitch] = useState({
    inStock: false,
    showHomepage: false,
    isBestSeller: false,
    isNew: false,
  });
  const [unitConversions, setUnitConversions] = useState<TypeValueUnitConversion[]>([]);

  useEffect(() => {
    getBrand({ page: 1, take: 50 });
    getProductGroup({ page: 1, take: 50 });
    getProductType({ page: 1, take: 50 });
    getUnit({ page: 1, take: 50 });
    getSize({ page: 1, take: 50 });
    getSurface({ page: 1, take: 50 });
  }, []);

  const onUpload = (file: File) => {
    setLoadingUpload(true);
    // uploadSingleCloudinary(file as File, (response, err) => {
    //   if (response) {
    //     setListImageResult((prev) => [...prev, { ...response, url: response.path }]);
    //     setLoadingUpload(false);
    //   }
    //   if (err) {
    //     setLoadingUpload(false);
    //   }
    // });

    uploadSingleLocal(file as File, (response, err) => {
      if (response) {
        setListImageResult((prev) => [
          ...prev,
          { ...response, url: `${process.env.NEXT_PUBLIC_URL_FILE}/${response.filename}` },
        ]);
        setLoadingUpload(false);
      }
      if (err) {
        setLoadingUpload(false);
      }
    });
  };

  const propsListUploadImage: UploadProps = {
    accept: 'image/*',
    maxCount: 3,
    multiple: true,
    listType: 'picture-card',
    beforeUpload(file) {
      onUpload(file);
    },
    onRemove: (file: any) => {
      removeFileLocal(file.filename, file.id);
      setListImageResult(listImageResult.filter((el: TypeFile) => el.id !== file.id));

      // removeFileCloudinary(file.filename as string, file.id as string);
      // setListImageResult(listImageResult.filter((el: TypeFile) => el.id !== file.id));
    },
    showUploadList: true,
    fileList: listImageResult.map(({ size, ...el }) => ({
      ...el,
      uid: el.id,
      name: el.originalname,
    })),
  };

  const onChangeSwitch = (value: boolean, key: string) => {
    setSwitch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEditor = (content: string) => {
    setDescription(content);
    if (content === '<p><br></p>') {
      formRef.setFieldValue('description_vi', '');
    } else {
      formRef.setFieldValue('description_vi', content);
    }
  };

  const onAdd = () => {
    setUnitConversions((prev) => [
      ...prev,
      {
        idx: uuidV4(),
        conversionRate: null,
        retailPrice: null,
        wholesalePrice: null,
        unitId: null,
      },
    ]);
  };

  const onRemove = (id: string) => {
    setUnitConversions((prev) =>
      prev.filter((record) => {
        const recordId = record.id || record.idx;
        return recordId !== id;
      })
    );
  };

  const onChangeUnitConversion = (id: string, key: string, value: string | number) => {
    setUnitConversions((prev) =>
      prev.map((el) => {
        const recordId = el.id || el.idx;
        if (recordId === id) {
          return { ...el, [key]: value };
        }
        return el;
      })
    );
  };

  const columns: TableProps['columns'] = [
    {
      key: 'unitId',
      title: 'Đvt quy đổi',
      render: (record) => (
        <FormSelect
          options={units.map((el) => ({ value: el.id, label: el.name }))}
          value={record?.unitId}
          className="w-full"
          size="middle"
          onChange={(value) => onChangeUnitConversion(record?.id || record?.idx, 'unitId', value)}
        />
      ),
      width: 300,
    },
    {
      key: 'rate',
      title: 'Tỉ lệ quy đổi',
      render: (record) => (
        <InputNumber
          value={record?.conversionRate}
          className="w-full"
          placeholder="Nhập"
          onChange={(value) =>
            onChangeUnitConversion(record?.id || record?.idx, 'conversionRate', value)
          }
        />
      ),
      width: 200,
    },
    {
      key: 'retail',
      title: 'Giá lẻ quy đổi (đ)',
      render: (record) => (
        <InputNumber
          value={record?.retailPrice}
          className="w-full"
          placeholder="Nhập"
          onChange={(value) =>
            onChangeUnitConversion(record?.id || record?.idx, 'retailPrice', value)
          }
        />
      ),
      width: 200,
    },
    {
      key: 'wholesale',
      title: 'Giá sỉ quy đổi (đ)',
      render: (record) => (
        <InputNumber
          value={record?.wholesalePrice}
          className="w-full"
          placeholder="Nhập"
          onChange={(value) =>
            onChangeUnitConversion(record?.id || record?.idx, 'wholesalePrice', value)
          }
        />
      ),
      width: 200,
    },
    {
      key: 'action',
      title: '',
      width: 100,
      render: (record) => (
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          danger
          onClick={() => onRemove(record?.id || record?.idx)}
        />
      ),
    },
  ];

  const onFinish = (values: TypeCreateProduct) => {
    const payload: TypeCreateProduct = {
      ...values,
      images: listImageResult.length
        ? JSON.stringify(
            listImageResult.map((el) => ({ filename: el.filename, id: el.id, url: el.url }))
          )
        : null,
      unitConversions,
      inStock: boolSwitch.inStock,
      isBestSeller: boolSwitch.isBestSeller,
      showHomepage: boolSwitch.showHomepage,
      isNew: boolSwitch.isNew,
      description: description as string,
    };
    create(payload, () => {
      router.push('/quan-ly/san-pham');
    });
  };

  return (
    <>
      <DefaultSeo {...SEO} title="Thêm mới sản phẩm" />
      <Form layout="vertical" form={formRef} onFinish={onFinish}>
        <Row>
          <Col span={24} className="mb-2">
            <h1 className="text-[25px] leading-[40px] font-bold">Thêm sản phẩm</h1>
          </Col>
        </Row>
        <div className="bg-white p-[20px] rounded-[5px]">
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item label="Hình ảnh sản phẩm">
                <Upload {...propsListUploadImage}>
                  <div>
                    {loadingUpload ? <Spin /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={6}>
              <FormItem label="Mã sản phẩm" name="code" type={variables.INPUT} disabled />
            </Col>
            <Col span={6}>
              <FormItem
                label="Tên sản phẩm"
                name="name"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Đơn vị tính chuẩn"
                name="unitId"
                type={variables.SELECT}
                data={units.map((el) => ({ value: el.id, label: el.name }))}
                rules={[variables.RULES.EMPTY]}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Nhóm sản phẩm"
                name="productGroupId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
                data={productGroups.map((el) => ({ value: el.id, label: el.name }))}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Thương hiệu"
                name="brandId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
                data={brands.map((el) => ({ value: el.id, label: el.name }))}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Kích thước"
                name="sizeId"
                type={variables.SELECT}
                // rules={[variables.RULES.EMPTY]}
                data={sizes.map((el) => ({ value: el.id, label: el.name }))}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Bề mặt"
                name="surfaceId"
                type={variables.SELECT}
                // rules={[variables.RULES.EMPTY]}
                data={surfaces.map((el) => ({ value: el.id, label: el.name }))}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Loại sản phẩm"
                name="productTypeId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
                data={productTypes.map((el) => ({ value: el.id, label: el.name }))}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Giá lẻ"
                name="retailPrice"
                type={variables.INPUT_NUMBER}
                rules={[variables.RULES.EMPTY]}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Giá sỉ"
                name="wholesalePrice"
                type={variables.INPUT_NUMBER}
                rules={[variables.RULES.EMPTY]}
              />
            </Col>
            <Col span={6}>
              <FormItem
                label="Thời gian bảo hành (năm)"
                name="warrantyPeriod"
                type={variables.INPUT_NUMBER}
                rules={[variables.RULES.EMPTY]}
              />
            </Col>
            <Col span={6}>
              <FormItem label="Link video sản phẩm" name="videoLink" type={variables.INPUT} />
            </Col>
            <Col span={24}>
              <p className="text-[15px] mb-2">Quy đổi</p>
              <Table
                bordered
                dataSource={unitConversions}
                // loading={{ spinning: loading }}
                columns={columns}
                pagination={false}
                rowKey={(record) => record.id || record.idx}
                footer={() => (
                  <Button type="default" onClick={onAdd} icon={<PlusOutlined />}>
                    Thêm dòng
                  </Button>
                )}
              />
            </Col>
            <Col span={24}>
              <Row gutter={20}>
                <Col span={24} className="mb-3">
                  <p className="text-[18px]">Tùy chọn</p>
                </Col>
                <Col span={6}>
                  <Switch
                    checkedChildren={<span className="text-[13px]">Hiển thị trang chủ</span>}
                    unCheckedChildren={
                      <span className="text-[13px]">Không hiển thị trang chủ</span>
                    }
                    defaultChecked={boolSwitch.showHomepage}
                    size="default"
                    className={csx({ 'bg-slate-500': !boolSwitch.showHomepage })}
                    onChange={(value) => onChangeSwitch(value, 'showHomepage')}
                  />
                </Col>
                <Col span={6}>
                  <Switch
                    checkedChildren={<span className="text-[13px]">Sản phẩm mới</span>}
                    unCheckedChildren={<span className="text-[13px]">Không phải sản phẩm mới</span>}
                    defaultChecked={boolSwitch.isNew}
                    size="default"
                    className={csx({ 'bg-slate-500': !boolSwitch.isNew })}
                    onChange={(value) => onChangeSwitch(value, 'isNew')}
                  />
                </Col>
                <Col span={6}>
                  <Switch
                    checkedChildren={<span className="text-[13px]">Sản phẩm bán chạy</span>}
                    unCheckedChildren={
                      <span className="text-[13px]">Không phải sản phẩm bán chạy</span>
                    }
                    defaultChecked={boolSwitch.isBestSeller}
                    size="default"
                    className={csx({ 'bg-slate-500': !boolSwitch.isBestSeller })}
                    onChange={(value) => onChangeSwitch(value, 'isBestSeller')}
                  />
                </Col>
                <Col span={6}>
                  <Switch
                    checkedChildren={<span className="text-[13px]">Có sản phẩm ở kho</span>}
                    unCheckedChildren={<span className="text-[13px]">Chưa có sản phẩm ở kho</span>}
                    defaultChecked={boolSwitch.inStock}
                    disabled
                    size="default"
                    className={csx({ 'bg-slate-500': !boolSwitch.inStock })}
                    onChange={(value) => onChangeSwitch(value, 'inStock')}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24} className="mt-3">
              <Form.Item name="description" label="Mô tả sản phẩm">
                <Editor
                  contentEditor={description as string}
                  onChangeContentEditor={(value) => handleEditor(value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="pt-[20px]">
          <ButtonCustom htmlType="submit" type="primary" loading={loading}>
            Thêm mới
          </ButtonCustom>
        </div>
      </Form>
    </>
  );
};

export default Index;
