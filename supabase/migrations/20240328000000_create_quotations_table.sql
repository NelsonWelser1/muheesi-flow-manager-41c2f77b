create table if not exists public.quotations (
    id uuid default gen_random_uuid() primary key,
    quote_number text unique not null,
    customer_name text not null,
    coffee_grade text not null,
    quantity numeric not null,
    unit_price numeric not null,
    total_amount numeric not null,
    terms text,
    validity date not null,
    delivery_terms text not null,
    payment_terms text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.quotations enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.quotations
    for select using (true);

create policy "Enable insert access for authenticated users" on public.quotations
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.quotations
    for update using (auth.role() = 'authenticated');

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_quotations_updated_at
    before update on public.quotations
    for each row
    execute procedure public.handle_updated_at();