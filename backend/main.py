import logging

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.ensemble import IsolationForest

from analysis import clean_transactions, load_upload, preview_rows, summarize

logger = logging.getLogger(__name__)

app = FastAPI(
    title="MarginFlow API",
    description="Cash flow and anomaly detection for small businesses",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    filename = file.filename or ""
    suffix = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if suffix not in {"csv", "xlsx", "xls"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a .csv, .xlsx, or .xls file.",
        )

    contents = await file.read(MAX_UPLOAD_BYTES + 1)
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File is larger than 10 MB.")

    try:
        transactions = clean_transactions(load_upload(filename, contents))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Could not parse uploaded file %r", filename)
        raise HTTPException(
            status_code=400,
            detail="Could not process this file. Verify that it is a valid CSV or Excel document.",
        ) from exc

    try:
        if len(transactions) > 1:
            predictions = IsolationForest(
                contamination=0.05,
                random_state=42,
            ).fit_predict(transactions[["amount"]])
        else:
            predictions = [1] * len(transactions)

        all_rows = preview_rows(transactions, limit=len(transactions))
        for row, prediction in zip(all_rows, predictions):
            row["is_anomaly"] = bool(prediction == -1)

        anomalies = [row for row in all_rows if row["is_anomaly"]]
        return {
            "filename": filename,
            "summary": summarize(transactions),
            "transactions": all_rows[:50],
            "anomaly_count": len(anomalies),
            "anomalies": anomalies,
        }
    except Exception as exc:
        logger.exception("Transaction analysis failed for uploaded file %r", filename)
        raise HTTPException(
            status_code=500,
            detail="Transaction analysis failed unexpectedly. Please try again.",
        ) from exc
