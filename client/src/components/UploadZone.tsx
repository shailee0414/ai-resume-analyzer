import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { FileText, Upload, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_LABEL = '5 MB';
const BOX_HEIGHT = 'min-h-[220px]';

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
      <div
        className={cn(
          BOX_HEIGHT,
          'relative flex flex-col items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed border-primary/40 bg-primary/5 px-6 py-8 text-center'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFile(null)}
          aria-label="Remove file"
          className="absolute right-2 top-2 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="flex max-w-full items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{file.name}</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB · ready to analyze
        </p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        BOX_HEIGHT,
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed bg-muted/40 px-6 py-8 text-center transition-colors',
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
