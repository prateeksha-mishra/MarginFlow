import re
from pathlib import Path

import pytest

from analysis import clean_transactions, load_upload

FIXTURE_DIR = Path(__file__).parent / "fixtures"
INVALID_FIXTURES = [
    ("empty.csv", "CSV file is empty"),
    ("headers_only.csv", "uploaded file has no rows"),
    ("malformed.csv", "Could not read the CSV"),
    ("invalid_rows.csv", "No valid rows remained"),
    ("missing_date.csv", "Could not find a date column"),
    ("corrupt_workbook.xlsx", "Could not read the Excel file"),
    ("empty_sheet.xlsx", "uploaded file has no rows"),
]


@pytest.mark.parametrize(("filename", "expected_message"), INVALID_FIXTURES)
def test_invalid_upload_fixtures_return_clear_errors(filename, expected_message):
    contents = (FIXTURE_DIR / filename).read_bytes()

    with pytest.raises(ValueError, match=re.escape(expected_message)):
        clean_transactions(load_upload(filename, contents))


def test_valid_excel_fixture_has_all_transactions():
    filename = "valid_transactions.xlsx"
    contents = (FIXTURE_DIR / filename).read_bytes()

    transactions = clean_transactions(load_upload(filename, contents))

    assert len(transactions) == 20
    assert transactions["date"].notna().all()
    assert transactions["amount"].notna().all()