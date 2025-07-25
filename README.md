# ML Models Comparator

A production-ready full-stack application for comparing machine learning models on datasets. Upload a CSV file and automatically compare 10 different ML algorithms with comprehensive metrics and visualizations.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Modern Dashboard Interface**: Clean, responsive design optimized for all devices
- **Drag & Drop File Upload**: Intuitive CSV upload with progress tracking
- **Interactive Visualizations**: Bar charts and radar charts for model comparison
- **Comprehensive Results**: Detailed performance metrics and rankings
- **Export Functionality**: Download results as CSV or PDF
- **Real-time Processing**: Live updates during model training
- **Error Handling**: Graceful error states and user feedback

### Backend (FastAPI + Python)
- **10 ML Algorithms**: Linear/Logistic Regression, Decision Trees, Random Forests, SVM, KNN, Naive Bayes, Gradient Boosting, K-Means, Neural Networks
- **Automatic Task Detection**: Intelligently detects classification, regression, or clustering tasks
- **Smart Preprocessing**: Handles missing values, categorical encoding, and feature scaling
- **Comprehensive Metrics**: 
  - **Classification**: Accuracy, Precision, Recall, F1-Score, ROC-AUC
  - **Regression**: MSE, MAE, R² Score
  - **Clustering**: Silhouette Score, Inertia
- **Production Ready**: Docker support, logging, error handling, and API documentation

## 🏗️ Architecture

```
ml-comparator/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── services/          # API integration
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helper functions
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── core/          # Configuration & logging
│   │   ├── models/        # Pydantic models
│   │   ├── services/      # ML services
│   │   └── utils/         # Data processing utilities
│   ├── tests/             # Test suite
│   └── Dockerfile         # Container configuration
└── README.md
```

## 🚦 Quick Start

### Frontend Development

The frontend is already configured and ready to run:

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Docker Deployment (Backend)

```bash
cd backend
docker-compose up -d
```

## 📊 Supported ML Models

### Classification & Regression
1. **Linear/Logistic Regression** - Simple baseline models
2. **Decision Trees** - Interpretable tree-based models
3. **Random Forest** - Ensemble of decision trees
4. **Support Vector Machines** - Kernel-based models for complex patterns
5. **K-Nearest Neighbors** - Instance-based learning
6. **Naive Bayes** - Probabilistic classifier (classification only)
7. **Gradient Boosting** - Advanced boosting ensemble
8. **Neural Networks** - Multi-layer perceptron for complex patterns

### Clustering
9. **K-Means** - Centroid-based clustering algorithm

## 📋 Data Requirements

- **Format**: CSV files only
- **Size**: Maximum 100MB
- **Structure**: Tabular data with column headers
- **Target Variable**: Automatically detected or uses last column
- **Data Types**: Supports numeric and categorical features

## 🎯 Usage

1. **Upload Dataset**: Drag and drop or click to upload a CSV file
2. **Automatic Processing**: The system will:
   - Detect task type (classification/regression/clustering)
   - Clean and preprocess your data
   - Train all applicable models
   - Calculate comprehensive metrics
3. **Analyze Results**: View interactive charts and detailed performance tables
4. **Export Results**: Download findings as CSV or PDF for further analysis

## 📈 Metrics Explained

### Classification
- **Accuracy**: Overall correctness of predictions
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **ROC-AUC**: Area under the receiver operating characteristic curve

### Regression
- **MSE**: Mean Squared Error - average squared differences
- **MAE**: Mean Absolute Error - average absolute differences
- **R² Score**: Coefficient of determination - variance explained

### Clustering
- **Silhouette Score**: How similar objects are to their own cluster vs. other clusters
- **Inertia**: Sum of squared distances from samples to cluster centers

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

### Backend Configuration

The backend can be configured via environment variables:

```env
DEBUG=false
LOG_LEVEL=INFO
MAX_FILE_SIZE=104857600  # 100MB
```

## 🧪 Testing

### Frontend
```bash
npm run test
```

### Backend
```bash
cd backend
pytest tests/ -v
```

## 🚢 Production Deployment

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- Backend powered by FastAPI and scikit-learn
- Charts powered by Recharts
- Icons by Lucide React

---

**Ready to compare ML models on your data? Upload a CSV file and let the analysis begin!** 🚀
