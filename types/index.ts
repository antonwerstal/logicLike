export type Vote = {
  id: number;
  ip: string;
  ideaId: number;
};


export type IdeaRow = {
  id: number;
  name: string;
};


export type Idea = {
  id: number;
  name: string;
  canVoting?: boolean; // опциональное, вычисляется на клиенте
};


export type VoteStatus = {
  ideaId: number;
  canVoting: boolean;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

export type TypeApiClient = {
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
};
