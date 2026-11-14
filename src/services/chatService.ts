export interface ChatMessage {
  id: string;
  channelId: string; // 'general' | 'roads' | 'streetlights' | 'water' or a specific reportId
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: 'Citizen' | 'Admin' | 'System';
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  reportReference?: {
    reportId: string;
    title: string;
    category?: string;
  };
}

export interface ChatChannel {
  id: string;
  name: string;
  tag: string;
  description: string;
  icon: string;
  category: string;
}

export const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'Bachupally Ward Council',
    tag: '#bachupally-general',
    description: 'General community infrastructure discussions, ward updates, and citizen coordination.',
    icon: 'MessageSquare',
    category: 'General'
  },
  {
    id: 'roads',
    name: 'Roads & Hazards Alert',
    tag: '#roads-and-hazards',
    description: 'Pothole alerts, damaged footpaths, resurfacing updates, and heavy vehicle route notices.',
    icon: 'AlertOctagon',
    category: 'Pothole'
  },
  {
    id: 'streetlights',
    name: 'Night Safety & Illumination',
    tag: '#night-safety-lights',
    description: 'Dark corridors, non-functional streetlights, and late-night pedestrian safety watch.',
    icon: 'Lightbulb',
    category: 'Broken Streetlight'
  },
  {
    id: 'water',
    name: 'Drainage & Monsoon Watch',
    tag: '#water-and-drainage',
    description: 'Open drains, stagnant waterlogging, rainwater drain blockages, and lake overflow checks.',
    icon: 'Droplets',
    category: 'Waterlogging'
  }
];

const CHAT_STORAGE_KEY = 'civiclens_community_chat_v2';

const SEED_MESSAGES: ChatMessage[] = [
  // General Channel
  {
    id: 'msg-gen-1',
    channelId: 'general',
    userId: 'admin_kiran_01',
    userName: 'Officer Kiran Rao',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userRole: 'Admin',
    content: 'Welcome to the Bachupally Ward 132 Civic Discussion Channel. Please use this space to report infrastructure hazards and track pending municipal work orders.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    likedBy: ['user_priya', 'user_rahul', 'user_ananya']
  },
  {
    id: 'msg-gen-2',
    channelId: 'general',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'Has anyone noticed the new road resurfacing on the ORR connecting road (#REP-BAC-1013)? It was completed yesterday and looks so much safer now!',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    likedBy: ['user_rahul', 'admin_kiran_01'],
    reportReference: {
      reportId: 'REP-BAC-1013',
      title: 'ORR Service Road Pothole Repaved',
      category: 'Pothole'
    }
  },
  {
    id: 'msg-gen-3',
    channelId: 'general',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'Yes Priya! I verified it in person on my morning walk. Commending the GHMC road crew for the swift 3-day turnaround.',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    likes: 3,
    likedBy: ['user_priya']
  },

  // Roads Channel
  {
    id: 'msg-rd-1',
    channelId: 'roads',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'Warning to all two-wheeler commuters: Heavy gravel spill near Silver Oaks School intersection. Several bikes skidded this morning.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 7,
    likedBy: ['user_priya', 'user_rahul'],
    reportReference: {
      reportId: 'REP-BAC-1001',
      title: 'Deep crater pothole near Silver Oaks',
      category: 'Pothole'
    }
  },
  {
    id: 'msg-rd-2',
    channelId: 'roads',
    userId: 'admin_kiran_01',
    userName: 'Officer Kiran Rao',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userRole: 'Admin',
    content: 'Noted Ananya. Roads Department patch crew has been dispatched with bitumen mixture. Priority score has been elevated.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 9,
    likedBy: ['user_ananya', 'user_priya', 'user_rahul']
  },

  // Streetlights Channel
  {
    id: 'msg-sl-1',
    channelId: 'streetlights',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'The streetlights near Bachupally Lake View stretch have been flickering again. Please use the SafeRoute Night mode if walking there after 8 PM.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    likes: 4,
    likedBy: ['user_ananya', 'user_rahul']
  },

  // Water Channel
  {
    id: 'msg-wt-1',
    channelId: 'water',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'Storm drain clearing has started near Relief Hospital road. Keep an eye on open manholes while walking in the rain.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 6,
    likedBy: ['user_priya', 'admin_kiran_01']
  },

  // Seed comment for report REP-BAC-1001 (issue specific)
  {
    id: 'msg-rep-1001-1',
    channelId: 'REP-BAC-1001',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userRole: 'Citizen',
    content: 'I live nearby — students from Silver Oaks cross here daily. Very urgent to fix before school opens on Monday.',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    likes: 4,
    likedBy: ['user_priya', 'user_rahul']
  },
  {
    id: 'msg-rep-1001-2',
    channelId: 'REP-BAC-1001',
    userId: 'admin_kiran_01',
    userName: 'Officer Kiran Rao',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userRole: 'Admin',
    content: 'Emergency patch crew assigned. Bitumen truck expected today by 3 PM.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 6,
    likedBy: ['user_ananya', 'user_priya']
  }
];

export const chatService = {
  getMessages(channelId: string): ChatMessage[] {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
        return SEED_MESSAGES.filter(m => m.channelId === channelId);
      }
      const all: ChatMessage[] = JSON.parse(raw);
      return all.filter(m => m.channelId === channelId);
    } catch {
      return SEED_MESSAGES.filter(m => m.channelId === channelId);
    }
  },

  getAllMessages(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
        return SEED_MESSAGES;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_MESSAGES;
    }
  },

  sendMessage(params: {
    channelId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userRole: 'Citizen' | 'Admin' | 'System';
    content: string;
    reportReference?: {
      reportId: string;
      title: string;
      category?: string;
    };
  }): ChatMessage {
    const all = this.getAllMessages();
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channelId: params.channelId,
      userId: params.userId,
      userName: params.userName,
      userAvatar: params.userAvatar,
      userRole: params.userRole,
      content: params.content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reportReference: params.reportReference
    };

    all.push(newMessage);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(all));
    return newMessage;
  },

  toggleLike(messageId: string, userId: string): ChatMessage | null {
    const all = this.getAllMessages();
    const index = all.findIndex(m => m.id === messageId);
    if (index === -1) return null;

    const msg = all[index];
    const hasLiked = msg.likedBy.includes(userId);

    const updatedLikedBy = hasLiked
      ? msg.likedBy.filter(id => id !== userId)
      : [...msg.likedBy, userId];

    const updatedMessage: ChatMessage = {
      ...msg,
      likes: updatedLikedBy.length,
      likedBy: updatedLikedBy
    };

    all[index] = updatedMessage;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(all));
    return updatedMessage;
  },

  resetChat(): void {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
  }
};
