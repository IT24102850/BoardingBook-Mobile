import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  Send, Phone, Video, Search, ArrowLeft, PhoneOff, Loader2, 
  MessageSquarePlus, X, Smile, Paperclip, Image, MoreVertical,
  Check, CheckCheck, Mic, MicOff, Camera, CameraOff, Users,
  UserPlus, Settings, Info, Bell, BellOff, Pin, Trash2,
  Reply, Copy, Forward, Star, Flag, Volume2, VolumeX, UserCheck
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface ChatUser {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  sender: ChatUser;
  content: string;
  messageType: 'text' | 'system' | 'image' | 'file';
  attachments?: Array<{ url: string; type: string; name: string }>;
  createdAt: string;
  mine: boolean;
  readBy?: string[];
  delivered?: boolean;
  read?: boolean;
  replyTo?: ChatMessage;
}

interface ChatConversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  unreadCount: number;
  participants: Array<ChatUser & { lastReadAt?: string; role?: string }>;
  lastMessage: {
    text: string;
    at: string;
    senderId: string | null;
  };
  updatedAt: string;
  isPinned?: boolean;
  isMuted?: boolean;
}

interface ChatContact {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  conversationId: string | null;
  isOnline?: boolean;
  lastSeen?: string;
}

interface AcceptedRoommate {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  university: string;
  bio: string;
  image: string;
  interests?: string[];
}

interface IncomingCall {
  conversationId: string;
  fromUser: ChatUser;
  callType: 'audio' | 'video';
}

interface ActiveCall {
  conversationId: string;
  targetUserId: string;
  callType: 'audio' | 'video';
  phase: 'dialing' | 'connecting' | 'active';
}

function getCurrentUser(): ChatUser | null {
  try {
    const raw = localStorage.getItem('bb_current_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      id: String(parsed?.id || ''),
      fullName: String(parsed?.fullName || ''),
      email: String(parsed?.email || ''),
      avatar: String(parsed?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'),
      role: String(parsed?.role || 'student'),
    };
  } catch {
    return null;
  }
}

async function apiFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/chats${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const json = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    console.error('[Chat API] Error response:', {
      status: response.status,
      statusText: response.statusText,
      body: json,
    });
    throw new Error(json?.message || json?.error || `API error: ${response.status}`);
  }

  if (json?.success === false) {
    console.error('[Chat API] API returned success:false:', json);
    throw new Error(json?.message || 'API request failed');
  }

  return json?.data as T;
}

function formatTime(value: string | Date | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

function appendMessageIfMissing(existing: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  if (existing.some((item) => item.id === incoming.id)) {
    return existing;
  }
  return [...existing, incoming];
}

function dedupeMessages(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const normalized: ChatMessage[] = [];

  for (const message of messages) {
    const messageId = String(message?.id || '');
    if (!messageId || seen.has(messageId)) {
      continue;
    }

    seen.add(messageId);
    normalized.push(message);
  }

  return normalized;
}

function normalizeId(input: any): string {
  if (!input) return '';
  if (typeof input === 'string') return input;
  if (typeof input === 'number') return String(input);
  if (typeof input === 'object') {
    if (input._id) return String(input._id);
    if (input.id) return String(input.id);
  }
  return String(input);
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  // Accept sign-in data from Search page via navigation state
  const signInData = location.state && location.state.signInData ? location.state.signInData : null;
  // If signInData is present, use it for authentication
  if (signInData) {
    if (signInData.token) {
      localStorage.setItem('bb_access_token', signInData.token);
    }
    if (signInData.user) {
      localStorage.setItem('bb_current_user', JSON.stringify(signInData.user));
    }
  }
  const currentUser = useMemo(() => getCurrentUser(), []);
  const token = localStorage.getItem('bb_access_token') || '';

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  // State for passed and favourites
  const [passed, setPassed] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('bb_passed');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('bb_favourites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [acceptedRoommates, setAcceptedRoommates] = useState<AcceptedRoommate[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingAcceptedRoommates, setLoadingAcceptedRoommates] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initializingChat, setInitializingChat] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'roommates'>('chats');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const lastRecipientBootstrapRef = useRef('');
  const lastGroupBootstrapRef = useRef('');
  const selectedConversationIdRef = useRef('');
  const activeCallRef = useRef<ActiveCall | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const targetParticipant = useMemo(() => {
    if (!selectedConversation || !currentUser) return null;
    return selectedConversation.participants.find((participant) => participant.id !== currentUser.id) || null;
  }, [selectedConversation, currentUser]);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => conversation.name.toLowerCase().includes(query));
  }, [conversations, searchQuery]);

  const filteredAcceptedRoommates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return acceptedRoommates;
    return acceptedRoommates.filter((roommate) => 
      roommate.name.toLowerCase().includes(query) || 
      roommate.email.toLowerCase().includes(query)
    );
  }, [acceptedRoommates, searchQuery]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Typing indicator handler
  const handleTyping = useCallback(() => {
    if (!selectedConversationId || !socketRef.current) return;
    
    socketRef.current.emit('typing:start', { conversationId: selectedConversationId });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('typing:stop', { conversationId: selectedConversationId });
      }
    }, 2000);
  }, [selectedConversationId]);

  const cleanupPeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.close();
      peerRef.current = null;
    }
  }, []);

  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);

  const endCall = useCallback(
    (notifyRemote: boolean) => {
      if (notifyRemote && activeCall && socketRef.current) {
        socketRef.current.emit('call:end', {
          conversationId: activeCall.conversationId,
          targetUserId: activeCall.targetUserId,
        });
      }
      cleanupPeer();
      cleanupMedia();
      setIncomingCall(null);
      setActiveCall(null);
      activeCallRef.current = null;
    },
    [activeCall, cleanupMedia, cleanupPeer]
  );

  // Fetch accepted roommates from API
  const fetchAcceptedRoommates = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingAcceptedRoommates(true);
      const response = await fetch(`${API_BASE_URL}/api/roommates/mutual`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      
      if (response.ok && json.success !== false) {
        const roommates = Array.isArray(json?.data) ? json.data : [];
        const mappedRoommates: AcceptedRoommate[] = roommates.map((roommate: any) => ({
          id: normalizeId(roommate._id || roommate.id),
          userId: normalizeId(roommate.userId || roommate._id || roommate.id),
          name: roommate.name || roommate.fullName || 'Student',
          email: roommate.email || '',
          age: roommate.age || 20,
          gender: roommate.gender || 'Any',
          university: roommate.university || roommate.boardingHouse || 'Student',
          bio: roommate.bio || roommate.description || 'Looking for a compatible roommate.',
          image: roommate.image || roommate.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
          interests: Array.isArray(roommate.interests) ? roommate.interests : (Array.isArray(roommate.tags) ? roommate.tags : []),
        }));
        setAcceptedRoommates(mappedRoommates);
      }
    } catch (error) {
      console.error('Error fetching accepted roommates:', error);
    } finally {
      setLoadingAcceptedRoommates(false);
    }
  }, [token]);

  // Fetch conversations
  const fetchConversations = useCallback(async (preferredConversationId?: string): Promise<ChatConversation[]> => {
    if (!token) return [];
    try {
      setLoadingConversations(true);
      const data = await apiFetch<ChatConversation[]>('/conversations', token);
      const nextConversations = (data || []).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setConversations(nextConversations);

      if (preferredConversationId && nextConversations.some((conversation) => conversation.id === preferredConversationId)) {
        setSelectedConversationId(preferredConversationId);
        selectedConversationIdRef.current = preferredConversationId;
      } else if (selectedConversationIdRef.current && nextConversations.some((conversation) => conversation.id === selectedConversationIdRef.current)) {
        setSelectedConversationId(selectedConversationIdRef.current);
      } else if (selectedConversationIdRef.current === '' && preferredConversationId === undefined) {
        setSelectedConversationId('');
      }
      return nextConversations;
    } catch (fetchError) {
      setError((fetchError as Error).message || 'Unable to load conversations');
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, [token]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !token) return;
      try {
        setLoadingMessages(true);
        const data = await apiFetch<ChatMessage[]>(`/conversations/${conversationId}/messages`, token);
        setMessages(dedupeMessages(data || []));
        
        // Mark messages as read
        await fetch(`${API_BASE_URL}/api/chats/conversations/${conversationId}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Update unread count in conversations list
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (fetchError) {
        setError((fetchError as Error).message || 'Unable to load messages');
      } finally {
        setLoadingMessages(false);
      }
    },
    [token]
  );

  const handleUploadFile = useCallback(async (file: File, type: 'image' | 'file') => {
    if (!selectedConversationId || !currentUser || !token) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', selectedConversationId);
    formData.append('type', type);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/chats/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const json = await response.json();
      if (json.success && json.data) {
        const message: ChatMessage = {
          id: json.data.messageId,
          conversationId: selectedConversationId,
          sender: currentUser,
          content: json.data.url,
          messageType: type === 'image' ? 'image' : 'file',
          attachments: [{ url: json.data.url, type, name: file.name }],
          createdAt: new Date().toISOString(),
          mine: true,
        };
        
        setMessages(prev => [...prev, message]);
        
        // Update last message in conversation list
        setConversations(prev =>
          prev.map(conv =>
            conv.id === selectedConversationId
              ? {
                  ...conv,
                  lastMessage: {
                    text: type === 'image' ? '📷 Image' : `📎 ${file.name}`,
                    at: new Date().toISOString(),
                    senderId: currentUser.id,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : conv
          )
        );
        
        // Send via socket
        if (socketRef.current) {
          socketRef.current.emit('message:send', {
            conversationId: selectedConversationId,
            content: json.data.url,
            messageType: type === 'image' ? 'image' : 'file',
            attachments: [{ url: json.data.url, type, name: file.name }],
          });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [selectedConversationId, currentUser, token]);

  // Start a chat with an accepted roommate
  const startChatWithRoommate = useCallback(async (roommate: any) => {
    if (!token || !currentUser) {
      setError('Please sign in to start a chat');
      return;
    }

    setInitializingChat(true);
    try {
      // Robust ID extraction
      let recipientId = normalizeId(
        roommate.userId ||
        roommate.id ||
        roommate._id ||
        roommate.userID ||
        roommate.ID
      );
      if (!recipientId && roommate._id) {
        recipientId = String(roommate._id);
      }
      if (!recipientId) {
        setError('Could not start chat - missing user ID.');
        return;
      }
      console.log('[Chat] Starting chat with roommate:', roommate.name || roommate.fullName, recipientId);
      const data = await apiFetch<ChatConversation>('/conversations/direct', token, {
        method: 'POST',
        body: JSON.stringify({ recipientId }),
      });
      setSelectedConversationId(data.id);
      selectedConversationIdRef.current = data.id;
      await fetchConversations(data.id);
      setSidebarTab('chats');
    } catch (error) {
      console.error('[Chat] Error starting chat:', error);
      setError((error as Error).message || 'Unable to start chat');
    } finally {
      setInitializingChat(false);
    }
  }, [token, currentUser, fetchConversations]);

  // Open chat from route state (when coming from search page)
  const ensureConversationFromRouteState = useCallback(async () => {
    if (!token || !currentUser) return;

    const state = (location.state || {}) as any;
    const conversationId = normalizeId(
      state?.conversationId ||
      new URLSearchParams(location.search).get('conversationId')
    );

    if (conversationId) {
      setSelectedConversationId(conversationId);
      selectedConversationIdRef.current = conversationId;
      await fetchConversations(conversationId);
      setSidebarTab('chats');
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    const groupId = normalizeId(
      state?.groupId ||
      new URLSearchParams(location.search).get('groupId')
    );

    if (groupId) {
      if (lastGroupBootstrapRef.current === groupId) return;
      setInitializingChat(true);
      lastGroupBootstrapRef.current = groupId;
      try {
        const data = await apiFetch<ChatConversation>('/conversations/group', token, {
          method: 'POST',
          body: JSON.stringify({ groupId }),
        });

        setSelectedConversationId(data.id);
        selectedConversationIdRef.current = data.id;
        await fetchConversations(data.id);
        setSidebarTab('chats');
        navigate(location.pathname, { replace: true, state: {} });
      } catch (createError) {
        console.error('[Chat] Error opening group conversation:', createError);
        setError((createError as Error).message || 'Unable to open group conversation.');
      } finally {
        setInitializingChat(false);
      }
      return;
    }

    let recipientId = normalizeId(
      state?.recipientId ||
      state?.selectedRoommate?.userId ||
      state?.selectedRoommate?.id ||
      state?.selectedRoommate?._id ||
      new URLSearchParams(location.search).get('recipientId')
    );

    if (!recipientId) return;
    if (lastRecipientBootstrapRef.current === recipientId) return;

    setInitializingChat(true);
    lastRecipientBootstrapRef.current = recipientId;

    try {
      const data = await apiFetch<ChatConversation>('/conversations/direct', token, {
        method: 'POST',
        body: JSON.stringify({ recipientId }),
      });

      setSelectedConversationId(data.id);
      selectedConversationIdRef.current = data.id;
      await fetchConversations(data.id);
      navigate(location.pathname, { replace: true, state: {} });
    } catch (createError) {
      console.error('[Chat] Error creating conversation:', createError);
      setError((createError as Error).message || 'Unable to open direct conversation.');
    } finally {
      setInitializingChat(false);
    }
  }, [fetchConversations, location.pathname, location.search, location.state, navigate, token, currentUser]);

  const fetchContacts = useCallback(
    async (search = '') => {
      if (!token) return;
      try {
        setLoadingContacts(true);
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const data = await apiFetch<ChatContact[]>(`/contacts${query}`, token);
        setContacts(data || []);
      } catch (fetchError) {
        setError((fetchError as Error).message || 'Unable to load contacts');
      } finally {
        setLoadingContacts(false);
      }
    },
    [token]
  );

  const createOrOpenDirectConversation = useCallback(
    async (recipientId: string) => {
      try {
        setError('');
        const data = await apiFetch<ChatConversation>('/conversations/direct', token, {
          method: 'POST',
          body: JSON.stringify({ recipientId }),
        });

        setSelectedConversationId(data.id);
        selectedConversationIdRef.current = data.id;
        setShowNewChatModal(false);
        setContactSearchQuery('');
        await fetchConversations(data.id);
      } catch (createError) {
        const errorMsg = (createError as Error).message || 'Unable to create direct conversation';
        console.error('[Chat] Error creating conversation:', errorMsg, createError);
        setError(errorMsg);
      }
    },
    [fetchConversations, token]
  );

  const startLocalMedia = useCallback(async (callType: 'audio' | 'video') => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'video',
    });

    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, []);

  const createPeerConnection = useCallback(
    async (params: {
      conversationId: string;
      targetUserId: string;
      callType: 'audio' | 'video';
      initiator: boolean;
    }) => {
      cleanupPeer();

      const peer = new RTCPeerConnection(ICE_CONFIG);
      peerRef.current = peer;

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        remoteStreamRef.current = stream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      peer.onicecandidate = (event) => {
        if (!event.candidate || !socketRef.current) return;
        socketRef.current.emit('call:signal', {
          conversationId: params.conversationId,
          targetUserId: params.targetUserId,
          signal: {
            type: 'ice-candidate',
            candidate: event.candidate,
          },
        });
      };

      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      }

      if (params.initiator && socketRef.current) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socketRef.current.emit('call:signal', {
          conversationId: params.conversationId,
          targetUserId: params.targetUserId,
          signal: {
            type: 'offer',
            sdp: offer,
          },
        });
      }
    },
    [cleanupPeer]
  );

  const handleSignal = useCallback(
    async (payload: { conversationId: string; fromUserId: string; signal: any }) => {
      const signal = payload?.signal;
      const currentCall = activeCallRef.current;
      if (!signal || !currentCall) return;
      if (payload.conversationId !== currentCall.conversationId) return;

      if (!peerRef.current) {
        await createPeerConnection({
          conversationId: currentCall.conversationId,
          targetUserId: currentCall.targetUserId,
          callType: currentCall.callType,
          initiator: false,
        });
      }

      const peer = peerRef.current;
      if (!peer) return;

      if (signal.type === 'offer' && signal.sdp) {
        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socketRef.current?.emit('call:signal', {
          conversationId: currentCall.conversationId,
          targetUserId: currentCall.targetUserId,
          signal: {
            type: 'answer',
            sdp: answer,
          },
        });
        setActiveCall((prev) => (prev ? { ...prev, phase: 'active' } : prev));
        return;
      }

      if (signal.type === 'answer' && signal.sdp) {
        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        setActiveCall((prev) => (prev ? { ...prev, phase: 'active' } : prev));
        return;
      }

      if (signal.type === 'ice-candidate' && signal.candidate) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } catch {
          // Ignore transient ICE race errors.
        }
      }
    },
    [createPeerConnection]
  );

  const handleSendMessage = useCallback(async () => {
    const content = newMessage.trim();
    if (!content || !selectedConversationId || !currentUser) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      conversationId: selectedConversationId,
      sender: currentUser,
      content,
      messageType: 'text',
      createdAt: new Date().toISOString(),
      mine: true,
      delivered: false,
      read: false,
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');
    setError('');

    const sendViaRest = async () => {
      const response = await apiFetch<ChatMessage>(`/conversations/${selectedConversationId}/messages`, token, {
        method: 'POST',
        body: JSON.stringify({ content, replyToId: replyToMessage?.id }),
      });
      
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        return dedupeMessages([...filtered, response]);
      });
      
      setConversations((prev) =>
        prev.map((item) =>
          item.id === selectedConversationId
            ? {
                ...item,
                lastMessage: { text: response.content, at: response.createdAt, senderId: currentUser.id },
                updatedAt: response.createdAt,
              }
            : item
        )
      );
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit(
        'message:send',
        { 
          conversationId: selectedConversationId, 
          content,
          replyToId: replyToMessage?.id,
          tempId,
        },
        async (ack: any) => {
          if (ack?.ok && ack?.data) {
            setMessages((prev) => {
              const filtered = prev.filter((m) => m.id !== tempId);
              return dedupeMessages([...filtered, { ...ack.data, mine: true }]);
            });
          } else {
            try {
              await sendViaRest();
            } catch (sendError) {
              setError((sendError as Error).message || 'Unable to send message');
              setMessages((prev) => prev.filter((m) => m.id !== tempId));
            }
          }
        }
      );
      return;
    }

    try {
      await sendViaRest();
    } catch (sendError) {
      setError((sendError as Error).message || 'Unable to send message');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setReplyToMessage(null);
    }
  }, [currentUser, newMessage, selectedConversationId, token, replyToMessage]);

  const startCall = useCallback(
    (callType: 'audio' | 'video') => {
      if (!selectedConversation || !targetParticipant || !socketRef.current) return;
      setError('');

      socketRef.current.emit(
        'call:initiate',
        {
          conversationId: selectedConversation.id,
          targetUserId: targetParticipant.id,
          callType,
        },
        (ack: any) => {
          if (!ack?.ok) {
            setError(ack?.message || 'Unable to start call');
            return;
          }
          setActiveCall({
            conversationId: selectedConversation.id,
            targetUserId: targetParticipant.id,
            callType,
            phase: 'dialing',
          });
        }
      );
    },
    [selectedConversation, targetParticipant]
  );

  const acceptIncomingCall = useCallback(async () => {
    if (!incomingCall || !socketRef.current) return;
    try {
      await startLocalMedia(incomingCall.callType);
      setActiveCall({
        conversationId: incomingCall.conversationId,
        targetUserId: incomingCall.fromUser.id,
        callType: incomingCall.callType,
        phase: 'connecting',
      });
      socketRef.current.emit('call:accept', {
        conversationId: incomingCall.conversationId,
        targetUserId: incomingCall.fromUser.id,
        callType: incomingCall.callType,
      });
      setIncomingCall(null);
      setSelectedConversationId(incomingCall.conversationId);
    } catch {
      setError('Microphone/Camera permission is required for calls');
    }
  }, [incomingCall, startLocalMedia]);

  const declineIncomingCall = useCallback(() => {
    if (!incomingCall || !socketRef.current) return;
    socketRef.current.emit('call:decline', {
      conversationId: incomingCall.conversationId,
      targetUserId: incomingCall.fromUser.id,
    });
    setIncomingCall(null);
  }, [incomingCall]);

  // Initial data loading
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (sidebarTab !== 'roommates') return;
    fetchAcceptedRoommates();
  }, [fetchAcceptedRoommates, sidebarTab]);

  // Handle route state for opening chat from roommate
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initializingChat) {
        ensureConversationFromRouteState();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [ensureConversationFromRouteState, initializingChat]);

  useEffect(() => {
    if (!showNewChatModal) return;
    fetchContacts(contactSearchQuery);
  }, [contactSearchQuery, fetchContacts, showNewChatModal]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    fetchMessages(selectedConversationId);
    socketRef.current?.emit('conversation:join', selectedConversationId);

    return () => {
      socketRef.current?.emit('conversation:leave', selectedConversationId);
    };
  }, [fetchMessages, selectedConversationId]);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  // Socket connection
  useEffect(() => {
    if (!token || !currentUser) return;
    const socketUrl = API_BASE_URL || window.location.origin;
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('message:new', (incoming: ChatMessage) => {
      setConversations((prev) => {
        const exists = prev.some((conversation) => conversation.id === incoming.conversationId);
        const isMuted = prev.find((c) => c.id === incoming.conversationId)?.isMuted;
        
        const updated = exists
          ? prev.map((conversation) => {
              if (conversation.id !== incoming.conversationId) return conversation;
              return {
                ...conversation,
                unreadCount:
                  selectedConversationIdRef.current === incoming.conversationId || 
                  incoming.sender.id === currentUser.id ||
                  isMuted
                    ? conversation.unreadCount
                    : conversation.unreadCount + 1,
                lastMessage: {
                  text: incoming.messageType === 'image' ? '📷 Image' : 
                         incoming.messageType === 'file' ? '📎 File' : incoming.content,
                  at: incoming.createdAt,
                  senderId: incoming.sender.id,
                },
                updatedAt: incoming.createdAt,
              };
            })
          : prev;

        return [...updated].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      });

      if (incoming.conversationId === selectedConversationIdRef.current) {
        setMessages((prev) => appendMessageIfMissing(prev, { ...incoming, mine: incoming.sender.id === currentUser.id }));
      }
      
      if (incoming.conversationId !== selectedConversationIdRef.current && !incoming.mine) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {});
      }
    });

    socket.on('message:delivered', ({ messageId }: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, delivered: true } : msg
        )
      );
    });

    socket.on('message:read', ({ messageId }: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    socket.on('typing:start', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === selectedConversationIdRef.current && userId !== currentUser.id) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    });

    socket.on('typing:stop', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === selectedConversationIdRef.current) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    });

    socket.on('user:online', ({ userId }: { userId: string }) => {
      setContacts(prev =>
        prev.map(contact =>
          contact.id === userId ? { ...contact, isOnline: true } : contact
        )
      );
      setConversations(prev =>
        prev.map(conv => ({
          ...conv,
          participants: conv.participants.map(p =>
            p.id === userId ? { ...p, isOnline: true } : p
          ),
        }))
      );
    });

    socket.on('user:offline', ({ userId, lastSeen }: { userId: string; lastSeen: string }) => {
      setContacts(prev =>
        prev.map(contact =>
          contact.id === userId ? { ...contact, isOnline: false, lastSeen } : contact
        )
      );
      setConversations(prev =>
        prev.map(conv => ({
          ...conv,
          participants: conv.participants.map(p =>
            p.id === userId ? { ...p, isOnline: false, lastSeen } : p
          ),
        }))
      );
    });

    socket.on('call:incoming', (payload: IncomingCall) => {
      setIncomingCall(payload);
    });

    socket.on('call:accepted', async (payload: any) => {
      const currentCall = activeCallRef.current;
      if (!currentCall) return;
      if (payload.conversationId !== currentCall.conversationId) return;
      try {
        await startLocalMedia(currentCall.callType);
        setActiveCall((prev) => (prev ? { ...prev, phase: 'connecting' } : prev));
        await createPeerConnection({
          conversationId: currentCall.conversationId,
          targetUserId: currentCall.targetUserId,
          callType: currentCall.callType,
          initiator: true,
        });
      } catch {
        setError('Microphone/Camera permission is required for calls');
        endCall(false);
      }
    });

    socket.on('call:declined', () => {
      setError('Call declined');
      endCall(false);
    });

    socket.on('call:ended', () => {
      endCall(false);
    });

    socket.on('call:signal', (payload: any) => {
      void handleSignal(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      cleanupPeer();
      cleanupMedia();
    };
  }, [cleanupMedia, cleanupPeer, createPeerConnection, currentUser, endCall, handleSignal, startLocalMedia, token]);

  useEffect(
    () => () => {
      cleanupPeer();
      cleanupMedia();
    },
    [cleanupMedia, cleanupPeer]
  );

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscroll = (document.body.style as any).overscrollBehavior;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    (document.body.style as any).overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      (document.body.style as any).overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  if (initializingChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-300 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-200 text-sm">Opening chat...</p>
        </div>
      </div>
    );
  }

  if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-200 mb-3">Sign in is required to use chat.</p>
          <button
            onClick={() => navigate('/find')}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] flex overflow-hidden pt-[env(safe-area-inset-top)]">
      {/* Sidebar */}
      <div className={`w-full lg:w-96 border-r border-white/10 h-full overflow-hidden ${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col`}>
        {/* Sidebar Header with Tabs */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => navigate('/find')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 transition-colors text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSidebarTab('chats')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                sidebarTab === 'chats'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Chats ({conversations.length})
            </button>
            <button
              onClick={() => setSidebarTab('roommates')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                sidebarTab === 'roommates'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              Roommates ({acceptedRoommates.length})
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder={sidebarTab === 'chats' ? "Search conversations..." : "Search roommates..."}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Content based on selected tab */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* CHATS TAB */}
          {sidebarTab === 'chats' && (
            <>
              {loadingConversations && (
                <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading conversations...
                </div>
              )}

              {!loadingConversations && filteredConversations.length === 0 && (
                <div className="p-6 text-gray-400 text-sm text-center">
                  <MessageSquarePlus size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No conversations yet.</p>
                  <p className="text-xs mt-1">Start a chat with your accepted roommates!</p>
                </div>
              )}

              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full p-4 border-b border-white/10 hover:bg-white/5 transition text-left ${
                    selectedConversationId === conversation.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      {conversation.type === 'direct' && conversation.participants.find(p => p.id !== currentUser.id)?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#131d3a]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white font-semibold truncate">
                          {conversation.name}
                          {conversation.isPinned && <Pin size={12} className="inline ml-1 text-cyan-400" />}
                        </h3>
                        {conversation.unreadCount > 0 && !conversation.isMuted && (
                          <span className="bg-cyan-400 text-black text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center flex-shrink-0">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                        {conversation.isMuted && <BellOff size={12} className="text-gray-500" />}
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                      <p className="text-gray-500 text-xs">{formatTime(conversation.updatedAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* ROOMMATES TAB - Show accepted roommates */}
          {sidebarTab === 'roommates' && (
            <>
              {loadingAcceptedRoommates && (
                <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading roommates...
                </div>
              )}

              {!loadingAcceptedRoommates && filteredAcceptedRoommates.length === 0 && (
                <div className="p-6 text-gray-400 text-sm text-center">
                  <UserCheck size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No accepted roommates yet.</p>
                  <p className="text-xs mt-1">When you accept a roommate request, they'll appear here.</p>
                  <button
                    onClick={() => navigate('/find')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    Find Roommates
                  </button>
                </div>
              )}

              {filteredAcceptedRoommates.map((roommate) => (
                <button
                  key={roommate.id}
                  onClick={() => startChatWithRoommate(roommate)}
                  className="w-full p-4 border-b border-white/10 hover:bg-white/5 transition text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={roommate.image || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={roommate.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#131d3a]"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white font-semibold truncate">{roommate.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          Chat
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{roommate.age} yrs</span>
                        <span>•</span>
                        <span>{roommate.gender}</span>
                        <span>•</span>
                        <span>{roommate.university}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">{roommate.bio}</p>
                      {roommate.interests && roommate.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {roommate.interests.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="border-b border-white/10 p-4 flex items-center justify-between bg-white/5 sticky top-[env(safe-area-inset-top)] z-10">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setSelectedConversationId('')} 
                className="lg:hidden text-cyan-400 hover:text-cyan-300 flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative cursor-pointer" onClick={() => setShowUserProfile(true)}>
                <img
                  src={selectedConversation.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {targetParticipant?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#131d3a]"></div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-semibold truncate text-base sm:text-lg">{selectedConversation.name}</h2>
                <p className="text-gray-400 text-xs truncate">
                  {selectedConversation.type === 'group' 
                    ? `${selectedConversation.participants.length} members` 
                    : targetParticipant?.isOnline 
                      ? 'Online' 
                      : targetParticipant?.lastSeen 
                        ? `Last seen ${formatTime(targetParticipant.lastSeen)}`
                        : 'Online'}
                </p>
              </div>
            </div>

            {selectedConversation.type === 'direct' && targetParticipant && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startCall('audio')}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => startCall('video')}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Video size={20} />
                </button>
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Info size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Active Call UI */}
          {activeCall && (
            <div className="border-b border-cyan-400/30 bg-cyan-500/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-cyan-100">
                  {activeCall.phase === 'dialing' && 'Calling...'}
                  {activeCall.phase === 'connecting' && 'Connecting call...'}
                  {activeCall.phase === 'active' && 'In call'}
                </p>
                <button 
                  onClick={() => endCall(true)} 
                  className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <PhoneOff size={14} /> End
                </button>
              </div>

              {activeCall.callType === 'video' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-36 bg-black/60 rounded-lg object-cover" />
                    <span className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">You</span>
                  </div>
                  <div className="relative">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-36 bg-black/60 rounded-lg object-cover" />
                    <span className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">{targetParticipant?.fullName || 'Other'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-200 bg-red-500/10 border-b border-red-500/30 px-4 py-2">
              {error}
            </div>
          )}

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="px-4 py-1 text-xs text-cyan-400">
              {Array.from(typingUsers).map(id => {
                const participant = selectedConversation?.participants.find(p => p.id === id);
                return participant?.fullName || 'Someone';
              }).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-28 sm:pb-4 space-y-4">
            {loadingMessages && (
              <div className="text-xs text-gray-400 flex items-center gap-2 justify-center py-8">
                <Loader2 size={14} className="animate-spin" /> Loading messages...
              </div>
            )}

            {!loadingMessages && messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquarePlus size={48} className="mx-auto mb-3 text-gray-500 opacity-50" />
                <p className="text-gray-400 text-sm">No messages yet.</p>
                <p className="text-gray-500 text-xs mt-1">Start the conversation!</p>
              </div>
            )}

            {messages.map((message, index) => {
              const showDateSeparator = index === 0 || 
                new Date(message.createdAt).toDateString() !== new Date(messages[index - 1]?.createdAt).toDateString();
              
              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="bg-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
                        {new Date(message.createdAt).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
                    {!message.mine && (
                      <img
                        src={message.sender.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={message.sender.fullName}
                        className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                      />
                    )}
                    <div className={`max-w-xs md:max-w-md ${message.mine ? 'items-end' : 'items-start'}`}>
                      {selectedConversation.type === 'group' && !message.mine && (
                        <p className="text-xs font-bold mb-1 text-cyan-300">{message.sender.fullName || message.sender.email}</p>
                      )}
                      
                      {message.replyTo && (
                        <div className={`mb-1 px-2 py-1 rounded text-xs border-l-2 ${message.mine ? 'bg-cyan-500/20 border-cyan-300' : 'bg-white/5 border-gray-500'}`}>
                          <p className="text-gray-400">Replying to {message.replyTo.sender.fullName}</p>
                          <p className="text-gray-300 truncate max-w-xs">{message.replyTo.content}</p>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.mine
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/10 text-gray-300 border border-white/20'
                        }`}
                      >
                        {message.messageType === 'image' ? (
                          <img 
                            src={message.content} 
                            alt="Uploaded" 
                            className="max-w-full max-h-64 rounded-lg cursor-pointer"
                            onClick={() => window.open(message.content, '_blank')}
                          />
                        ) : message.messageType === 'file' ? (
                          <div className="flex items-center gap-2">
                            <Paperclip size={16} />
                            <a 
                              href={message.content} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline hover:text-cyan-200"
                            >
                              {message.attachments?.[0]?.name || 'Download file'}
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        )}
                        <div className={`flex items-center gap-1 text-xs mt-1 ${message.mine ? 'text-cyan-100' : 'text-gray-500'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {message.mine && (
                            <>
                              {message.delivered ? (
                                message.read ? (
                                  <CheckCheck size={12} className="text-cyan-300" />
                                ) : (
                                  <CheckCheck size={12} className="text-gray-400" />
                                )
                              ) : (
                                <Check size={12} />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/5 sticky bottom-16 sm:bottom-0 z-20">
            {replyToMessage && (
              <div className="mb-2 p-2 bg-cyan-500/10 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-cyan-400">Replying to {replyToMessage.sender.fullName}</p>
                  <p className="text-sm text-gray-300 truncate">{replyToMessage.content}</p>
                </div>
                <button onClick={() => setReplyToMessage(null)} className="p-1 hover:bg-white/10 rounded">
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <div className="flex gap-1">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Smile size={20} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Image size={20} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFile(file, 'file');
                    e.target.value = '';
                  }}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFile(file, 'image');
                    e.target.value = '';
                  }}
                />
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(event) => {
                    setNewMessage(event.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2 right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(emoji: any) => {
                        setNewMessage(prev => prev + emoji.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => void handleSendMessage()}
                disabled={!newMessage.trim() && !isUploading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedConversation && !initializingChat && (
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageSquarePlus size={64} className="mx-auto mb-4 text-gray-500 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Chat</h2>
            <p className="text-gray-400">Select a conversation to start messaging</p>
            <p className="text-gray-500 text-sm mt-2">or start a new chat with your matched roommates</p>
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && !activeCall && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-br from-[#121a32] to-[#0f172a] border border-cyan-500/30 rounded-2xl p-5 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                {incomingCall.callType === 'video' ? (
                  <Video size={40} className="text-cyan-400" />
                ) : (
                  <Phone size={40} className="text-cyan-400" />
                )}
              </div>
              <p className="text-white font-semibold text-lg">{incomingCall.fromUser.fullName || incomingCall.fromUser.email}</p>
              <p className="text-gray-400 text-sm mt-1">Incoming {incomingCall.callType} call</p>
              <div className="flex gap-4 mt-6 w-full">
                <button
                  onClick={declineIncomingCall}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <PhoneOff size={18} /> Decline
                </button>
                <button
                  onClick={() => void acceptIncomingCall()}
                  className="flex-1 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[75] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gradient-to-br from-[#101a36] to-[#0f172a] border border-white/15 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1.5 rounded-lg text-gray-300 hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={contactSearchQuery}
                onChange={(event) => setContactSearchQuery(event.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {loadingContacts && (
                <div className="text-xs text-gray-400 flex items-center gap-2 px-2 py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading users...
                </div>
              )}

              {!loadingContacts && contacts.length === 0 && (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto mb-3 text-gray-500 opacity-50" />
                  <p className="text-sm text-gray-400">No users found.</p>
                  <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                </div>
              )}

              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => void createOrOpenDirectConversation(contact.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={contact.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={contact.fullName || contact.email}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#101a36]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">{contact.fullName || contact.email}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.email}</p>
                      {!contact.isOnline && contact.lastSeen && (
                        <p className="text-[10px] text-gray-500">Last seen {formatTime(contact.lastSeen)}</p>
                      )}
                    </div>
                    {contact.conversationId && (
                      <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                        Existing
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && targetParticipant && (
        <div className="fixed inset-0 z-[75] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowUserProfile(false)}>
          <div className="w-full max-w-sm bg-gradient-to-br from-[#101a36] to-[#0f172a] border border-white/15 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={targetParticipant.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                alt={targetParticipant.fullName}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setShowUserProfile(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-bold text-xl">{targetParticipant.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${targetParticipant.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <p className="text-gray-300 text-sm">
                    {targetParticipant.isOnline ? 'Online' : targetParticipant.lastSeen ? `Last seen ${formatTime(targetParticipant.lastSeen)}` : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                <p className="text-white text-sm">{targetParticipant.email}</p>
              </div>
              <div className="mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Role</p>
                <p className="text-white text-sm capitalize">{targetParticipant.role}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    startCall('audio');
                    setShowUserProfile(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 transition flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Call
                </button>
                <button
                  onClick={() => {
                    startCall('video');
                    setShowUserProfile(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 transition flex items-center justify-center gap-2"
                >
                  <Video size={16} /> Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}