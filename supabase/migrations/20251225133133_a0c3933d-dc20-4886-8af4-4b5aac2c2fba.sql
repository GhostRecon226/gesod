-- Drop the old constraint
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add updated constraint with all notification types
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'status_update', 
  'document_upload', 
  'quote_response', 
  'bid_outcome',
  'ticket_reply',
  'ticket_status',
  'quote_issued',
  'quote_expired'
]));