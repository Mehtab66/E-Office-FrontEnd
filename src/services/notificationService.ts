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
    const response = await apiClient.get("/notifications");
    return response.data;
};

const markAsRead = async (id: string): Promise<Notification> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
};

const markAllAsRead = async (): Promise<{ message: string }> => {
    const response = await apiClient.put("/notifications/read-all");
    return response.data;
};

export default {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
