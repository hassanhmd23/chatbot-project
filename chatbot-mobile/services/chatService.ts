import api from './api';
import {
  ChatHistoryParams,
  Message,
  SendMessageParams,
  UploadImageResponse,
} from '../types/chat';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export const chatService = {
  // Get chat history for traffic law consultations
  getTrafficLawHistory: async (
    params: ChatHistoryParams
  ): Promise<{ messages: Message[] }> => {
    const { sessionId } = params;
    const response = await api.get(
      `/api/chat/traffic-law/history/${sessionId}`
    );
    return response.data;
  },

  // Get chat history for accident analysis
  getAccidentHistory: async (
    params: ChatHistoryParams
  ): Promise<{ messages: Message[] }> => {
    const { sessionId } = params;
    const response = await api.get(`/api/chat/accident/history/${sessionId}`);
    return response.data;
  },

  // Send a message in traffic law chat
  sendTrafficLawMessage: async (
    params: SendMessageParams
  ): Promise<Message> => {
    const { sessionId, content } = params;
    const response = await api.post(`/api/chat/traffic-law/message`, {
      session_id: sessionId,
      message: content,
    });
    return response.data.data;
  },

  // Send a message in accident analysis chat
  sendAccidentMessage: async (params: SendMessageParams): Promise<Message> => {
    const { sessionId, content, images } = params;

    // If there are images, upload them first
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map((image) =>
        chatService.uploadAccidentImage(image)
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.url);
    }    

    const response = await api.post(`/api/chat/accident/message`, {
      session_id: sessionId,
      message: content,
      images: imageUrls,
    });    

    return response.data.data;
  },

  // Upload an image for accident analysis
  uploadAccidentImage: async (
    imageUri: string
  ): Promise<UploadImageResponse> => {
    // First compress the image
    const compressedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1200 } }], // Resize to max width of 1200px
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // 70% quality JPEG
    );

    // Create form data for the image upload
    const formData = new FormData();
    const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri);

    if (fileInfo.exists) {
      formData.append('image', {
        uri: compressedImage.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/api/chat/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      

      return response.data;
    } else {
      throw new Error('File does not exist');
    }
  },

  // Get all chat sessions for a user
  getSessions: async (): Promise<{
    trafficSessions: any[];
    accidentSessions: any[];
  }> => {
    const response = await api.get('/api/chat/sessions');
    return response.data;
  },

  // Create a new chat session
  createSession: async (
    chatType: 'traffic' | 'accident',
    title: string
  ): Promise<any> => {
    const response = await api.post('/api/chat/sessions', {
      chat_type: chatType,
      title,
    });
    return response.data;
  },
};

export default chatService;
