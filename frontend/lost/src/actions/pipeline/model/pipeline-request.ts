export interface StartPipeRequest {
    name: string
    description: string
    elements: Element[]
    templateId: number
}

export interface Element {
    peN: number
    datasource?: Datasource
    script?: Script
    annoTask?: AnnoTask
    loop?: Loop
    dataExport?: DataExport
}

export interface AnnoTask {
    name: string
    type: string
    instructions: string
    configuration: Configuration
    assignee: string
    workerId: number
    labelLeaves: LabelLeaf[]
    selectedLabelTree: number
}

export interface Configuration {
    tools: Tools
    annos: Annos
    img: Img
}

export interface Annos {
    multilabels: boolean
    actions: AnnosActions
    minArea: number
}

export interface AnnosActions {
    draw: boolean
    label: boolean
    edit: boolean
}

export interface Img {
    multilabels: boolean
    actions: ImgActions
}

export interface ImgActions {
    label: boolean
}

export interface Tools {
    point: boolean
    line: boolean
    polygon: boolean
    bbox: boolean
    junk: boolean
}

export interface LabelLeaf {
    id: number
    maxLabels: string
}

export interface DataExport {}

export interface Datasource {
    rawFilePath: null
    selectedPath: string
    fs_id: number
}

export interface Loop {
    maxIteration: null
    peJumpId: number
}

export interface Script {
    arguments: Arguments | null
    description: string
    envs: string
    id: number
    name: string
    path: string
    isDebug: boolean
}

export interface Arguments {
    valid_imgtypes: ImgBatch
    model_name: ImgBatch
    url: ImgBatch
    port: ImgBatch
    img_batch: ImgBatch
}

export interface ImgBatch {
    value: string
    help: string
}
