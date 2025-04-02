import FakeTrueMLModel as FTMLModel

# Train and save model
# FTMLModel.creat_new_model("./dataset/Fake.csv", "./dataset/True.csv")

# Load model and tokenizer
model, tokenizer = FTMLModel.load_model_and_tokenizer("./MLModels/FakeTrueModel.keras", "./MLModels/tokenizer.pkl")

# Test the model
FTMLModel.quick_test(model, tokenizer , ["President signs new climate change bill into law, aiming to reduce emissions by 30%."])