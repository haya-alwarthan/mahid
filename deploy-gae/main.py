import mimetypes

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

import json
from json import JSONDecodeError

from flask import Flask, request, render_template, jsonify, url_for, send_from_directory
from langchain import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser, OutputFixingParser, RetryWithErrorOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain.prompts.chat import SystemMessage, HumanMessagePromptTemplate
from dotenv import load_dotenv
import os
from flask_cors import CORS
from langchain.schema import OutputParserException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from bson import ObjectId
from format.roadmap import Roadmap, StepDetails
from utils.errors import InputError, ApiError, ParsingError, UnknownError, DBError
from utils.utils import parse_json
from utils.yt_api import get_vids

# Get environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
DB_URL = os.getenv('DATABASE_URL')
DB_NAME = os.getenv('DATABASE_NAME')

# Instantiate connections
client = MongoClient(DB_URL, server_api=ServerApi('1'))
db = client[DB_NAME]

llm = ChatOpenAI(temperature=0, model_name='gpt-3.5-turbo-16k', request_timeout=120)

app = Flask(__name__, static_folder='static', template_folder='static')
CORS(app)


@app.errorhandler(ApiError)
def handle_exception(e):
    print(e)
    return e.response(), e.status_code


@app.route('/')
@app.route('/roadmap')
@app.route('/step')
def get_main():
    return render_template("index.html")


@app.route('/get_roadmap/', methods=['GET'])
def get_roadmap():
    # TODO: Add error handling later
    # Checking if the title is already existing in DB, if not then
    #   - Make a new request to OpenAI
    #   - Create a new record with the response u received in the DB

    # Get roadmap title from the request
    args = request.args
    dic = args.to_dict()
    title = dic['title']
    if title is None:
        raise (InputError("Empty Input"))
    try:

        # Fetch from db
        res = db.roadmaps.find_one({'term': title})
    except ServerSelectionTimeoutError:
        raise DBError('Connection failed due to server timeout') from None


    except Exception:
        raise UnknownError('Unknown error') from None

    # if there is no similar record, then make a request to OpenAI API then store the results in the DB
    if res is None:

        parser = PydanticOutputParser(pydantic_object=Roadmap)
        prompt_template = PromptTemplate(
            template=
            "You are a helpful assistant that generate a roadmap to any hobby, profession, or a field"
            "to be pursued by the user. You should outline the steps needed to achieve this goal "
            "by providing a title for the step, and a very brief description "
            "The language should be Arabic, except for nouns or entities that are of English origin"
            "Avoid being generic and break down the steps to be forked as much as possible"
            "if the given input is not written in natural language (Arabic or English) return an empty string "
            "\n{format_instructions}",
            input_variables=[],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        template = ChatPromptTemplate.from_messages(
            [
                SystemMessage(
                    content=(
                        prompt_template.format()
                    )
                ),
                HumanMessagePromptTemplate.from_template("{text}"),
            ]
        )

        _input = template.format_messages(text=title)
        output = llm(_input)
        if output.content is None or len(output.content) < 3:
            raise InputError('Invalid input')
        try:
            cleaned = json.loads(output.content)
            cleaned.update({'term': title})
            db.roadmaps.insert_one(cleaned)
            res = db.roadmaps.find_one({'term': title})
        except JSONDecodeError as e:
            raise ParsingError("Json Decoding Error: ".format(e))

        except Exception as e:
            raise UnknownError("Unknown Error: {}".format(e))

    # parse bson
    try:
        res = parse_json(res)
    except Exception as e:
        raise ParsingError(e)

    return {
        'statusCode': 200,
        'body': res
    }


@app.route('/get_title/', methods=['GET'])
def wrap_title():
    args = request.args
    dic = args.to_dict()
    desc = dic['desc']
    if desc is None:
        raise (InputError("Empty Input"))
    template = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content=(
                    "You are a helpful assistant that re-writes the user's text,"
                    "whether it was a question or long description"
                    "into a brief words that expresses a profession, field or a hobby."
                    "do not alter the user input or try to generalize"
                    "if the input is precise enough, leave it as it is. "
                    "Do not ever reply with 'sorry couldn't understand the input' or similar message"
                    "try to summarize the input with maximum of of four words at all costs"
                    "if the input was not understandable, return an empty string"
                    "if the input has sexual or suicidal tendencies, return an empty string"

                )
            ),
            HumanMessagePromptTemplate.from_template("{text}"),
        ]
    )
    output = llm(template.format_messages(text=desc))
    try:
        content = output.content
        if content is None or content == '' or len(content.split()) > 5:
            raise (InputError("Invalid Input"))
    except Exception as e:
        raise (InputError("Invalid Input"))

    return {
        'statusCode': 200,
        'body': output.content
    }


# Check if a similar record already exists in DB
# the reocrd should be in roadmap_x -> step_y -> details
# If there is, return it
# If there is not,  make a request to openai api then store the results in db and return it


@app.route('/get_details/', methods=['GET'])
def get_details(details=None):
    args = request.args
    dic = args.to_dict()
    res = {}
    [roadmap_id, step_order] = [dic['id'], dic['order']]

    # Validate the url params
    if not isinstance(int(step_order), int) or int(step_order) < 1:
        raise InputError("Invalid type of the input")

    # Validate the existence of roadmap in DB
    step_order = int(step_order) - 1
    try:
        res = db.roadmaps.find_one({'_id': ObjectId(roadmap_id)})

        if res is None:
            raise (DBError("No such a record"))
    except ServerSelectionTimeoutError:
        raise DBError('Connection failed due to server timeout') from None

    except Exception:
        raise UnknownError('Unknown error') from None

    # Check if the details field has already been created
    try:
        step = res['steps'][step_order]
        if 'details' in step:
            return {
                'statusCode': 200,
                'body': step
            }
    except IndexError as e:
        raise (InputError('Index out of bound error'))

    # Now we have to create the details given the step description
    desc = step['desc']

    # Make a request to Openai API
    parser = PydanticOutputParser(pydantic_object=StepDetails)
    prompt_template = PromptTemplate(
        template=
        "You are a helpful assistant that provides a long detailed guide to the user brief description,"
        "the content should serve as a comprehensive tutorial with minimum of 250 words "
        "Moreover, You should provide a at most five keywords that highlight the important aspect of the step."
        "In addition, you will provide linked resources related to the topic from different websites except youtube"
        # "finally,you will provide some links of the most proficient people of this field  "
        # "if the input was not fathomable, return an empty string"
        # "if the given input is not written in natural language (Arabic or English) return an empty string "
        "\n{format_instructions}",
        # "The properties in the output should content, keywords, and resources (in English)",
        input_variables=[],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    template = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content=(
                    prompt_template.format()
                )
            ),
            HumanMessagePromptTemplate.from_template("{desc}"),
        ]
    )

    _input = template.format_messages(desc=desc)
    output = llm(_input)
    try:
        # Parse the LLM output

        fix_parser = OutputFixingParser.from_llm(parser=parser, llm=llm)
        cleaned = fix_parser.parse(output.content)

        cleaned = vars(cleaned)
        keywords = cleaned['keywords'].copy()
        keywords.extend(('tutorial', 'guide'))
        vids = get_vids(keywords)
        cleaned.update({'videos': vids})
        # Update DB
        result = db.roadmaps.update_one(
            {'_id': ObjectId(roadmap_id), "steps.order": step_order + 1},
            {'$set': {'steps.$.details': cleaned}}
        )

        if result.matched_count <= 0:
            raise DBError('Update operation was unsuccessful')
        res = db.roadmaps.find_one({'_id': ObjectId(roadmap_id)})
        res = res['steps'][step_order]


    except OutputParserException as e:
        # print("langchain error : ".format(e))
        retry_parser = RetryWithErrorOutputParser.from_llm(llm=llm, parser=parser)
        cleaned = retry_parser.parse_with_prompt(output.content, _input)
        raise ParsingError('langchain parsing') from None

    except JSONDecodeError as e:
        raise ParsingError(e) from None

    except PyMongoError as e:
        raise DBError(e) from None
    except Exception as e:
        raise UnknownError('Unknown error') from None

    return {
        'statusCode': 200,
        'body': res
    }


@app.route("/_ah/warmup")
def warmup():
    return "", 200, {}

# if __name__ == '__main__':
#     HOST = '0.0.0.0'
#     PORT = 8080
#     app.run(HOST, PORT, debug=False)
