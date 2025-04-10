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


def validate_text_content(article: str) -> None:
    if not article or not article.strip():
        raise ValueError("Article must not be empty.")
    if not isinstance(article, str):
        raise TypeError("Article must be a string.")
    if len(article) > 300:
        raise ValueError("Article is too long")


def true_or_false(
            model,
            tokenizer,
            text,
            max_len=300):
    validate_text_content(text)

    seq = tokenizer.texts_to_sequences(text)
    pad = pad_sequences(seq, maxlen=max_len, padding='post')

    prediction = model.predict(pad)
#    return prediction
    print(prediction[0][0]*100)
    print("Real News" if prediction[0][0] > 0.5 else "Fake News")
