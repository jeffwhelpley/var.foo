export interface Variable {
    variableId: string;
    visitorId: string;
    files?: VariableFile[];
    createDate?: string;
}

export interface VariableFile {
    name: string;
    url: string;
    type: string;
}
