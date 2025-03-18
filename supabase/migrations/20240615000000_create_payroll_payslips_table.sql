
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create payroll_payslips table with all required fields
CREATE TABLE IF NOT EXISTS payroll_payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payslip_number TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    department TEXT,
    salary_period TEXT NOT NULL,
    payment_date DATE NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    nssf_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    loan_deduction DECIMAL(12,2) NOT NULL DEFAULT 0,
    other_deductions DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_salary DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE payroll_payslips ENABLE ROW LEVEL SECURITY;

-- Create policies for all users (temporarily disabling authentication)
CREATE POLICY "Allow all operations for all users" ON payroll_payslips
    FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Create index for common queries
CREATE INDEX idx_payroll_payslips_employee_id ON payroll_payslips(employee_id);
CREATE INDEX idx_payroll_payslips_payment_date ON payroll_payslips(payment_date);
CREATE INDEX idx_payroll_payslips_payment_status ON payroll_payslips(payment_status);
