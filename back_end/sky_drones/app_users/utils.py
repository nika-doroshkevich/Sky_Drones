from enum import Enum


class UserStatuses(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class UserRoles(Enum):
    EMPLOYEE = 'EMPLOYEE'
    CUSTOMER = 'CUSTOMER'
    EMPLOYEE_OWNER = 'EMPLOYEE_OWNER'
    CUSTOMER_OWNER = 'CUSTOMER_OWNER'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
