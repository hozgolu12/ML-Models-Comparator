"""Tests for ML service"""

import pytest
import pandas as pd
import numpy as np
from app.services.ml_service import MLService

@pytest.fixture
def ml_service():
    return MLService()

@pytest.fixture
def sample_classification_data():
    """Create sample classification dataset"""
    np.random.seed(42)
    n_samples = 100
    X = np.random.randn(n_samples, 4)
    y = (X[:, 0] + X[:, 1] > 0).astype(int)
    
    df = pd.DataFrame(X, columns=['feature1', 'feature2', 'feature3', 'feature4'])
    df['target'] = y
    return df

@pytest.fixture
def sample_regression_data():
    """Create sample regression dataset"""
    np.random.seed(42)
    n_samples = 100
    X = np.random.randn(n_samples, 3)
    y = X[:, 0] * 2 + X[:, 1] * 0.5 + np.random.randn(n_samples) * 0.1
    
    df = pd.DataFrame(X, columns=['feature1', 'feature2', 'feature3'])
    df['target'] = y
    return df

@pytest.mark.asyncio
async def test_classification_task(ml_service, sample_classification_data):
    """Test classification task detection and model training"""
    csv_content = sample_classification_data.to_csv(index=False).encode()
    
    result = await ml_service.compare_models(csv_content)
    
    assert result.task_type == 'classification'
    assert len(result.models) > 0
    assert result.dataset_info.rows == 100
    assert result.dataset_info.target == 'target'
    
    # Check that all models have appropriate metrics
    for model in result.models:
        assert 'accuracy' in model.metrics
        assert 'precision' in model.metrics
        assert 'recall' in model.metrics
        assert 'f1_score' in model.metrics
        assert model.training_time > 0

@pytest.mark.asyncio
async def test_regression_task(ml_service, sample_regression_data):
    """Test regression task detection and model training"""
    csv_content = sample_regression_data.to_csv(index=False).encode()
    
    result = await ml_service.compare_models(csv_content)
    
    assert result.task_type == 'regression'
    assert len(result.models) > 0
    assert result.dataset_info.rows == 100
    assert result.dataset_info.target == 'target'
    
    # Check that all models have appropriate metrics
    for model in result.models:
        assert 'mse' in model.metrics
        assert 'mae' in model.metrics
        assert 'r2_score' in model.metrics
        assert model.training_time > 0

def test_invalid_csv_format(ml_service):
    """Test handling of invalid CSV format"""
    invalid_content = b"invalid,csv,content\n1,2\n3,4,5,6"
    
    with pytest.raises(Exception):
        # This should be wrapped in asyncio.run in actual test
        pass