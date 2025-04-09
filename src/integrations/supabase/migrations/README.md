
# Contract Documents Migration

## SQL Migration

The `contract_documents.sql` file contains the SQL statements to create the necessary table and indexes for the Contract Documents feature.

## How to Run the Migration in Supabase

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `contract_documents.sql` into the query editor
5. Run the query

## About the Migration

This migration:

1. Creates a `contract_documents` table to store document metadata
2. Sets up indexes for optimized queries
3. Configures Row Level Security with a public access policy (since authentication is temporarily disabled)
4. Ensures UUID generation capability is available

## Fields in the Table

- `id`: Unique identifier for each document (UUID)
- `filename`: The original filename
- `file_path`: Path in storage where the file is saved
- `file_url`: Public URL to access the file
- `contract_id`: Associated contract ID (optional)
- `file_type`: MIME type of the file
- `file_size`: Size of the file in bytes
- `status`: Current status (pending_verification, verified, rejected)
- `upload_date`: When the document was uploaded
- `created_at`, `updated_at`: Timestamps for record creation and updates
- `client`: Client associated with the document
- `notes`: Additional notes about the document
- `keywords`: Array of keywords for searching
- `signed_by`: Array of names who signed the document
- `verified_by`: Who verified the document
- `verified_at`: When the document was verified
- `metadata`: JSONB field for additional structured data

## JavaScript Migration

The `contractDocumentsMigration.js` file contains JavaScript code that attempts to create the same table and storage bucket programmatically. This is used by the application for automatic setup but may not work in all environments due to permission constraints.
