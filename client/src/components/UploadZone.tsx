import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_LABEL = '5 MB';

interface UploadZoneProps {
  file: File | null;
  onFile: (file: File | null) => void;
}

export function UploadZone({ file, onFile }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const code = rejections[0]?.errors[0]?.code;
    if (code === 'file-invalid-type') {
      toast.error('Please upload a valid resume (PDF only)');
    } else if (code === 'file-too-large') {
      toast.error(`File too large. Maximum size is ${MAX_LABEL}`);
    } else if (code === 'too-many-files') {
      toast.error('Please upload only one file');
    } else {
      toast.error('Could not accept that file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_BYTES,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{file.name}</div>
          <div className="font-mono text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onFile(null)} aria-label="Remove file">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed bg-muted/40 px-6 py-10 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Upload className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium">
          {isDragActive ? 'Drop the PDF here' : 'Drop your PDF here, or click to browse'}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">PDF only · max {MAX_LABEL}</p>
      </div>
    </div>
  );
}
