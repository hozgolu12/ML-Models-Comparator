"""
ML Models Comparator - FastAPI Backend
=====================================

A production-ready backend service for comparing machine learning models.
Supports automatic task detection, data preprocessing, and comprehensive model evaluation.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.services.ml_service import MLService
from app.models.responses import ComparisonResponse, HealthResponse
from app.core.config import get_settings
from app.core.logging import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize settings
settings = get_settings()

# Initialize ML service
ml_service = MLService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting ML Models Comparator API")
    yield
    logger.info("Shutting down ML Models Comparator API")

# Create FastAPI app
app = FastAPI(
    title="ML Models Comparator API",
    description="Compare multiple machine learning models on your dataset",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy")

@app.post("/api/v1/compare", response_model=ComparisonResponse)
async def compare_models(file: UploadFile = File(...)):
    """
    Compare multiple ML models on uploaded dataset
    
    Args:
        file: CSV file containing the dataset
        
    Returns:
        ComparisonResponse with model results and metrics
        
    Raises:
        HTTPException: For invalid files or processing errors
    """
    try:
        # Validate file
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported"
            )
        
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Read file content
        content = await file.read()
        
        # Process with ML service
        logger.info(f"Processing file: {file.filename}")
        results = await ml_service.compare_models(content)
        
        logger.info("Model comparison completed successfully")
        return results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing dataset: {str(e)}"
        )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )