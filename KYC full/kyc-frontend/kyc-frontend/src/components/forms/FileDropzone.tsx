import { useRef, useState, DragEvent } from "react";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
}

export default function FileDropzone({
  onFile, accept = "application/json,.json,.jwt,.txt", label = "Déposez un fichier ou cliquez pour parcourir",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-6 text-center text-sm cursor-pointer transition-colors ${
        dragging ? "border-slate-500 bg-slate-50" : "border-gray-300 text-gray-500"
      }`}
    >
      {label}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}
