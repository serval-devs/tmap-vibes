import pandas as pd
import pickle
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Dense, Flatten
from sklearn.model_selection import train_test_split


def write_model(
                model,
                tokenizer,
                kerasPath,
                tokenizerPath
                ):
    model.save(kerasPath)
    with open(tokenizerPath, "wb") as handle:
        pickle.dump(tokenizer, handle)


def train_model(
                    FakeDataPath,
                    TrueDataPath):
    # Step 1: Load the dataset
    # Load real and fake news datasets from CSV files
    df_real = pd.read_csv(TrueDataPath)
    df_fake = pd.read_csv(FakeDataPath)

    df_real['text'] = df_real['text'].fillna('')
    df_fake['text'] = df_fake['text'].fillna('')
    # Assign labels: 1 for real news, 0 for fake news
    df_real['label'] = 1
    df_fake['label'] = 0

    # Combine both datasets into one DataFrame and reset index
    df = pd.concat([df_real, df_fake], axis=0).reset_index(drop=True)

    # Step 2: Prepare the data
    # Extract text (X) and labels (y)
    X = df['text']
    y = df['label']

    # Split the dataset into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
                                                        X,
                                                        y,
                                                        test_size=0.2,
                                                        random_state=42)

    # Step 3: Tokenization and text preprocessing
    # Create a tokenizer with a vocabulary size of 5000 words
    tokenizer = Tokenizer(num_words=5000)
    tokenizer.fit_on_texts(X_train)  # Learn word indexes from training data

    # Convert text to sequences (lists of word indices)
    X_train_seq = tokenizer.texts_to_sequences(X_train)
    X_test_seq = tokenizer.texts_to_sequences(X_test)

    # Define a maximum length for sequences (truncate longer texts)
    max_len = 325

    # Pad sequences to ensure they all have the same length
    X_train_pad = pad_sequences(X_train_seq, maxlen=max_len, padding='post')
    X_test_pad = pad_sequences(X_test_seq, maxlen=max_len, padding='post')

    # Step 4: Build the Neural Network Model
    model = Sequential([
        # Embedding layer converts word indices into dense vectors
        Embedding(input_dim=5000, output_dim=32),

        # Flatten layer converts 2D input (word embeddings) into 1D
        Flatten(),

        # Hidden dense layer with ReLU activation
        Dense(10, activation='relu'),

        # Output layer with sigmoid activation (binary classification)
        Dense(1, activation='sigmoid')
    ])

    # Compile the model with Adam optimizer and binary cross-entropy loss
    model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy'])

    # Step 5: Train the model
    # Train for 5 epochs with batch size of 32, using validation data
    model.fit(
            X_train_pad,
            y_train,
            epochs=5,
            batch_size=32,
            validation_data=(X_test_pad, y_test))

    return model, tokenizer
