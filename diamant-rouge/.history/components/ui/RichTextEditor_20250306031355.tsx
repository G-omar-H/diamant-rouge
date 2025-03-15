import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  className?: string;
  id?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  modules,
  formats,
  className,
  id
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only render the editor on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className={`border rounded-md p-3 ${className}`} style={{ height: '300px' }}>
        <p className="text-platinumGray">Chargement de l'éditeur...</p>
      </div>
    );
  }
  
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className={className}
      id={id}
    />
  );
}