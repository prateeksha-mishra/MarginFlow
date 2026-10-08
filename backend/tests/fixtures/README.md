# Upload Fixtures

These small files exercise the upload parser. From the `backend` directory,
install the development test dependency and run the suite:

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest
```

The suite checks seven invalid uploads and verifies that the valid Excel
workbook contains 20 cleaned transactions.

To test the HTTP endpoint while the backend is running on port 8001, upload a
fixture from the project root:

```powershell
curl.exe -F "file=@backend/tests/fixtures/headers_only.csv" http://localhost:8001/api/analyze
```

Invalid fixtures should return HTTP 400 with a readable validation message.
The empty upload returns `Uploaded file is empty.`; the valid workbook should
return HTTP 200 with 20 transactions. Oversized-file tests use a generated
temporary file rather than committing a 10 MB fixture; files larger than 10 MB
should return HTTP 413.