export type calendarEventBase = {
    id: string,
    email: string,
    title: string,
    shortTitle: string,
    projectId: string,
    projectName: string,
    projectColor: string,
    parentEventId: string,
    childEventIdList: string[],
    memo: string,
    start: Date,
    end: Date,
    createdAt: Date,
    updatedAt: Date,
}

export const defaultEvent00: calendarEventBase = {
    id: "defaultEvent00",
    email: "",
    title: "defaultEvent00",
    shortTitle: "defaultEvent00",
    projectId: "",
    projectName: "",
    projectColor: "#00ff00",
    parentEventId: "",
    childEventIdList: [""],
    memo: "string",
    start: new Date("2023/10/02"),
    end: new Date("2023/10/03"),
    createdAt: new Date("2023/10/02"),
    updatedAt: new Date("2023/10/03"),
}

export type calendarEvent = {
    id: string,
    title: string,
    startDate: Date,
    endDate: Date,
    memo?: string,
    children?: calendarEvent[]
}

export const defaultEvent0: calendarEvent = {
    id: '',
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    memo: '',
    children: [],
}

export const defaultEvent1: calendarEvent = {
    id: '1',
    title: 'デフォルトイベント1',
    startDate: new Date('2023/09/25 8:00:00'),
    endDate: new Date('2023/09/25 9:00:00'),
    memo: 'デフォルトイベント1のメモ'
}

export const defaultEvent51: calendarEvent = {
    id: '51',
    title: 'デフォルトイベント51',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント51のメモ',
    children: []
}

export const defaultEvent41: calendarEvent = {
    id: '41',
    title: 'デフォルトイベント41',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント41のメモ',
    children: [defaultEvent51]
}

export const defaultEvent42: calendarEvent = {
    id: '42',
    title: 'デフォルトイベント42',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント42のメモ',
    children: []
}

export const defaultEvent43: calendarEvent = {
    id: '43',
    title: 'デフォルトイベント43',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント43のメモ',
    children: []
}

export const defaultEvent44: calendarEvent = {
    id: '44',
    title: 'デフォルトイベント44',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント44のメモ',
    children: []
}

export const defaultEvent31: calendarEvent = {
    id: '31',
    title: 'デフォルトイベント31',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント31のメモ',
    children: [defaultEvent41, defaultEvent42]
}

export const defaultEvent32: calendarEvent = {
    id: '32',
    title: 'デフォルトイベント32',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント32のメモ',
    children: [defaultEvent43, defaultEvent44]
}

export const defaultEvent2: calendarEvent = {
    id: '2',
    title: 'デフォルトイベント2',
    startDate: new Date('2023/09/25 0:00:00'),
    endDate: new Date('2023/09/27 0:00:00'),
    memo: 'デフォルトイベント2のメモ',
    children: [defaultEvent31, defaultEvent32]
}

