export const titleOptions = [
    {value: "Mr", label: "Mr"},
    {value: "Ms", label: "Ms"},
    {value: "Mx", label: "Mx"},
];

export const facilityTypeOptions = [
    {value: "Aircraft", label: "Aircraft"},
    {value: "Airport", label: "Airport"},
    {value: "Bridges", label: "Bridges"},
    {value: "Buildings", label: "Buildings"},
    {value: "Commercial Buildings", label: "Commercial Buildings"},
    {value: "Construction", label: "Construction"},
    {value: "Cranes", label: "Cranes"},
    {value: "Dam", label: "Dam"},
    {value: "Drilling Heads", label: "Drilling Heads"},
    {value: "Electrical Pylons", label: "Electrical Pylons"},
    {value: "Factories", label: "Factories"},
    {value: "Mining Site", label: "Mining Site"},
    {value: "Motorways", label: "Motorways"},
    {value: "Nuclear", label: "Nuclear"},
    {value: "Other", label: "Other"},
    {value: "Pipeline", label: "Pipeline"},
    {value: "Power Station", label: "Power Station"},
    {value: "Railway", label: "Railway"},
    {value: "Refineries", label: "Refineries"},
    {value: "Solar Farms & Panels", label: "Solar Farms & Panels"},
    {value: "Stockpile", label: "Stockpile"},
    {value: "Storage Tanks", label: "Storage Tanks"},
    {value: "Substation", label: "Substation"},
    {value: "Telecom Tower & Mobile Cell Sites", label: "Telecom Tower & Mobile Cell Sites"},
    {value: "Tunnels", label: "Tunnels"},
    {value: "Wind Turbines", label: "Wind Turbines"},
];

export const inspectionPriorityOptions = [
    {value: "HIGH", label: "HIGH"},
    {value: "MEDIUM", label: "MEDIUM"},
    {value: "LOW", label: "LOW"},
];

export const defectSeverityOptions = [
    {value: "CRITICAL", label: "CRITICAL"},
    {value: "MAJOR", label: "MAJOR"},
    {value: "MINOR", label: "MINOR"},
    {value: "TRIVIAL", label: "TRIVIAL"},
];

export enum InspectionStatus {
    CREATED = "CREATED",
    IN_PROCESS = "IN_PROCESS",
    DONE = "DONE"
}

interface ScaledLineWidth {
    [key: number]: number;
}

export const scaledLineWidth: ScaledLineWidth = {
    1: 1.3,
    2: 2.3,
    3: 3.3,
    4: 4.5,
    5: 7,
    6: 8.4,
    7: 9.1,
    8: 10.1,
    9: 11.7,
    10: 13,
    11: 14.1,
    12: 15.2,
    13: 16,
    14: 16.8,
    15: 18,
    16: 18.9,
    17: 20.1,
    18: 21.4,
    19: 22.7,
    20: 24
}
