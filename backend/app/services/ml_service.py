"""Machine Learning service for model comparison"""

import io
import time
import asyncio
import logging
from typing import Dict, List, Tuple, Any
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

from app.models.responses import ComparisonResponse, ModelResult, DatasetInfo, PreprocessingInfo
from app.services.model_trainer import ModelTrainer
from app.utils.data_preprocessor import DataPreprocessor
from app.utils.task_detector import TaskDetector

logger = logging.getLogger(__name__)

class MLService:
    """Main service for ML model comparison"""
    
    def __init__(self):
        self.data_preprocessor = DataPreprocessor()
        self.task_detector = TaskDetector()
        self.model_trainer = ModelTrainer()
    
    async def compare_models(self, file_content: bytes) -> ComparisonResponse:
        """
        Compare multiple ML models on the provided dataset
        
        Args:
            file_content: CSV file content as bytes
            
        Returns:
            ComparisonResponse with all model results
        """
        try:
            # Load data
            df = pd.read_csv(io.BytesIO(file_content))
            logger.info(f"Loaded dataset with shape: {df.shape}")
            
            # Detect task type and target column
            task_type, target_column = self.task_detector.detect_task(df)
            logger.info(f"Detected task type: {task_type}")

            # Log the detected task type and target column
            logger.info(f"Detected task_type: {task_type}, target_column: {target_column}")
            
            # Preprocess data
            X, y, preprocessing_info = await self.data_preprocessor.preprocess(
                df, target_column, task_type
            )
            
            # Split data
            if task_type != 'clustering':
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42, 
                    stratify=y if task_type == 'classification' else None
                )
            else:
                X_train, X_test = X, X
                y_train, y_test = None, None
            
            # Train models
            model_results = await self.model_trainer.train_all_models(
                X_train, X_test, y_train, y_test, task_type
            )
            
            # Prepare response
            dataset_info = DatasetInfo(
                rows=len(df),
                columns=len(df.columns),
                features=[col for col in df.columns if col != target_column],
                target=target_column
            )
            
            return ComparisonResponse(
                task_type=task_type,
                models=model_results,
                dataset_info=dataset_info,
                preprocessing_info=preprocessing_info
            )
            
        except Exception as e:
            logger.error(f"Error in compare_models: {str(e)}")
            raise