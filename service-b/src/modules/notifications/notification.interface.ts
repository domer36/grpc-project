export interface Notification {
    id: string;
    user: User;
    message: string;
    timestamp: string;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    age: number;
}

// Interfaces para gRPC
export interface NotifyRequest {
    userId: string;
    message: string;
}
  
export interface NotifyResponse {
    status: string;
}
  