import { EngineerCard } from "@/types/engineer-mode";
import { applyEngineerCategoryIpToDeck } from "./ipValues";
import { expandEngineerDeck } from "./deckCopies";
import { MILESTONE_CARDS, getMilestoneForObjective } from "./milestones";

const ENGINEER_CARDS_RAW: EngineerCard[] = [
    {
        "id": "obj_1",
        "name": "Fraud Detection System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that detects fraudulent financial transactions and protects assets.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_0.png"
    },
    {
        "id": "obj_2",
        "name": "Recommendation Engine",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that recommends products, content, or services to users.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_1.png"
    },
    {
        "id": "obj_3",
        "name": "Healthcare Diagnosis AI",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that assists clinicians in diagnosing diseases from medical data.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_2.png"
    },
    {
        "id": "obj_4",
        "name": "Autonomous Navigation System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system capable of navigating vehicles or robots autonomously.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_3.png"
    },
    {
        "id": "obj_5",
        "name": "Climate Forecasting Model",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that predicts climate and environmental changes.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_4.png"
    },
    {
        "id": "obj_6",
        "name": "Social Media Moderation AI",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that detects harmful, inappropriate, or misleading content.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_5.png"
    },
    {
        "id": "obj_7",
        "name": "Credit Risk Assessment AI",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that evaluates the likelihood of loan default and financial risk.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_6.png"
    },
    {
        "id": "obj_8",
        "name": "Voice Assistant AI",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that understands and responds to spoken language.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_7.png"
    },
    {
        "id": "obj_9",
        "name": "Cybersecurity Threat Detection",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that identifies and prevents cyber threats.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_8.png"
    },
    {
        "id": "obj_10",
        "name": "Smart Energy Optimization System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that improves energy efficiency and consumption.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_9.png"
    },
    {
        "id": "obj_11",
        "name": "E-Commerce Pricing AI",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that dynamically adjusts product pricing.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_10.png"
    },
    {
        "id": "obj_12",
        "name": "Facial Recognition System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that identifies and verifies individuals using images.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_11.png"
    },
    {
        "id": "obj_13",
        "name": "Customer Support Chatbot",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that provides automated customer support.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_12.png"
    },
    {
        "id": "obj_14",
        "name": "Traffic Flow Prediction System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that predicts traffic patterns and reduces congestion.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_13.png"
    },
    {
        "id": "obj_15",
        "name": "AI-Powered Recruitment System",
        "category": "SYSTEM OBJECTIVE",
        "description": "Build an AI system that helps match candidates to suitable job opportunities.",
        "ipValue": 0,
        "image": "/cards/engineer_cards/eng_14.png"
    },
    {
        "id": "col_1",
        "name": "Financial Transactions Dataset",
        "category": "DATA COLLECTION",
        "description": "Records of financial transactions used to detect spending patterns and fraud.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Fraud Detection System",
                "Credit Risk Assessment AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_15.png"
    },
    {
        "id": "col_4",
        "name": "Credit History Dataset",
        "category": "DATA COLLECTION",
        "description": "Records of borrowing and repayment behaviour used for credit scoring.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Credit Risk Assessment AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_18.png"
    },
    {
        "id": "col_5",
        "name": "User Behaviour Dataset",
        "category": "DATA COLLECTION",
        "description": "Data capturing how users interact with digital platforms.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Recommendation Engine"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_19.png"
    },
    {
        "id": "col_6",
        "name": "Customer Reviews Dataset",
        "category": "DATA COLLECTION",
        "description": "Ratings and feedback used for sentiment and recommendation analysis.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Social Media Moderation AI",
                "Customer Support Chatbot"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_20.png"
    },
    {
        "id": "col_7",
        "name": "E-Commerce Purchases Dataset",
        "category": "DATA COLLECTION",
        "description": "Online purchase records used to understand buying patterns.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "E-Commerce Pricing AI",
                "Recommendation Engine"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_21.png"
    },
    {
        "id": "col_9",
        "name": "MRI Dataset",
        "category": "DATA COLLECTION",
        "description": "Medical brain scan images used for disease diagnosis.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Healthcare Diagnosis AI"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_23.png"
    },
    {
        "id": "col_10",
        "name": "Medical Records Dataset",
        "category": "DATA COLLECTION",
        "description": "Clinical patient information used for healthcare analysis.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Healthcare Diagnosis AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_24.png"
    },
    {
        "id": "col_11",
        "name": "Genomic Dataset",
        "category": "DATA COLLECTION",
        "description": "Genetic information used for disease prediction and research.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Healthcare Diagnosis AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_25.png"
    },
    {
        "id": "col_12",
        "name": "Traffic Sensor Dataset",
        "category": "DATA COLLECTION",
        "description": "Traffic measurements used to monitor vehicle movement.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Traffic Flow Prediction System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_26.png"
    },
    {
        "id": "col_13",
        "name": "Camera Image Dataset",
        "category": "DATA COLLECTION",
        "description": "Image data used for computer vision applications.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Autonomous Navigation System",
                "Facial Recognition System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_27.png"
    },
    {
        "id": "col_14",
        "name": "LiDAR Dataset",
        "category": "DATA COLLECTION",
        "description": "3D spatial data used for navigation and mapping.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Autonomous Navigation System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_28.png"
    },
    {
        "id": "col_15",
        "name": "GPS Dataset",
        "category": "DATA COLLECTION",
        "description": "Location tracking data used for movement prediction.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Autonomous Navigation System",
                "Traffic Flow Prediction System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_29.png"
    },
    {
        "id": "col_16",
        "name": "Climate Records Dataset",
        "category": "DATA COLLECTION",
        "description": "Historical environmental data used for climate forecasting.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Climate Forecasting Model"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_30.png"
    },
    {
        "id": "col_17",
        "name": "Satellite Imagery Dataset",
        "category": "DATA COLLECTION",
        "description": "Earth observation images used for environmental monitoring.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Climate Forecasting Model"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_31.png"
    },
    {
        "id": "col_19",
        "name": "Energy Consumption Dataset",
        "category": "DATA COLLECTION",
        "description": "Records showing energy usage patterns.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Smart Energy Optimization System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_33.png"
    },
    {
        "id": "col_21",
        "name": "IoT Sensor Dataset",
        "category": "DATA COLLECTION",
        "description": "Data collected from connected smart devices.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Smart Energy Optimization System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_35.png"
    },
    {
        "id": "col_22",
        "name": "Social Media Posts Dataset",
        "category": "DATA COLLECTION",
        "description": "User-generated content collected from social platforms.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Social Media Moderation AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_36.png"
    },
    {
        "id": "col_23",
        "name": "Text Corpus Dataset",
        "category": "DATA COLLECTION",
        "description": "Large collections of text used for language models.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Social Media Moderation AI",
                "Voice Assistant AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_37.png"
    },
    {
        "id": "col_25",
        "name": "Speech Corpus Dataset",
        "category": "DATA COLLECTION",
        "description": "Structured speech data used for voice AI training.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Voice Assistant AI"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_39.png"
    },
    {
        "id": "col_27",
        "name": "Customer Support Conversations Dataset",
        "category": "DATA COLLECTION",
        "description": "Chat and support interactions used for chatbot training.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Customer Support Chatbot"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_41.png"
    },
    {
        "id": "col_29",
        "name": "Support Tickets Dataset",
        "category": "DATA COLLECTION",
        "description": "Customer issue reports used for support automation.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Customer Support Chatbot"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_43.png"
    },
    {
        "id": "col_30",
        "name": "Cybersecurity Logs Dataset",
        "category": "DATA COLLECTION",
        "description": "Security event records used for threat detection.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Cybersecurity Threat Detection"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_44.png"
    },
    {
        "id": "col_31",
        "name": "Network Traffic Dataset",
        "category": "DATA COLLECTION",
        "description": "Network communication data used for cybersecurity analysis.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Cybersecurity Threat Detection"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_45.png"
    },
    {
        "id": "col_33",
        "name": "Facial Image Dataset",
        "category": "DATA COLLECTION",
        "description": "Face images used for recognition and verification systems.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Facial Recognition System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_47.png"
    },
    {
        "id": "col_35",
        "name": "Video Frame Dataset",
        "category": "DATA COLLECTION",
        "description": "Extracted video images used for computer vision tasks.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "Facial Recognition System",
                "Autonomous Navigation System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_49.png"
    },
    {
        "id": "col_37",
        "name": "Candidate CV Dataset",
        "category": "DATA COLLECTION",
        "description": "Applicant resumes used for recruitment analysis.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "AI-Powered Recruitment System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_51.png"
    },
    {
        "id": "col_39",
        "name": "Interview Feedback Dataset",
        "category": "DATA COLLECTION",
        "description": "Interview assessment data used for recruitment decisions.",
        "ipValue": 10,
        "synergy": {
            "objective": [
                "AI-Powered Recruitment System"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_53.png"
    },
    {
        "id": "prep_1",
        "name": "Remove Duplicates",
        "category": "DATA PREPARATION",
        "description": "Eliminates repeated records to improve data quality and prevent biased results.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_54.png"
    },
    {
        "id": "prep_2",
        "name": "Handle Missing Values",
        "category": "DATA PREPARATION",
        "description": "Fills, replaces, or removes incomplete data to ensure reliable model training.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_55.png"
    },
    {
        "id": "prep_3",
        "name": "Class Balancing",
        "category": "DATA PREPARATION",
        "description": "Adjusts class distributions so the model learns fairly from all categories.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_56.png"
    },
    {
        "id": "prep_4",
        "name": "Normalize Data",
        "category": "DATA PREPARATION",
        "description": "Scales data into a consistent range to improve model performance and stability.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_57.png"
    },
    {
        "id": "prep_5",
        "name": "Remove Noise",
        "category": "DATA PREPARATION",
        "description": "Filters out irrelevant, corrupted, or misleading information from the dataset.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_58.png"
    },
    {
        "id": "prep_6",
        "name": "Data Quality Check",
        "category": "DATA PREPARATION",
        "description": "Verifies data accuracy, consistency, completeness, and reliability before analysis.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_59.png"
    },
    {
        "id": "prep_7",
        "name": "Data Transformation",
        "category": "DATA PREPARATION",
        "description": "Converts data into a suitable format or structure for machine learning tasks.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_60.png"
    },
    {
        "id": "prep_8",
        "name": "Feature Encoding",
        "category": "DATA PREPARATION",
        "description": "Converts categorical values into numerical representations that models can understand.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_61.png"
    },
    {
        "id": "prep_9",
        "name": "Outlier Removal",
        "category": "DATA PREPARATION",
        "description": "Identifies and removes unusual data points that may negatively impact model performance.",
        "ipValue": 10,
        "image": "/cards/engineer_cards/eng_62.png"
    },
    {
        "id": "feat_1",
        "name": "Feature Selection",
        "category": "FEATURE ENGINEERING",
        "description": "Chooses the most important variables that contribute to model performance.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_63.png"
    },
    {
        "id": "feat_2",
        "name": "PCA",
        "category": "FEATURE ENGINEERING",
        "description": "Reduces data dimensions while preserving the most important information.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_64.png"
    },
    {
        "id": "feat_3",
        "name": "Feature Scaling",
        "category": "FEATURE ENGINEERING",
        "description": "Standardizes feature values to ensure fair comparison during training.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_65.png"
    },
    {
        "id": "feat_4",
        "name": "Feature Creation",
        "category": "FEATURE ENGINEERING",
        "description": "Generates new features from existing data to improve predictive power.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_66.png"
    },
    {
        "id": "feat_5",
        "name": "Feature Extraction",
        "category": "FEATURE ENGINEERING",
        "description": "Identifies and captures meaningful patterns from raw data.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_67.png"
    },
    {
        "id": "feat_6",
        "name": "Text Vectorization",
        "category": "FEATURE ENGINEERING",
        "description": "Converts text into numerical representations that machine learning models can process.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_68.png"
    },
    {
        "id": "feat_7",
        "name": "Date Feature Expansion",
        "category": "FEATURE ENGINEERING",
        "description": "Extracts useful information such as year, month, day, or season from dates.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_69.png"
    },
    {
        "id": "feat_8",
        "name": "Aggregated Features",
        "category": "FEATURE ENGINEERING",
        "description": "Combines multiple values into summary metrics such as averages, totals, or counts.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_70.png"
    },
    {
        "id": "sel_1",
        "name": "Logistic Regression",
        "category": "MODEL SELECTION",
        "description": "A statistical machine learning model used to classify data into categories.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Credit Risk Assessment AI",
                "Customer Support Chatbot"
            ],
            "bonusIP": 5
        },
        "image": "/cards/engineer_cards/eng_71.png"
    },
    {
        "id": "sel_2",
        "name": "Random Forest",
        "category": "MODEL SELECTION",
        "description": "An ensemble model that combines multiple decision trees to improve prediction accuracy.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "E-Commerce Pricing AI",
                "AI-Powered Recruitment System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_72.png"
    },
    {
        "id": "sel_3",
        "name": "XGBoost",
        "category": "MODEL SELECTION",
        "description": "A powerful gradient boosting algorithm widely used for structured and tabular data.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Fraud Detection System",
                "Credit Risk Assessment AI"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_73.png"
    },
    {
        "id": "sel_4",
        "name": "KNN",
        "category": "MODEL SELECTION",
        "description": "Predicts outcomes based on the similarity of nearby data points.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Recommendation Engine"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_74.png"
    },
    {
        "id": "sel_5",
        "name": "CNN",
        "category": "MODEL SELECTION",
        "description": "A deep learning model specialized for image recognition and computer vision tasks.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Healthcare Diagnosis AI",
                "Autonomous Navigation System",
                "Facial Recognition System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_75.png"
    },
    {
        "id": "sel_6",
        "name": "LightGBM",
        "category": "MODEL SELECTION",
        "description": "A fast and efficient gradient boosting framework designed for large datasets.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Fraud Detection System",
                "E-Commerce Pricing AI"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_76.png"
    },
    {
        "id": "sel_7",
        "name": "LSTM",
        "category": "MODEL SELECTION",
        "description": "A neural network designed to learn patterns in sequential and time-series data.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Climate Forecasting Model",
                "Traffic Flow Prediction System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_77.png"
    },
    {
        "id": "sel_8",
        "name": "Transformer",
        "category": "MODEL SELECTION",
        "description": "An attention-based deep learning model widely used for natural language processing tasks.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Voice Assistant AI",
                "Customer Support Chatbot"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_78.png"
    },
    {
        "id": "sel_9",
        "name": "Vision Transformer (ViT)",
        "category": "MODEL SELECTION",
        "description": "A transformer architecture adapted for image classification and computer vision applications.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Facial Recognition System",
                "Autonomous Navigation System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_79.png"
    },
    {
        "id": "sel_10",
        "name": "Reinforcement Learning Agent",
        "category": "MODEL SELECTION",
        "description": "An AI model that learns optimal actions through rewards and penalties.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Autonomous Navigation System",
                "Smart Energy Optimization System"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_80.png"
    },
    {
        "id": "sel_11",
        "name": "BERT",
        "category": "MODEL SELECTION",
        "description": "A language model designed to understand context and meaning within text.",
        "ipValue": 20,
        "synergy": {
            "objective": [
                "Social Media Moderation AI",
                "Customer Support Chatbot"
            ],
            "bonusIP": 10
        },
        "image": "/cards/engineer_cards/eng_81.png"
    },
    {
        "id": "trn_1",
        "name": "Fine Tuning",
        "category": "MODEL TRAINING",
        "description": "Adapts a pre-trained model to perform better on a specific task or dataset.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_82.png"
    },
    {
        "id": "trn_2",
        "name": "Transfer Learning",
        "category": "MODEL TRAINING",
        "description": "Reuses knowledge learned from an existing model to accelerate learning on a new task.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_83.png"
    },
    {
        "id": "trn_3",
        "name": "Hyperparameter Tuning",
        "category": "MODEL TRAINING",
        "description": "Optimizes model settings such as learning rate and batch size to improve performance.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_84.png"
    },
    {
        "id": "trn_4",
        "name": "Ensemble Learning",
        "category": "MODEL TRAINING",
        "description": "Combines multiple models to produce more accurate and reliable predictions.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_85.png"
    },
    {
        "id": "trn_5",
        "name": "Data Augmentation",
        "category": "MODEL TRAINING",
        "description": "Creates additional training data by modifying existing samples to improve model generalization.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_86.png"
    },
    {
        "id": "trn_6",
        "name": "Early Stopping",
        "category": "MODEL TRAINING",
        "description": "Stops training when performance stops improving to prevent overfitting.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_87.png"
    },
    {
        "id": "trn_7",
        "name": "Learning Rate Scheduling",
        "category": "MODEL TRAINING",
        "description": "Adjusts the learning rate during training to improve convergence and stability.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_88.png"
    },
    {
        "id": "trn_8",
        "name": "Active Learning",
        "category": "MODEL TRAINING",
        "description": "Selects the most informative data samples for labeling and training to improve efficiency.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_89.png"
    },
    {
        "id": "eval_1",
        "name": "Accuracy Evaluation",
        "category": "MODEL EVALUATION",
        "description": "Measures the percentage of correct predictions made by the model.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_90.png"
    },
    {
        "id": "eval_2",
        "name": "Precision Evaluation",
        "category": "MODEL EVALUATION",
        "description": "Measures how many positive predictions made by the model are actually correct.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_91.png"
    },
    {
        "id": "eval_3",
        "name": "Recall Evaluation",
        "category": "MODEL EVALUATION",
        "description": "Measures how many actual positive cases the model successfully identifies.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_92.png"
    },
    {
        "id": "eval_4",
        "name": "F1 Score Evaluation",
        "category": "MODEL EVALUATION",
        "description": "Combines precision and recall into a single metric to assess overall classification performance.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_93.png"
    },
    {
        "id": "eval_5",
        "name": "ROC-AUC Evaluation",
        "category": "MODEL EVALUATION",
        "description": "Measures the model's ability to distinguish between different classes across multiple thresholds.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_94.png"
    },
    {
        "id": "eval_6",
        "name": "Cross Validation",
        "category": "MODEL EVALUATION",
        "description": "Tests model performance across multiple data splits to ensure reliability and generalization.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_95.png"
    },
    {
        "id": "eval_7",
        "name": "Confusion Matrix Analysis",
        "category": "MODEL EVALUATION",
        "description": "Visualizes prediction results by showing correct and incorrect classifications for each class.",
        "ipValue": 15,
        "image": "/cards/engineer_cards/eng_96.png"
    },
    {
        "id": "dep_1",
        "name": "FastAPI Deployment",
        "category": "DEPLOYMENT",
        "description": "Deploys an AI model through a high-performance API for real-time predictions and integration.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_97.png"
    },
    {
        "id": "dep_2",
        "name": "Streamlit Deployment",
        "category": "DEPLOYMENT",
        "description": "Deploys an AI model as an interactive web application for users to test and explore.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_98.png"
    },
    {
        "id": "dep_3",
        "name": "Flask API Deployment",
        "category": "DEPLOYMENT",
        "description": "Deploys an AI model through a lightweight web API that applications can access.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_99.png"
    },
    {
        "id": "dep_4",
        "name": "AWS Deployment",
        "category": "DEPLOYMENT",
        "description": "Deploys AI systems to cloud infrastructure for scalable and reliable operation.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_100.png"
    },
    {
        "id": "dep_5",
        "name": "Mobile App Deployment",
        "category": "DEPLOYMENT",
        "description": "Integrates an AI model into a mobile application for on-device or cloud-powered use.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_101.png"
    },
    {
        "id": "dep_6",
        "name": "Edge Device Deployment",
        "category": "DEPLOYMENT",
        "description": "Deploys AI models directly onto local devices for faster and offline decision-making.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_102.png"
    },
    {
        "id": "dep_7",
        "name": "Docker Deployment",
        "category": "DEPLOYMENT",
        "description": "Packages AI systems into portable containers that can run consistently across different environments.",
        "ipValue": 25,
        "image": "/cards/engineer_cards/eng_103.png"
    }
];

export const ENGINEER_CARDS: EngineerCard[] = applyEngineerCategoryIpToDeck(ENGINEER_CARDS_RAW);

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function stripLegacyCardImages(cards: EngineerCard[]): EngineerCard[] {
    return cards.map(({ image: _image, ...card }) => card);
}

export { MILESTONE_CARDS } from "./milestones";
export { ENGINEER_CATEGORY_IP } from "./ipValues";
export {
  expandEngineerDeck,
  getCardCopyCount,
  getCardRarity,
  getExpandedDeckByCategory,
  FULL_GAME_SET_TARGET,
  OBJECTIVE_DECK_SIZE,
  MILESTONE_DECK_SIZE,
  RETAIL_ENGINEER_DECK_TARGET,
} from "./deckCopies";

export const OBJECTIVE_DECK = ENGINEER_CARDS.filter(
    (c) => c.category === "SYSTEM OBJECTIVE"
);

export const PLAYABLE_ENGINEER_CARDS = ENGINEER_CARDS.filter(
    (c) => c.category !== "SYSTEM OBJECTIVE"
);

export const RETAIL_ENGINEER_DECK = expandEngineerDeck(PLAYABLE_ENGINEER_CARDS);

export const RETAIL_ENGINEER_DECK_SIZE = RETAIL_ENGINEER_DECK.length;

export const FULL_GAME_SET_SIZE =
  RETAIL_ENGINEER_DECK_SIZE + OBJECTIVE_DECK.length + MILESTONE_CARDS.length;

export const getRandomObjective = (): EngineerCard => {
    const picked = OBJECTIVE_DECK[Math.floor(Math.random() * OBJECTIVE_DECK.length)];
    const { image: _image, ...objective } = picked;
    return objective;
};

export const getInitialDeck = () => {
    return shuffleArray(stripLegacyCardImages([...RETAIL_ENGINEER_DECK]));
};

export const createObjectiveDeck = () =>
    shuffleArray(stripLegacyCardImages([...OBJECTIVE_DECK]));

export const createMilestoneDeck = () =>
    shuffleArray(
        MILESTONE_CARDS.map(({ image: _image, ...card }) => card)
    );

export function pairMilestoneFromDeck(
    milestoneDeck: EngineerCard[],
    objectiveName: string
): { milestone: EngineerCard | null; deck: EngineerCard[] } {
    const template = getMilestoneForObjective(objectiveName);
    if (!template) return { milestone: null, deck: milestoneDeck };

    const idx = milestoneDeck.findIndex((m) => m.name === template.name);
    if (idx === -1) {
        const { image: _image, ...milestone } = template;
        return { milestone, deck: milestoneDeck };
    }

    const deck = [...milestoneDeck];
    const milestone = deck.splice(idx, 1)[0];
    return { milestone, deck };
}
