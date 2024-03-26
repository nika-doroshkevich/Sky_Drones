from enum import Enum


class FileStorageItemType(Enum):
    IMAGE = 'IMAGE'
    TEMPLATE = 'TEMPLATE'
    REPORT = 'REPORT'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
