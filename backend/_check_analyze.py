from io import BytesIO

import pandas as pd

from analysis import analyze_file

rows = [
    {
        "Date": "2026-10-05",
        "Description": "Customer invoice",
        "Category": "Revenue",
        "Amount": "$1,840.00",
    },
    {
        "Date": "10/04/2026",
        "Description": "Payroll",
        "Category": "Payroll",
        "Amount": "-3120.50",
    },
    {
        "Date": "2026-10-03",
        "Description": "",
        "Category": "Transfers",
        "Amount": "(2450.00)",
    },
    {
        "Date": None,
        "Description": "bad row",
        "Category": "Revenue",
        "Amount": "100",
    },
    {
        "Date": "2026-10-01",
        "Description": "POS batch",
        "Category": "Sales",
        "Amount": 2695.4,
    },
]
df = pd.DataFrame(rows)
csv_bytes = df.to_csv(index=False).encode()
xlsx_buf = BytesIO()
df.to_excel(xlsx_buf, index=False, engine="openpyxl")

csv_result = analyze_file("ledger.csv", csv_bytes)
xlsx_result = analyze_file("ledger.xlsx", xlsx_buf.getvalue())
print("csv", csv_result["summary"], "rows", len(csv_result["transactions"]))
print("xlsx", xlsx_result["summary"])
print("sample", csv_result["transactions"][0])
