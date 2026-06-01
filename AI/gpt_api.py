import os
import openai
import pandas as pd
import json
from dotenv import load_dotenv
import tiktoken

# Load environment variables from the file
load_dotenv()

#토큰 수 계산 함수
def encoding_getter(encoding_type: str):
    return tiktoken.encoding_for_model(encoding_type)

def tokenizer(string: str, encoding_type: str) -> list:
    encoding = encoding_getter(encoding_type)
    tokens = encoding.encode(string)
    return tokens

def token_counter(string: str, encoding_type: str) -> int:
    num_tokens = len(tokenizer(string, encoding_type))
    return num_tokens

def token_check(text, max_tokens=3000):
    num_tokens = token_counter(text, "gpt-3.5-turbo")
    # num_tokens = token_counter(concatenated_text, "gpt-3.5-turbo")
    print("토큰 수: " + str(num_tokens))

    if num_tokens >= max_tokens:
        tokens = tokenizer(text, "gpt-3.5-turbo")
        text = encoding_getter("gpt-3.5-turbo").decode(tokens[:max_tokens])
        # print("readconcatenews_max", text)
        return text
    else:
        return text



    

