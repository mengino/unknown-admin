import React from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextEditorProps {
  name: string;
  value: string;
  onChange: (v: string) => void;
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  ['link', 'image'],
  // [{ font: [] }],
  [{ align: [] }],

  // ['clean'],
];

const handlers = {
  //   image: () => {
  //     console.log(11);
  //     const input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', 'image/*');
  //     input.setAttribute('multiple', 'multiple');
  //     input.click();
  //     const that = this;
  //     input.onchange = async () => {
  //       Array.from(input.files).forEach((item) => {
  //         //业务需求安装了压缩图片的插件，可忽略
  //         // new Compressor(item, {
  //         //   quality: 0.8,
  //         //   convertSize: 1024 * 1024 * 8,
  //         //   success(result) {
  //         //   //很很很很重要的一步
  //         //     const formData = new FormData();
  //         //     formData.append('file', result, result.name);
  //         //     Axios({
  //         //       method: 'post',
  //         //       data: formData,
  //         //       url: config.RES_URL + 'connector?isRelativePath=true'，//图片上传的接口
  //         //     }).then(res => {
  //         //       if (res.data.success) {
  //         //         let quill = that.reactQuillRef.getEditor();//获取到编辑器本身
  //         //         const cursorPosition = quill.getSelection().index;//获取当前光标位置
  //         //         const link = config.RES_URL + res.data.info.url;
  //         //         quill.insertEmbed(cursorPosition, "image", link);//插入图片
  //         //         quill.setSelection(cursorPosition + 1);//光标位置加1
  //         //       }
  //         //     })
  //         //   },
  //         // });
  //       });
  //     };
  //     // this.quillEditor = this.quillRef.getEditor();
  //     // const input = document.createElement('input');
  //     // input.setAttribute('type', 'file');
  //     // input.setAttribute('accept', 'image/*');
  //     // input.click();
  //     // input.onchange = async () => {
  //     //   const file = input.files[0];
  //     //   const formData = new FormData();
  //     //   formData.append('quill-image', file);
  //     //   const res = await uploadFile(formData);
  //     //   const range = this.quillEditor.getSelection();
  //     //   const link = res.data[0].url;
  //     //   // this part the image is inserted
  //     //   // by 'image' option below, you just have to put src(link) of img here.
  //     //   this.quillEditor.insertEmbed(range.index, 'image', link);
  //     // };
  //   },
};

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => (
  <ReactQuill
    theme="snow"
    placeholder="请输入详情"
    modules={{ toolbar: { container: toolbarOptions, handlers } }}
    value={props.value}
    onChange={props.onChange}
  />
);

export default RichTextEditor;
