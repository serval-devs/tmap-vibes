import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


def load_model_and_tokenizer(model_path, tokenizer_path):
    # Load trained model
    model = load_model(model_path)
    print("Model loaded successfully.")

    # Load tokenizer
    with open(tokenizer_path, "rb") as handle:
        tokenizer = pickle.load(handle)
    print("Tokenizer loaded successfully.")

    return model, tokenizer


def quick_test(
            model,
            tokenizer,
            sample_text=[
                    "Breaking news! "
                    "The president resigns due to corruption charges."],
            max_len=300):

    sample_seq = tokenizer.texts_to_sequences(sample_text)
    sample_pad = pad_sequences(sample_seq, maxlen=max_len, padding='post')

    # Predict whether the news is real or fake
    prediction = model.predict(sample_pad)
    print("Real News" if prediction[0][0] > 0.5 else "Fake News")
