from unittest.mock import patch, MagicMock
import sys
import os


sys.path.append(os.path.abspath(
                        os.path.join(
                            os.path.dirname(__file__), '..')))  # noqa: E402
from Backend.tf_model_handler import (  # noqa: E402
    load_model_and_tokenizer,  # noqa: E402
    quick_test  # noqa: E402
)  # noqa: E402


@patch("pickle.load")
@patch("builtins.open")
@patch("Backend.tf_model_handler.load_model")
def test_load_model_and_tokenizer(
                            mock_load_model,
                            mock_open,
                            mock_pickle_load):
    mock_model = MagicMock()
    mock_tokenizer = MagicMock()

    mock_load_model.return_value = mock_model
    mock_pickle_load.return_value = mock_tokenizer

    mock_open.return_value.__enter__.return_value = MagicMock()

    model_path = "fake_model_path"
    tokenizer_path = "fake_tokenizer_path"

    model, tokenizer = load_model_and_tokenizer(model_path, tokenizer_path)

    assert model == mock_model, "Model was not loaded correctly"
    assert tokenizer == mock_tokenizer, "Tokenizer was not loaded correctly"


@patch("Backend.tf_model_handler.load_model_and_tokenizer")
@patch("Backend.tf_model_handler.pad_sequences")
def test_result(
                    mock_pad_sequences,
                    mock_load_model_and_tokenizer):
    mock_model = MagicMock()
    mock_tokenizer = MagicMock()

    mock_tokenizer.texts_to_sequences.return_value = [[1, 2, 3]]

    mock_pad_sequences.return_value = [[1, 2, 3]]

    mock_model.predict.return_value = [[0.9]]

    quick_test(mock_model, mock_tokenizer)

def test_result_true(
                    
                    ):
