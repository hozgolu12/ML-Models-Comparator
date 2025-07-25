# ML Models Comparator - Backend API

A production-ready FastAPI backend for comparing machine learning models on datasets.

## Features

- **10 ML Algorithms**: Linear Regression, Logistic Regression, Decision Trees, Random Forests, SVM, KNN, Naive Bayes, Gradient Boosting, K-Means Clustering, and Neural Networks
- **Automatic Task Detection**: Automatically detects classification, regression, or clustering tasks
- **Comprehensive Metrics**: 
  - Classification: Accuracy, Precision, Recall, F1-Score, ROC-AUC
  - Regression: MSE, MAE, R² Score
  - Clustering: Silhouette Score, Inertia
- **Data Preprocessing**: Handles missing values, categorical encoding, and feature scaling
- **RESTful API**: Clean FastAPI implementation with automatic documentation
- **Production Ready**: Includes logging, error handling, and Docker support

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

### Docker Deployment

1. **Build and Run with Docker**
   ```bash
   cd backend
   docker build -t ml-comparator-api .
   docker run -p 8000:8000 ml-comparator-api
   ```

2. **Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

## API Endpoints

### POST `/api/v1/compare`
Upload a CSV file and get ML model comparison results.

**Request:**
- Content-Type: `multipart/form-data`
- Body: CSV file (max 100MB)

**Response:**
```json
{
  "task_type": "classification",
  "models": [
    {
      "name": "Random Forest",
      "metrics": {
        "accuracy": 0.95,
        "precision": 0.94,
        "recall": 0.95,
        "f1_score": 0.94,
        "roc_auc": 0.98
      },
      "training_time": 0.123,
      "type": "classification"
    }
  ],
  "dataset_info": {
    "rows": 1000,
    "columns": 10,
    "features": ["feature1", "feature2", ...],
    "target": "target_column"
  },
  "preprocessing_info": {
    "missing_values_handled": 5,
    "categorical_features_encoded": 3,
    "features_scaled": true
  }
}
```

### GET `/health`
Health check endpoint.

## Configuration

Environment variables can be set in `.env` file:

```env
DEBUG=false
LOG_LEVEL=INFO
MAX_FILE_SIZE=104857600  # 100MB in bytes
```

## Testing

Run the test suite:

```bash
cd backend
pytest tests/ -v
```

## Architecture

```
backend/
├── app/
│   ├── core/           # Configuration and logging
│   ├── models/         # Pydantic models
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── tests/              # Test suite
├── main.py            # FastAPI application
├── requirements.txt   # Python dependencies
└── Dockerfile        # Container configuration
```

## Supported Algorithms

### Classification & Regression
1. **Linear/Logistic Regression** - Simple linear models
2. **Decision Trees** - Tree-based models
3. **Random Forest** - Ensemble of decision trees
4. **Support Vector Machines** - Kernel-based models
5. **K-Nearest Neighbors** - Instance-based learning
6. **Naive Bayes** - Probabilistic classifier (classification only)
7. **Gradient Boosting** - Boosting ensemble method
8. **Neural Networks** - Multi-layer perceptron

### Clustering
9. **K-Means** - Centroid-based clustering

## Data Requirements

- **Format**: CSV files only
- **Size**: Maximum 100MB
- **Structure**: Tabular data with headers
- **Target**: Last column assumed as target (or auto-detected)

## Error Handling

The API provides detailed error messages for common issues:
- Invalid file format
- File size exceeded
- Missing or corrupted data
- Model training failures

## Performance

- **Concurrent Processing**: Async/await support for non-blocking operations
- **Memory Efficient**: Streaming file processing
- **Scalable**: Stateless design suitable for horizontal scaling

## Security

- **File Validation**: Strict CSV format checking
- **Size Limits**: Configurable file size restrictions
- **Error Sanitization**: Prevents information leakage in error messages
- **CORS**: Configurable cross-origin request handling

## Monitoring

- **Health Checks**: Built-in health endpoint for monitoring
- **Logging**: Structured logging with configurable levels
- **Metrics**: Training time and performance metrics tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.