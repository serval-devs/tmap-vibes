from unittest.mock import patch, MagicMock
import sys
import os

sys.path.append(os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), '..')))  # noqa: E402
from tf_model_handler import (  # noqa: E402
    load_model_and_tokenizer,  # noqa: E402
    true_or_fake  # noqa: E402
)  # noqa: E402


@patch("pickle.load")
@patch("builtins.open")
@patch("tf_model_handler.load_model")
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


@patch("tf_model_handler.load_model_and_tokenizer")
@patch("tf_model_handler.pad_sequences")
def test_result(

                    mock_pad_sequences,
                    mock_load_model_and_tokenizer):
    mock_model = MagicMock()
    mock_tokenizer = MagicMock()

    mock_tokenizer.texts_to_sequences.return_value = [[1, 2, 3]]

    mock_pad_sequences.return_value = [[1, 2, 3]]

    mock_model.predict.return_value = [[0.9]]

    text = ["Example input text"]

    true_or_fake(mock_model, mock_tokenizer, text)


def test_result_true():
    model, tokenizer = load_model_and_tokenizer(
        "./Backend/MLModels/FakeTrueModel.keras",
        "./Backend/MLModels/tokenizer.pkl"
    )

    text = [
        (
            "NBCNEWS (Guo) - The China Film Administration said it will "
            "“moderately” reduce the number of American films it imports, "
            "state-run broadcaster CCTV News reported today. “The U.S. "
            "government’s wrongful imposition of tariffs on China would "
            "inevitably further reduce domestic audiences’ favorable "
            "perception of American movies,” CCTV cited a spokesperson "
            "from the agency as saying. The agency said it will follow "
            "market rules and “moderately” reduce the number of American "
            "movie imports. “As the world’s second-largest film market, "
            "China remains committed to high-level openness and will "
            "introduce excellent films from more countries to meet market "
            "demand,” it said, according to the report. China will reduce "
            "import of American movies, continued China, which frequently "
            "trades places with North America as the world’s largest box "
            "office, is a crucial market for Hollywood films. U.S. movies "
            "have already been declining in popularity in recent years as "
            "U.S.-China trade tensions have escalated. There were no "
            "Hollywood films among China’s 10 highest-grossing movies in "
            "2023, in stark contrast to 2012, when seven of the top 10 "
            "highest-grossing movies were U.S.-made, according to Maoyan, "
            "a Chinese movie-ticketing and data platform."
        )
    ]

    prediction = true_or_fake(model, tokenizer, text)

    assert prediction[0][0] > 0.8, (
        f"Expected prediction to be > 0.8 (True), but got {prediction[0][0]}"
    )


def test_result_fake():
    model, tokenizer = load_model_and_tokenizer(
        "./Backend/MLModels/FakeTrueModel.keras",
        "./Backend/MLModels/tokenizer.pkl"
    )

    prediction = true_or_fake(
                            model,
                            tokenizer,
                            [
                                (
                                    "THIS IS DEFINITLY NOT FAKE NEWS"
                                    " - SOURCE: TRUST ME BRO"
                                )
                            ]
                            )
    assert prediction[0][0] < 0.5, (
        f"Expected prediction to be < 0.5 (false), but got "
        f"{prediction[0][0]}"
    )
