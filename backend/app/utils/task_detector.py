"""Task type detection utilities"""

import pandas as pd
import numpy as np
from typing import Tuple, Optional

class TaskDetector:
    """Detect ML task type from dataset"""
    
    def detect_task(self, df: pd.DataFrame) -> Tuple[str, Optional[str]]:
        """
        Detect if the task is classification, regression, or clustering
        
        Args:
            df: Input dataframe
            
        Returns:
            Tuple of (task_type, target_column)
        """
        # Try to identify target column
        target_column = self._identify_target_column(df)
        
        if target_column is None:
            return 'clustering', None
        
        target_series = df[target_column]
        
        # Check if target is numeric
        if pd.api.types.is_numeric_dtype(target_series):
            # Check if it's discrete (likely classification)
            unique_values = target_series.nunique()
            total_values = len(target_series)
            
            # If less than 10 unique values or less than 5% unique values, likely classification
            if unique_values <= 10 or (unique_values / total_values) < 0.05:
                return 'classification', target_column
            else:
                return 'regression', target_column
        else:
            # Non-numeric target is classification
            return 'classification', target_column
    
    def _identify_target_column(self, df: pd.DataFrame) -> Optional[str]:
        """
        Try to identify the target column
        
        Args:
            df: Input dataframe
            
        Returns:
            Target column name or None
        """
        # Common target column names
        target_names = [
            'target', 'label', 'class', 'y', 'output', 'result',
            'outcome', 'response', 'dependent', 'prediction'
        ]
        
        # Check for exact matches (case insensitive)
        for col in df.columns:
            if col.lower() in target_names:
                return col
        
        # Check for partial matches
        for col in df.columns:
            for target_name in target_names:
                if target_name in col.lower():
                    return col
        
        # If no clear target found, assume last column is target
        # unless it's clearly an ID column
        last_col = df.columns[-1]
        if not any(id_term in last_col.lower() for id_term in ['id', 'index', 'key']):
            return last_col
        
        return None