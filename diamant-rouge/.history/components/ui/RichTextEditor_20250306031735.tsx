import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import a simple HTML editor that works better with React 18
const SimpleMDE = dynamic(() => import('react-simplemde-editor').then(mod => mod.default), {
  ssr: false,
});

import 'easymde/dist/easymde.min.css';

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
  
  // Options for SimpleMDE editor
  const options = {
    autofocus: false,
    spellChecker: false,
    placeholder: placeholder || "Composez votre contenu...",
    status: false,
    toolbar: [
      "bold", "italic", "heading", "|", 
      "unordered-list", "ordered-list", "|",
      "link", "image", "|",
      "preview", "side-by-side", "fullscreen",
    ],
  };
  
  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={options}
      className={className}
      id={id}
    />
  );
}