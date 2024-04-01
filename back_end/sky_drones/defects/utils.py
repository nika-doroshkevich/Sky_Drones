from enum import Enum


class DefectSeverity(Enum):
    CRITICAL = 'CRITICAL'
    MAJOR = 'MAJOR'
    MINOR = 'MINOR'
    TRIVIAL = 'TRIVIAL'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
