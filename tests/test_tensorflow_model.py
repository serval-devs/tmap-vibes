import sys
import os
import pandas as pd
import pytest

sys.path.append(os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), '..')))  # noqa: E402
from TensorflowModel.tensorflow_model import train_model, read_dataset  # noqa: E402


def test_read_dataset_loads_csv_correctly():
    test_file = os.path.join(os.path.dirname(__file__), "test_dataset", "True.csv")

    df = read_dataset(test_file)

    assert isinstance(df, pd.DataFrame), "Did not return a DataFrame"
    assert "text" in df.columns, "Missing expected 'text' column"

def test_read_dataset_raises_error_on_missing_file():
    with pytest.raises(FileNotFoundError):
        read_dataset("non_existent_file.csv")

def test_train_model(tmp_path):
    curr_dir = os.path.dirname(__file__)
    dataset_dir = os.path.join(curr_dir, "test_dataset")
    real_data = os.path.join(dataset_dir, "True.csv")
    fake_data = os.path.join(dataset_dir, "Fake.csv")

    keras_model_path = tmp_path / "FakeTrueModel.keras"
    tokenizer_path = tmp_path / "tokenizer.pkl"

    train_model(
        FakeDataPath=fake_data,
        TrueDataPath=real_data,
        kerasPath=str(keras_model_path),
        tokenizerPath=str(tokenizer_path)
    )

    assert keras_model_path.exists(), "Model file was not created."
    assert tokenizer_path.exists(), "Tokenizer file was not created."
