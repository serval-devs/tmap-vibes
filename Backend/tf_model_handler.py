import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


def load_model_and_tokenizer(model_path, tokenizer_path):
    model = load_model(model_path)

    with open(tokenizer_path, "rb") as handle:
        tokenizer = pickle.load(handle)
    return model, tokenizer


def validate_text_content(article: list, tokenizer) -> None:
    if not article or len(article) != 1 or not isinstance(article[0], str):
        raise TypeError("Article must be a list containing one string.")
    if not article[0].strip():
        raise ValueError("Article must not be empty.")
    seq = tokenizer.texts_to_sequences(article)
    if len(seq[0]) > 325:
        raise ValueError("Article is too long (more than 300 tokens).")


def true_or_fake(
            model,
            tokenizer,
            text,
            max_len=325):
    validate_text_content(text, tokenizer)

    seq = tokenizer.texts_to_sequences(text)
    pad = pad_sequences(seq, maxlen=max_len, padding='post')

    prediction = model.predict(pad)
    return prediction
