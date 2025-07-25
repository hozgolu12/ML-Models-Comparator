"""Response models"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ModelResult(BaseModel):
    """Individual model results"""
    name: str
    metrics: Dict[str, float]
    training_time: float
    type: str

class DatasetInfo(BaseModel):
    """Dataset information"""
    rows: int
    columns: int
    features: List[str]
    target: Optional[str] = None

class PreprocessingInfo(BaseModel):
    """Preprocessing information"""
    missing_values_handled: int
    categorical_features_encoded: int
    features_scaled: bool

class ComparisonResponse(BaseModel):
    """Model comparison response"""
    task_type: str
    models: List[ModelResult]
    dataset_info: DatasetInfo
    preprocessing_info: PreprocessingInfo

class HealthResponse(BaseModel):
    """Health check response"""
    status: str