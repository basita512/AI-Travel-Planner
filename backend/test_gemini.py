import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: Missing GEMINI_API_KEY environment variable")
    print("Please update the .env file with your API key from https://aistudio.google.com/")
    exit(1)

# Configure Gemini
genai.configure(api_key=api_key)

def test_gemini_connection():
    try:
        # Test if we can list models
        models = genai.list_models()
        available_models = [model.name for model in models if 'generateContent' in model.supported_generation_methods]
        
        print("✅ Successfully connected to Gemini API!")
        print(f"Available models: {available_models}")
        
        # Check if gemini-1.5-flash is available
        if "gemini-1.5-flash" in str(available_models):
            print("✅ gemini-1.5-flash model is available")
        else:
            print("❌ Warning: gemini-1.5-flash model not found in available models")
            print("Available models:", available_models)
            
        # Test a simple generation
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Give me a short travel tip in one sentence")
        print("\nTest response from Gemini:")
        print(response.text)
        
        print("\nSetup is complete! You can now run the main.py file to start the server.")
        
    except Exception as e:
        print(f"❌ Error connecting to Gemini API: {str(e)}")
        print("Please check your API key and internet connection.")

if __name__ == "__main__":
    test_gemini_connection() 