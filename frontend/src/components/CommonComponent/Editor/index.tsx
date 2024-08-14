'use client';

import React, { useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { UploadBeforeHandler, UploadBeforeReturn } from 'suneditor-react/dist/types/upload';
import 'suneditor/dist/css/suneditor.min.css';
import './style.scss';
import { colorList, toolbar } from './toolbar';
import { uploadStore } from '@/stores/upload.store';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

type Props = {
  contentEditor: string;
  onChangeContentEditor?: (newContent: string) => void;
};

const defaultFonts = [
  'Arial',
  'Comic Sans MS',
  'Courier New',
  'Impact',
  'Georgia',
  'Tahoma',
  'Trebuchet MS',
  'Verdana',
];

const sortedFontOptions = [
  'Logical',
  'Salesforce Sans',
  'Garamond',
  'Sans-Serif',
  'Serif',
  'Times New Roman',
  'Helvetica',
  'Montserrat',
  ...defaultFonts,
].sort();

function Editor({ contentEditor, onChangeContentEditor }: Props) {
  const { uploadSingleLocal } = uploadStore();

  useEffect(() => {
    const handleButtonClick = () => {
      document.body.style.overflow = 'hidden';
    };

    const button = document.querySelector('.se-btn');
    button?.addEventListener('click', handleButtonClick);

    return () => {
      button?.removeEventListener('click', handleButtonClick);
    };
  }, []);

  const handleImageUploadBefore = (
    files: File[],
    _: object,
    uploadHandler: UploadBeforeHandler
  ): UploadBeforeReturn => {
    let result: UploadBeforeReturn | any;

    (async () => {
      try {
        uploadSingleLocal(files[0], (res, err) => {
          if (res) {
            result = [
              {
                url: `${process.env.NEXT_PUBLIC_URL_FILE}/${res.filename}`,
                name: res.originalname,
                size: 100,
              },
            ];
            uploadHandler({ result });
          }
          if (err) {
            uploadHandler({
              errorMessage: 'Error uploading image',
              result: [],
            });
          }
        });
      } catch (error) {
        uploadHandler({
          errorMessage: 'Error uploading image',
          result: [],
        });
      }
    })();

    return result;
  };

  const toggleFullScreen = (isFullScreen: boolean) => {
    // console.log(isFullScreen);
  };

  const handleOnChangeContent = useCallback(
    (cleanData: string) => {
      if (onChangeContentEditor) {
        onChangeContentEditor(cleanData);
      }
    },
    [onChangeContentEditor]
  );

  return (
    <SunEditor
      name="content"
      setContents={contentEditor || ''}
      onChange={handleOnChangeContent}
      setOptions={{
        height: '500',
        buttonList: toolbar,
        defaultTag: 'div',
        showPathLabel: false,
        font: sortedFontOptions,
        colorList,
      }}
      onImageUploadBefore={handleImageUploadBefore}
      // onVideoUploadBefore={() => {}}
      toggleFullScreen={toggleFullScreen}
      onPaste={(_, cleanData) => {
        handleOnChangeContent(cleanData);
      }}
    />
  );
}

export default Editor;
