"""Model training service"""

import time
import asyncio
import logging
from typing import List, Optional
import numpy as np
import pandas as pd

# Scikit-learn imports
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.cluster import KMeans
from sklearn.metrics import *

from app.models.responses import ModelResult

logger = logging.getLogger(__name__)

class ModelTrainer:
    """Train and evaluate ML models"""
    
    def __init__(self):
        self.models_config = {
            'classification': {
                'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
                'Decision Tree': DecisionTreeClassifier(random_state=42),
                'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100),
                'SVM': SVC(random_state=42, probability=True),
                'K-Nearest Neighbors': KNeighborsClassifier(),
                'Naive Bayes': GaussianNB(),
                'Gradient Boosting': GradientBoostingClassifier(random_state=42),
                'Neural Network': MLPClassifier(random_state=42, max_iter=500)
            },
            'regression': {
                'Linear Regression': LinearRegression(),
                'Decision Tree': DecisionTreeRegressor(random_state=42),
                'Random Forest': RandomForestRegressor(random_state=42, n_estimators=100),
                'SVM': SVR(),
                'K-Nearest Neighbors': KNeighborsRegressor(),
                'Gradient Boosting': GradientBoostingRegressor(random_state=42),
                'Neural Network': MLPRegressor(random_state=42, max_iter=500)
            },
            'clustering': {
                'K-Means': KMeans(random_state=42, n_clusters=3)
            }
        }
    
    async def train_all_models(
        self,
        X_train: pd.DataFrame,
        X_test: pd.DataFrame,
        y_train: Optional[pd.Series],
        y_test: Optional[pd.Series],
        task_type: str
    ) -> List[ModelResult]:
        """Train all models for the given task type"""
        
        models = self.models_config.get(task_type, {})
        results = []
        
        for model_name, model in models.items():
            try:
                logger.info(f"Training {model_name}")
                result = await self._train_single_model(
                    model, model_name, X_train, X_test, y_train, y_test, task_type
                )
                results.append(result)
            except Exception as e:
                logger.error(f"Error training {model_name}: {str(e)}")
                # Continue with other models
                continue
        
        return results
    
    async def _train_single_model(
        self,
        model,
        model_name: str,
        X_train: pd.DataFrame,
        X_test: pd.DataFrame,
        y_train: Optional[pd.Series],
        y_test: Optional[pd.Series],
        task_type: str
    ) -> ModelResult:
        """Train a single model and return results"""
        
        start_time = time.time()
        
        if task_type == 'clustering':
            # Clustering doesn't need y
            model.fit(X_train)
            y_pred = model.predict(X_test)
            metrics = self._calculate_clustering_metrics(X_test, y_pred)
        else:
            # Supervised learning
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            if task_type == 'classification':
                metrics = self._calculate_classification_metrics(y_test, y_pred, model, X_test)
            else:  # regression
                metrics = self._calculate_regression_metrics(y_test, y_pred)
        
        training_time = time.time() - start_time
        
        return ModelResult(
            name=model_name,
            metrics=metrics,
            training_time=training_time,
            type=task_type
        )
    
    def _calculate_classification_metrics(self, y_true, y_pred, model, X_test) -> dict:
        """Calculate classification metrics"""
        metrics = {
            'accuracy': accuracy_score(y_true, y_pred),
            'precision': precision_score(y_true, y_pred, average='weighted', zero_division=0),
            'recall': recall_score(y_true, y_pred, average='weighted', zero_division=0),
            'f1_score': f1_score(y_true, y_pred, average='weighted', zero_division=0)
        }
        
        # Add ROC-AUC for binary classification
        try:
            if len(np.unique(y_true)) == 2 and hasattr(model, 'predict_proba'):
                y_proba = model.predict_proba(X_test)[:, 1]
                metrics['roc_auc'] = roc_auc_score(y_true, y_proba)
            elif len(np.unique(y_true)) > 2 and hasattr(model, 'predict_proba'):
                y_proba = model.predict_proba(X_test)
                metrics['roc_auc'] = roc_auc_score(y_true, y_proba, multi_class='ovr', average='weighted')
        except:
            # If ROC-AUC calculation fails, skip it
            pass
        
        return metrics
    
    def _calculate_regression_metrics(self, y_true, y_pred) -> dict:
        """Calculate regression metrics"""
        return {
            'mse': mean_squared_error(y_true, y_pred),
            'mae': mean_absolute_error(y_true, y_pred),
            'r2_score': r2_score(y_true, y_pred)
        }
    
    def _calculate_clustering_metrics(self, X, labels) -> dict:
        """Calculate clustering metrics"""
        try:
            silhouette_avg = silhouette_score(X, labels)
        except:
            silhouette_avg = 0.0
        
        # Calculate inertia (sum of squared distances to centroids)
        try:
            # This is a simplified inertia calculation
            inertia = np.sum([np.min([np.sum((x - c)**2) for c in np.unique(labels)]) for x in X.values])
        except:
            inertia = 0.0
        
        return {
            'silhouette_score': silhouette_avg,
            'inertia': inertia
        }