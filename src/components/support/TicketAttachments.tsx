import { useState } from "react";
import { format } from "date-fns";
import { FileIcon, Download, Image, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketAttachment, getAttachmentUrl } from "@/services/supportTicketService";

interface TicketAttachmentsProps {
  attachments: TicketAttachment[];
  replyId?: string | null;
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return FileIcon;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
  return FileIcon;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TicketAttachments({ attachments, replyId }: TicketAttachmentsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  // Filter attachments based on replyId
  const filteredAttachments = replyId === undefined
    ? attachments.filter((a) => a.reply_id === null)
    : attachments.filter((a) => a.reply_id === replyId);

  if (filteredAttachments.length === 0) return null;

  const handleDownload = async (attachment: TicketAttachment) => {
    setDownloading(attachment.id);
    try {
      const url = await getAttachmentUrl(attachment.file_path);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to get download URL:", error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="mt-2 space-y-1">
      {filteredAttachments.map((attachment) => {
        const Icon = getFileIcon(attachment.mime_type);
        return (
          <div
            key={attachment.id}
            className="flex items-center gap-2 rounded-md bg-background/50 border px-3 py-2 text-sm"
          >
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{attachment.file_name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatFileSize(attachment.file_size)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => handleDownload(attachment)}
              disabled={downloading === attachment.id}
            >
              {downloading === attachment.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
