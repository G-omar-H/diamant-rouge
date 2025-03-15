import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any; // Kept for API compatibility
  formats?: string[]; // Kept for API compatibility
  className?: string;
  id?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Composez le contenu élégant de votre newsletter...",
  className,
  id
}: RichTextEditorProps) {
  // Basic HTML controls
  const insertHTML = (html: string) => {
    onChange(value + html);
  };
  
  // Simple text formatting helpers
  const formatters = [
    { name: 'Titre', icon: 'H1', action: () => insertHTML('<h1>Titre</h1>') },
    { name: 'Sous-titre', icon: 'H2', action: () => insertHTML('<h2>Sous-titre</h2>') },
    { name: 'Gras', icon: 'B', action: () => insertHTML('<strong>Texte en gras</strong>') },
    { name: 'Italique', icon: 'I', action: () => insertHTML('<em>Texte en italique</em>') },
    { name: 'Liste à puces', icon: '•', action: () => insertHTML('<ul><li>Élément</li></ul>') },
    { name: 'Liste numérotée', icon: '1.', action: () => insertHTML('<ol><li>Élément</li></ol>') },
    { name: 'Lien', icon: '🔗', action: () => insertHTML('<a href="https://exemple.com">Lien</a>') },
    { name: 'Paragraphe', icon: '¶', action: () => insertHTML('<p>Nouveau paragraphe</p>') },
  ];

  return (
    <div className="rich-text-editor-container">
      <div className="rich-text-toolbar bg-white border-b border-platinumGray/20 p-2 flex flex-wrap gap-1">
        {formatters.map((formatter) => (
          <button
            key={formatter.name}
            type="button"
            onClick={formatter.action}
            className="px-2 py-1 border border-platinumGray/30 rounded hover:bg-brandGold/10 text-sm"
            title={formatter.name}
          >
            {formatter.icon}
          </button>
        ))}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 min-h-[300px] border-0 focus:ring-0 focus:outline-none ${className}`}
        id={id}
        style={{ resize: 'vertical' }}
      />
      
      <div className="p-3 border-t border-platinumGray/20 bg-richEbony/5 text-xs text-platinumGray">
        <p>Vous pouvez utiliser du HTML pour le formatage (<code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;a&gt;</code>, etc).</p>
      </div>
      
      <style jsx>{`
        .rich-text-editor-container {
          border-radius: 0.375rem;
          border: 1px solid rgba(203, 213, 225, 0.5);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}