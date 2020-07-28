import React, { useState } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextEditorProps {
  value?: string;
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

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const [value, setValue] = useState<string>(props.value || '');

  return (
    <ReactQuill
      theme="snow"
      placeholder="请输入详情"
      modules={{ toolbar: toolbarOptions }}
      value={value}
      onChange={(v: string) => setValue(v)}
    />
  );
};

export default RichTextEditor;
