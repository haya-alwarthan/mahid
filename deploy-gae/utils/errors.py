from flask import Response


class ApiError(Exception):
    status_code: int

    def __init__(self, message):
        super(ApiError, self).__init__(message)
        self.message = message

    def response(self):
        return {'message': self.message, "status": self.status_code}


class InputError(ApiError):
    status_code = 400


class ParsingError(ApiError):
    status_code = 500


class UnknownError(ApiError):
    status_code = 500


class CustomTypeError(ApiError):
    status_code = 500


class DBError(ApiError):
    status_code = 500
