export interface MeetingRequest {
    title: string;
    meetingDate: string;
    timeStart: string;
    timeEnd: string;
    meetingRoom: string;
    userId: string;
}

export interface MeetingResponse {
    id: string;
    title: string;
    meetingDate: string;
    timeEnd: string;
    meetingRoom: string;
    userId: string;
}