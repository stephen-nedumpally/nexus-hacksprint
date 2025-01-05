export interface ChatMessage {
  name: string;
  createTime: string;
  text: string;
  sender: {
    name: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  };
  annotations?: {
    type: string;
    value: string;
  }[];
  thread?: string;
}

export interface ChatSpace {
  name: string;
  displayName: string;
  type: 'ROOM' | 'DM';
  members?: {
    name: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  }[];
}

export interface ChatThread {
  name: string;
  messages: ChatMessage[];
}
