"""Data preprocessing utilities"""

import pandas as pd
import numpy as np
from typing import Tuple, Optional
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import asyncio

from app.models.responses import PreprocessingInfo

class DataPreprocessor:
    """Handle data preprocessing for ML models"""
    
    async def preprocess(
        self, 
        df: pd.DataFrame, 
        target_column: Optional[str], 
        task_type: str
    ) -> Tuple[pd.DataFrame, Optional[pd.Series], PreprocessingInfo]:
        """
        Preprocess the dataset for ML training
        
        Args:
            df: Input dataframe
            target_column: Name of target column
            task_type: Type of ML task
            
        Returns:
            Tuple of (X, y, preprocessing_info)
        """
        df_copy = df.copy()
        
        # Separate features and target
        if target_column and target_column in df_copy.columns:
            X = df_copy.drop(columns=[target_column])
            y = df_copy[target_column]
        else:
            X = df_copy
            y = None
        
        # Initialize preprocessing info
        missing_values_handled = X.isnull().sum().sum()
        categorical_features_encoded = 0
        
        # Handle missing values
        if missing_values_handled > 0:
            X = await self._handle_missing_values(X)
        
        # Encode categorical variables
        categorical_cols = X.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            X, encoded_count = await self._encode_categorical_features(X, categorical_cols)
            categorical_features_encoded = encoded_count
        
        # Encode target variable if it's categorical
        if y is not None and not pd.api.types.is_numeric_dtype(y):
            label_encoder = LabelEncoder()
            y = pd.Series(label_encoder.fit_transform(y), index=y.index)
        
        # Scale features
        features_scaled = task_type != 'clustering'  # Scale for all except clustering
        if features_scaled:
            X = await self._scale_features(X)
        
        preprocessing_info = PreprocessingInfo(
            missing_values_handled=missing_values_handled,
            categorical_features_encoded=categorical_features_encoded,
            features_scaled=features_scaled
        )
        
        return X, y, preprocessing_info
    
    async def _handle_missing_values(self, X: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values in the dataset"""
        # Use appropriate imputation strategy for different column types
        numeric_cols = X.select_dtypes(include=[np.number]).columns
        categorical_cols = X.select_dtypes(include=['object']).columns
        
        if len(numeric_cols) > 0:
            numeric_imputer = SimpleImputer(strategy='median')
            X[numeric_cols] = numeric_imputer.fit_transform(X[numeric_cols])
        
        if len(categorical_cols) > 0:
            categorical_imputer = SimpleImputer(strategy='most_frequent')
            X[categorical_cols] = categorical_imputer.fit_transform(X[categorical_cols])
        
        return X
    
    async def _encode_categorical_features(
        self, 
        X: pd.DataFrame, 
        categorical_cols: pd.Index
    ) -> Tuple[pd.DataFrame, int]:
        """Encode categorical features"""
        encoded_count = 0
        
        for col in categorical_cols:
            if X[col].nunique() <= 10:  # One-hot encode if few categories
                dummies = pd.get_dummies(X[col], prefix=col, drop_first=True)
                X = pd.concat([X.drop(columns=[col]), dummies], axis=1)
                encoded_count += len(dummies.columns)
            else:  # Label encode if many categories
                label_encoder = LabelEncoder()
                X[col] = label_encoder.fit_transform(X[col].astype(str))
                encoded_count += 1
        
        return X, encoded_count
    
    async def _scale_features(self, X: pd.DataFrame) -> pd.DataFrame:
        """Scale numerical features"""
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        return pd.DataFrame(X_scaled, columns=X.columns, index=X.index)