export interface ValidateErrorJSON {
    reason: "Request validation failed";
    details: { [name: string]: unknown };
}

export interface UnauthorizeError{
    reason: string;
    details: string;
}