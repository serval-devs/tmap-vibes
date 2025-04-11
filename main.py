from Backend.tf_model_handler import load_model_and_tokenizer, quick_test
from TensorflowModel.tensorflow_model import  create_new_model

create_new_model(
        FakeDataPath="./dataset/Fake.csv",
        TrueDataPath="./dataset/True.csv",
        kerasPath="./MLModels/FakeTrueModel.keras",
        tokenizerPath="./MLModels/tokenizer.pkl")

# Load model and tokenizer
model, tokenizer = load_model_and_tokenizer(
                                        "./MLModels/FakeTrueModel.keras",
                                        "./MLModels/tokenizer.pkl")

# Test the model
quick_test(
        model,
        tokenizer,
        ["President signs new climate change"
            "bill into law, aiming to reduce emissions by 30%."])


