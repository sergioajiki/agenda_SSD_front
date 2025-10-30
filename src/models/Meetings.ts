export interface MeetingRequest {
    title: string;
    meetingDate: string;
    timeStart: string;
    timeEnd: string;
    meetingRoom: string;
    userId: number;
}

export interface MeetingResponse {
    id: number;
    title: string;
    meetingDate: string;
    timeStart: string;
    timeEnd: string;
    meetingRoom: string;
    userId: number;
    userName: string;
    
}