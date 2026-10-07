from io import BytesIO
import re

import pandas as pd

DATE_ALIASES = (
    "date",
    "transaction_date",
    "txn_date",
    "posted_date",
    "posting_date",
    "trans_date",
)
AMOUNT_ALIASES = ("amount", "total", "price", "value", "net", "net_amount")
DESCRIPTION_ALIASES = (
    "description",
    "memo",
    "details",
    "narration",
    "name",
    "payee",
)
CATEGORY_ALIASES = ("category", "type", "classification")
DEBIT_ALIASES = ("debit", "withdrawal", "outflow")
CREDIT_ALIASES = ("credit", "deposit", "inflow")
REVENUE_CATEGORIES = {"revenue", "sales", "income", "deposit"}


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [
        re.sub(r"[^a-z0-9]+", "_", str(col).strip().lower()).strip("_")
        for col in df.columns
    ]
    return df


def _first_matching_column(df: pd.DataFrame, aliases: tuple[str, ...]) -> str | None:
    for alias in aliases:
        if alias in df.columns:
            return alias
    return None


def _parse_amount_series(series: pd.Series) -> pd.Series:
    cleaned = (
        series.astype(str)
        .str.replace(r"[\$,]", "", regex=True)
        .str.replace(r"^\((.*)\)$", r"-\1", regex=True)
        .str.strip()
    )
    return pd.to_numeric(cleaned, errors="coerce")


def load_upload(filename: str, contents: bytes) -> pd.DataFrame:
    suffix = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    buffer = BytesIO(contents)

    if suffix == "csv":
        return pd.read_csv(buffer)
    if suffix == "xlsx":
        return pd.read_excel(buffer, engine="openpyxl")
    if suffix == "xls":
        return pd.read_excel(buffer, engine="xlrd")

    raise ValueError("Unsupported file type. Upload a .csv, .xlsx, or .xls file.")


def clean_transactions(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        raise ValueError("The uploaded file has no rows.")

    df = _normalize_columns(df)
    df = df.dropna(how="all")

    date_col = _first_matching_column(df, DATE_ALIASES)
    amount_col = _first_matching_column(df, AMOUNT_ALIASES)
    debit_col = _first_matching_column(df, DEBIT_ALIASES)
    credit_col = _first_matching_column(df, CREDIT_ALIASES)
    description_col = _first_matching_column(df, DESCRIPTION_ALIASES)
    category_col = _first_matching_column(df, CATEGORY_ALIASES)

    if date_col is None:
        raise ValueError("Could not find a date column (e.g. date, transaction_date).")

    cleaned = pd.DataFrame()
    cleaned["date"] = pd.to_datetime(df[date_col], errors="coerce")

    if amount_col is not None:
        cleaned["amount"] = _parse_amount_series(df[amount_col])
    elif debit_col is not None or credit_col is not None:
        debit = (
            _parse_amount_series(df[debit_col]).fillna(0)
            if debit_col
            else 0
        )
        credit = (
            _parse_amount_series(df[credit_col]).fillna(0)
            if credit_col
            else 0
        )
        cleaned["amount"] = credit - debit
    else:
        raise ValueError(
            "Could not find an amount column (e.g. amount) or debit/credit columns."
        )

    cleaned["description"] = (
        df[description_col].astype(str).str.strip() if description_col else ""
    )
    cleaned["category"] = (
        df[category_col].astype(str).str.strip() if category_col else ""
    )

    cleaned = cleaned.dropna(subset=["date", "amount"])
    cleaned["description"] = cleaned["description"].replace({"nan": "", "None": ""})
    cleaned["category"] = cleaned["category"].replace({"nan": "", "None": ""})
    cleaned = cleaned.sort_values("date").reset_index(drop=True)

    if cleaned.empty:
        raise ValueError("No valid rows remained after cleaning dates and amounts.")

    return cleaned


def is_revenue_row(row: pd.Series) -> bool:
    category = str(row.get("category", "")).strip().lower()
    if category in REVENUE_CATEGORIES:
        return True
    return row["amount"] > 0


def summarize(df: pd.DataFrame) -> dict:
    revenue_mask = df.apply(is_revenue_row, axis=1)
    expenses_mask = df["amount"] < 0

    total_revenue = float(df.loc[revenue_mask, "amount"].clip(lower=0).sum())
    total_expenses = float(df.loc[expenses_mask, "amount"].abs().sum())
    net_cash_flow = float(df["amount"].sum())

    return {
        "row_count": int(len(df)),
        "date_start": df["date"].min().date().isoformat(),
        "date_end": df["date"].max().date().isoformat(),
        "total_revenue": round(total_revenue, 2),
        "total_expenses": round(total_expenses, 2),
        "net_cash_flow": round(net_cash_flow, 2),
    }


def preview_rows(df: pd.DataFrame, limit: int = 50) -> list[dict]:
    preview = df.head(limit).copy()
    preview["date"] = preview["date"].dt.strftime("%Y-%m-%d")
    preview["amount"] = preview["amount"].round(2)
    return preview.to_dict(orient="records")


def analyze_file(filename: str, contents: bytes) -> dict:
    raw = load_upload(filename, contents)
    cleaned = clean_transactions(raw)
    return {
        "filename": filename,
        "summary": summarize(cleaned),
        "transactions": preview_rows(cleaned),
    }
