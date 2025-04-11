import sys
import os
import pandas as pd
import pytest


sys.path.append(os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), '..')))  # noqa: E402
from tensorflow_model import train_model, write_model  # noqa: E402


def test_train_model_and_save(tmp_path):
    curr_dir = os.path.dirname(__file__)
    dataset_dir = os.path.join(curr_dir, "test_dataset")
    real_data = os.path.join(dataset_dir, "True.csv")
    fake_data = os.path.join(dataset_dir, "Fake.csv")

    model, tokenizer = train_model(
        FakeDataPath=fake_data,
        TrueDataPath=real_data
    )

    assert model is not None, "Model was not returned."
    assert tokenizer is not None, "Tokenizer was not returned."

    keras_model_path = tmp_path / "model.keras"
    tokenizer_path = tmp_path / "tokenizer.json"

    write_model(
                model,
                tokenizer,
                keras_model_path,
                tokenizer_path
                )
    
    assert keras_model_path.exists(), "Model file was not created."
    assert tokenizer_path.exists(), "Tokenizer file was not created."
