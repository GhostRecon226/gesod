import { useRef } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadInputProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export function FileUploadInput({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = "image/*,.pdf,.doc,.docx,.txt",
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return false;
      }
      return true;
    });

    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    onChange(newFiles);

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= maxFiles}
        >
          <Paperclip className="mr-2 h-4 w-4" />
          Attach Files
        </Button>
        <span className="text-xs text-muted-foreground">
          {files.length}/{maxFiles} files (max {maxSizeMB}MB each)
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
            >
              <span className="max-w-[150px] truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
