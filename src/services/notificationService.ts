import apiClient from "../apis/apiClient";

export interface Notification {
    _id: string;
    recipient: string;
    message: string;
    type: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: string;
}

const getNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get("/api/notifications");
    return response.data;
};

const markAsRead = async (id: string): Promise<Notification> => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
};

const markAllAsRead = async (): Promise<{ message: string }> => {
    const response = await apiClient.put("/api/notifications/read-all");
    return response.data;
};

export default {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
