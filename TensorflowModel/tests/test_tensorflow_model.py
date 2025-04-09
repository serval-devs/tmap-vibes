import sys
import os

sys.path.append(os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), '..')))  # noqa: E402
from tensorflow_model import create_new_model  # noqa: E402


def test_create_new_model(tmp_path):
    curr_dir = os.path.dirname(__file__)
    dataset_dir = os.path.join(curr_dir, "test_dataset")
    real_data = os.path.join(dataset_dir, "True.csv")
    fake_data = os.path.join(dataset_dir, "Fake.csv")

    keras_model_path = tmp_path / "FakeTrueModel.keras"
    tokenizer_path = tmp_path / "tokenizer.pkl"

    create_new_model(
        FakeDataPath=fake_data,
        TrueDataPath=real_data,
        kerasPath=str(keras_model_path),
        tokenizerPath=str(tokenizer_path)
    )

    assert keras_model_path.exists(), "Model file was not created."
    assert tokenizer_path.exists(), "Tokenizer file was not created."
