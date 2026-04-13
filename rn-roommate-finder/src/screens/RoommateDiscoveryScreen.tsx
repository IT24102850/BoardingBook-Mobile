import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// API Base URL
const API_BASE_URL = 'http://localhost:5000';

// Types
interface Listing {
  id: string | number;
  title: string;
  images: string[];
  price: number;
  location: string;
  distance: number;
  roomType: string;
  genderPreference?: string;
  availableFrom?: string;
  billsIncluded?: boolean;
  verified?: boolean;
  badges?: string[];
  description?: string;
  features?: string[];
  deposit?: number;
  roommateCount?: number;
  rating?: number;
}

interface Roommate {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  university: string;
  bio: string;
  image: string;
  interests: string[];
  mutualCount: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  bookingId?: string;
}

// Filter Chips Data
const filterChips = [
  { id: 'budget', icon: 'money-bill', label: 'Budget' },
  { id: 'near', icon: 'location-dot', label: 'Near' },
  { id: 'verified', icon: 'check-circle', label: 'Verified' },
  { id: 'single', icon: 'bed', label: 'Single' },
  { id: 'shared', icon: 'users', label: 'Shared' },
  { id: 'bills', icon: 'bolt', label: 'Bills' },
];

const popularLocations = [
  { name: 'Malabe', distance: 0.5 },
  { name: 'Kaduwela', distance: 3.2 },
  { name: 'Battaramulla', distance: 4.5 },
  { name: 'Kotte', distance: 5.8 },
  { name: 'Rajagiriya', distance: 7.2 },
  { name: 'Nugegoda', distance: 8.5 },
];

const lifestyleOptions = [
  { key: 'smoking', label: 'Non-Smoker', icon: '🚭' },
  { key: 'drinking', label: 'Non-Drinker', icon: '🚱' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
  { key: 'earlyBird', label: 'Early Bird', icon: '🌅' },
  { key: 'nightOwl', label: 'Night Owl', icon: '🌙' },
  { key: 'studyFocus', label: 'Study Focused', icon: '📚' },
  { key: 'quiet', label: 'Quiet', icon: '🤫' },
  { key: 'social', label: 'Social', icon: '🗣️' },
];

// Mini Listing Card Component
const MiniListingCard: React.FC<{ listing: Listing; type: 'passed' | 'liked' }> = ({ listing, type }) => {
  const formatPrice = (price: number): string => `Rs. ${price.toLocaleString()}`;
  
  return (
    <LinearGradient colors={['#181f36', '#0f172a']} style={styles.miniCard}>
      <View style={styles.miniCardInner}>
        <View style={styles.miniCardImageContainer}>
          <Image source={{ uri: listing.images[0] }} style={styles.miniCardImage} />
          <View style={[styles.miniCardOverlay, type === 'passed' ? styles.passedOverlay : styles.likedOverlay]}>
            <Icon name={type === 'passed' ? 'times-circle' : 'heart'} size={12} color="#fff" />
          </View>
        </View>
        <View style={styles.miniCardInfo}>
          <Text style={styles.miniCardTitle} numberOfLines={1}>{listing.title}</Text>
          <View style={styles.miniCardLocation}>
            <Icon name="location-dot" size={10} color="#a855f7" />
            <Text style={styles.miniCardLocationText} numberOfLines={1}>{listing.location}</Text>
          </View>
          <Text style={styles.miniCardPrice}>{formatPrice(listing.price)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Ranked Result Card Component
const RankedResultCard: React.FC<{ room: any; onPress: () => void }> = ({ room, onPress }) => {
  const formatPrice = (price: number): string => `Rs. ${price.toLocaleString()}/mo`;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient colors={['#181f36', '#232b47']} style={styles.rankedCard}>
        <View style={styles.rankedCardHeader}>
          <View style={styles.rankedCardTitleContainer}>
            <Text style={styles.rankedCardTitle}>{room.name}</Text>
          </View>
          <Text style={styles.rankedCardPrice}>{formatPrice(room.price)}</Text>
        </View>
        
        <View style={styles.rankedCardLocation}>
          <Icon name="location-dot" size={12} color="#f472b6" />
          <Text style={styles.rankedCardLocationText}>{room.location}</Text>
        </View>
        
        <View style={styles.rankedCardDetails}>
          <View style={styles.rankedCardDetail}>
            <Icon name="walking" size={12} color="#06b6d4" />
            <Text style={styles.rankedCardDetailText}>
              {room.distKm < 1 ? `${Math.round(room.distKm * 1000)}m` : `${room.distKm}km`} away
            </Text>
          </View>
          <View style={styles.rankedCardRating}>
            <Text style={styles.rankedCardRatingStars}>★</Text>
            <Text style={styles.rankedCardRatingText}>{room.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.rankedCardBadges}>
          <View style={[styles.badge, room.available ? styles.availableBadge : styles.occupiedBadge]}>
            <Text style={styles.badgeText}>{room.available ? 'Available' : 'Occupied'}</Text>
          </View>
          {room.facilities.slice(0, 3).map((fac: string, idx: number) => (
            <View key={idx} style={styles.facilityBadge}>
              <Text style={styles.facilityBadgeText}>{fac}</Text>
            </View>
          ))}
          {room.facilities.length > 3 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>+{room.facilities.length - 3}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Main Search Page Component
const SearchPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  // State variables
  const [activeTab, setActiveTab] = useState<'rooms' | 'map' | 'roommate'>('rooms');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortMode, setSortMode] = useState<'discovery' | 'relevance' | 'price-low' | 'price-high' | 'distance'>('discovery');
  
  // Filter states
  const [priceMax, setPriceMax] = useState(50000);
  const [dist, setDist] = useState('any');
  const [room, setRoom] = useState('any');
  const [avail, setAvail] = useState('all');
  const [facs, setFacs] = useState<string[]>([]);
  
  // Swipe states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<string | null>(null);
  const [likedListings, setLikedListings] = useState<Listing[]>([]);
  const [passedListings, setPassedListings] = useState<Listing[]>([]);
  
  // Data states
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [dbRoommates, setDbRoommates] = useState<Roommate[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [isRoommatesLoading, setIsRoommatesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI states
  const [showDetails, setShowDetails] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Listing | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', image: '' });
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Roommate Finder states
  const [roommateActiveSection, setRoommateActiveSection] = useState<'browse' | 'sent' | 'inbox' | 'groups'>('browse');
  const [likedProfiles, setLikedProfiles] = useState<Roommate[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<Roommate[]>([]);
  const [browseIndex, setBrowseIndex] = useState(0);
  const [browseAnimating, setBrowseAnimating] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [inboxRequests, setInboxRequests] = useState<any[]>([]);
  const [groupItems, setGroupItems] = useState<any[]>([]);
  
  // Animated values for swipe
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });
  const opacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });
  
  // PanResponder for swipe cards
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => viewMode === 'card' && !isAnimating,
      onMoveShouldSetPanResponder: () => viewMode === 'card' && !isAnimating,
      onPanResponderMove: (_, gesture) => {
        if (viewMode === 'card' && !isAnimating) {
          pan.setValue({ x: gesture.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (viewMode === 'card' && !isAnimating) {
          if (gesture.dx > 120) {
            handleLike();
          } else if (gesture.dx < -120) {
            handlePass();
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              friction: 5,
            }).start();
          }
        }
      },
    })
  ).current;
  
  // Filtered listings based on search and filters
  const filteredListings: Listing[] = dbListings.filter(listing => {
    if (searchTerm && !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !listing.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedFilters.includes('budget') && listing.price > 20000) return false;
    if (selectedFilters.includes('near') && listing.distance > 2) return false;
    if (selectedFilters.includes('verified') && !listing.verified) return false;
    if (selectedFilters.includes('single') && listing.roomType !== 'Single Room') return false;
    if (selectedFilters.includes('shared') && !listing.roomType.includes('Shared')) return false;
    if (selectedFilters.includes('bills') && !listing.billsIncluded) return false;
    return true;
  });
  
  const currentListing = filteredListings[currentIndex];
  
  // Load user data and listings
  useEffect(() => {
    loadUserData();
    loadListings();
    loadRoommates();
  }, []);
  
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('bb_current_user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          name: user.fullName || '',
          email: user.email || '',
          image: user.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  const loadListings = async () => {
    setIsListingsLoading(true);
    try {
      const token = await AsyncStorage.getItem('bb_access_token');
      const response = await fetch(`${API_BASE_URL}/api/roommates/rooms`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await response.json();
      
      const roomsData = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      
      const mappedListings: Listing[] = roomsData.map((item: any, index: number) => ({
        id: item._id || index + 1,
        title: item.name || 'Room Listing',
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://randomuser.me/api/portraits/lego/1.jpg'],
        price: Number(item.price) || 0,
        location: item.location || 'Unknown',
        distance: item.distance || 1,
        roomType: item.roomType || 'Single Room',
        genderPreference: item.genderPreference || 'Any',
        availableFrom: item.availableFrom || '',
        billsIncluded: item.billsIncluded || false,
        verified: true,
        badges: item.available ? ['Available'] : ['Occupied'],
        description: item.description || '',
        features: Array.isArray(item.facilities) ? item.facilities : [],
        deposit: Number(item.deposit) || Number(item.price) * 2,
        roommateCount: item.occupancy || 0,
      }));
      
      setDbListings(mappedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsListingsLoading(false);
    }
  };
  
  const loadRoommates = async () => {
    setIsRoommatesLoading(true);
    try {
      const token = await AsyncStorage.getItem('bb_access_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/api/roommates/browse`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      
      const roommateData = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      
      const mappedRoommates: Roommate[] = roommateData.map((profile: any) => ({
        id: profile._id || profile.id,
        userId: profile.userId || profile._id,
        name: profile.name || 'Student',
        email: profile.email || '',
        age: profile.age || 20,
        gender: profile.gender || 'Any',
        university: profile.university || 'SLIIT',
        bio: profile.bio || 'No bio provided.',
        image: profile.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        mutualCount: profile.mutualCount || 0,
      }));
      
      setDbRoommates(mappedRoommates);
    } catch (error) {
      console.error('Error loading roommates:', error);
    } finally {
      setIsRoommatesLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadListings(), loadRoommates()]);
    setRefreshing(false);
  };
  
  const handleLike = () => {
    if (!currentListing || isAnimating) return;
    
    setIsAnimating(true);
    setDirection('right');
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setLikedListings([...likedListings, currentListing]);
      setToastMessage('Added to favorites!');
      setShowToast(true);
      
      if (currentIndex < filteredListings.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(filteredListings.length);
      }
      
      pan.setValue({ x: 0, y: 0 });
      setDirection(null);
      setIsAnimating(false);
      
      setTimeout(() => setShowToast(false), 2000);
    });
  };
  
  const handlePass = () => {
    if (!currentListing || isAnimating) return;
    
    setIsAnimating(true);
    setDirection('left');
    Animated.timing(pan, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPassedListings([...passedListings, currentListing]);
      
      if (currentIndex < filteredListings.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(filteredListings.length);
      }
      
      pan.setValue({ x: 0, y: 0 });
      setDirection(null);
      setIsAnimating(false);
    });
  };
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      const lastPassed = passedListings[passedListings.length - 1];
      const lastLiked = likedListings[likedListings.length - 1];
      
      if (lastPassed && lastPassed.id === filteredListings[currentIndex - 1]?.id) {
        setPassedListings(passedListings.slice(0, -1));
      } else if (lastLiked && lastLiked.id === filteredListings[currentIndex - 1]?.id) {
        setLikedListings(likedListings.slice(0, -1));
      }
      
      setCurrentIndex(currentIndex - 1);
      setToastMessage('Action undone');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };
  
  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
    setCurrentIndex(0);
  };
  
  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDetails(true);
  };
  
  const handleBooking = (listing: Listing) => {
    setSelectedRoomForBooking(listing);
    setShowBooking(true);
  };
  
  const submitBooking = async (data: any) => {
    try {
      const token = await AsyncStorage.getItem('bb_access_token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setToastMessage(`Booking request submitted for ${selectedRoomForBooking?.title}!`);
        setShowToast(true);
        setShowBooking(false);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        Alert.alert('Error', 'Failed to submit booking request');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };
  
  // Roommate Finder Functions
  const handleRoommateLike = async (profile: Roommate) => {
    if (browseAnimating) return;
    setBrowseAnimating(true);
    
    setTimeout(() => {
      setLikedProfiles([...likedProfiles, profile]);
      setToastMessage(`Added ${profile.name} to favorites`);
      setShowToast(true);
      setBrowseIndex(prev => prev + 1);
      setBrowseAnimating(false);
      setTimeout(() => setShowToast(false), 2000);
    }, 260);
  };
  
  const handleRoommatePass = async (profile: Roommate) => {
    if (browseAnimating) return;
    setBrowseAnimating(true);
    
    setTimeout(() => {
      setPassedProfiles([...passedProfiles, profile]);
      setBrowseIndex(prev => prev + 1);
      setBrowseAnimating(false);
    }, 260);
  };
  
  const sendRoommateRequest = async () => {
    if (!selectedRoommate) return;
    
    try {
      const token = await AsyncStorage.getItem('bb_access_token');
      const response = await fetch(`${API_BASE_URL}/api/roommates/request/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedRoommate.userId,
          message: requestMessage.trim() || `Hi ${selectedRoommate.name}, I would like to connect as a roommate.`,
        }),
      });
      
      if (response.ok) {
        setToastMessage(`Request sent to ${selectedRoommate.name}`);
        setShowRequestModal(false);
        setRequestMessage('');
        setRoommateActiveSection('sent');
        setTimeout(() => setShowToast(false), 3000);
      } else {
        Alert.alert('Error', 'Failed to send request');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };
  
  const currentRoommateProfile = dbRoommates[browseIndex];
  
  // Render Functions
  const renderRoomsTab = () => {
    if (isListingsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      );
    }
    
    if (viewMode === 'card') {
      return (
        <View style={styles.swipeContainer}>
          {/* Passed List - Side panel (hidden on mobile, shown as section) */}
          <View style={styles.sidePanel}>
            <View style={styles.sidePanelHeader}>
              <Icon name="history" size={16} color="#ef4444" />
              <Text style={styles.sidePanelTitle}>Passed</Text>
              <Text style={styles.sidePanelCount}>{passedListings.length}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {passedListings.length > 0 ? (
                passedListings.map((listing) => (
                  <MiniListingCard key={listing.id} listing={listing} type="passed" />
                ))
              ) : (
                <Text style={styles.sidePanelEmptyText}>No passed listings</Text>
              )}
            </ScrollView>
          </View>
          
          {/* Main Swipe Card */}
          <View style={styles.swipeCardContainer}>
            {currentIndex < filteredListings.length && currentListing ? (
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.swipeCard,
                  {
                    transform: [{ translateX: pan.x }, { rotate: rotate }],
                    opacity: opacity,
                  },
                ]}
              >
                <LinearGradient colors={['#181f36', '#0f172a']} style={styles.swipeCardInner}>
                  <View style={styles.swipeCardImageContainer}>
                    <Image source={{ uri: currentListing.images[0] }} style={styles.swipeCardImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.swipeCardGradient}
                    />
                    <View style={styles.swipeCardBadges}>
                      {(currentListing.badges || []).map((badge) => (
                        <View key={badge} style={styles.swipeCardBadge}>
                          <Text style={styles.swipeCardBadgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.swipeCardPrice}>
                      <Text style={styles.swipeCardPriceText}>Rs. {currentListing.price.toLocaleString()}</Text>
                      <Text style={styles.swipeCardPricePeriod}>/month</Text>
                    </View>
                  </View>
                  
                  <View style={styles.swipeCardContent}>
                    <View style={styles.swipeCardHeader}>
                      <Text style={styles.swipeCardTitle}>{currentListing.title}</Text>
                      <View style={styles.swipeCardTravelTime}>
                        <Icon name="walking" size={12} color="#06b6d4" />
                        <Text style={styles.swipeCardTravelTimeText}>
                          {currentListing.distance < 1 
                            ? `${Math.round(currentListing.distance * 1000)}m` 
                            : `${currentListing.distance}km`}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.swipeCardLocation}>
                      <Icon name="location-dot" size={12} color="#a855f7" />
                      <Text style={styles.swipeCardLocationText}>
                        {currentListing.location} | {currentListing.distance}km from SLIIT
                      </Text>
                    </View>
                    
                    <View style={styles.swipeCardFeatures}>
                      <View style={styles.swipeCardFeature}>
                        <Icon name="users" size={10} color="#a855f7" />
                        <Text style={styles.swipeCardFeatureText}>{currentListing.genderPreference}</Text>
                      </View>
                      {currentListing.billsIncluded && (
                        <View style={styles.swipeCardFeature}>
                          <Icon name="bolt" size={10} color="#22c55e" />
                          <Text style={styles.swipeCardFeatureText}>Bills Included</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.swipeCardDescription} numberOfLines={2}>
                      {currentListing.description}
                    </Text>
                    
                    <TouchableOpacity onPress={() => handleViewDetails(currentListing)}>
                      <Text style={styles.swipeCardDetailsLink}>View details →</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Animated.View>
            ) : (
              <View style={styles.emptySwipeContainer}>
                <Icon name="check-circle" size={48} color="#06b6d4" />
                <Text style={styles.emptySwipeTitle}>All caught up!</Text>
                <Text style={styles.emptySwipeText}>You've reviewed all listings</Text>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={() => {
                    setCurrentIndex(0);
                    setLikedListings([]);
                    setPassedListings([]);
                  }}
                >
                  <Text style={styles.restartButtonText}>Restart Swipe</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Liked List - Side panel */}
          <View style={styles.sidePanel}>
            <View style={styles.sidePanelHeader}>
              <Icon name="bookmark" size={16} color="#22c55e" />
              <Text style={styles.sidePanelTitle}>Favorites</Text>
              <Text style={[styles.sidePanelCount, styles.likedCount]}>{likedListings.length}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {likedListings.length > 0 ? (
                likedListings.map((listing) => (
                  <MiniListingCard key={listing.id} listing={listing} type="liked" />
                ))
              ) : (
                <Text style={styles.sidePanelEmptyText}>No favorites yet</Text>
              )}
            </ScrollView>
            {likedListings.length > 0 && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All Favorites</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
    
    // Grid view
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>All Available Rooms ({filteredListings.length})</Text>
        <View style={styles.gridContainer}>
          {filteredListings.map((listing) => (
            <TouchableOpacity
              key={listing.id}
              style={styles.gridCard}
              onPress={() => handleViewDetails(listing)}
            >
              <Image source={{ uri: listing.images[0] }} style={styles.gridCardImage} />
              <View style={styles.gridCardBadges}>
                {(listing.badges || []).slice(0, 2).map((badge) => (
                  <View key={badge} style={styles.gridCardBadge}>
                    <Text style={styles.gridCardBadgeText}>{badge}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.gridCardPrice}>
                <Text style={styles.gridCardPriceText}>Rs. {listing.price.toLocaleString()}</Text>
              </View>
              <View style={styles.gridCardContent}>
                <Text style={styles.gridCardTitle} numberOfLines={1}>{listing.title}</Text>
                <View style={styles.gridCardLocation}>
                  <Icon name="location-dot" size={10} color="#a855f7" />
                  <Text style={styles.gridCardLocationText} numberOfLines={1}>{listing.location}</Text>
                </View>
                <View style={styles.gridCardTags}>
                  <View style={styles.gridCardTag}>
                    <Text style={styles.gridCardTagText}>{listing.roomType}</Text>
                  </View>
                  {listing.billsIncluded && (
                    <View style={styles.gridCardTag}>
                      <Text style={styles.gridCardTagText}>Bills</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  const renderRoommateTab = () => {
    if (isRoommatesLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text style={styles.loadingText}>Loading roommates...</Text>
        </View>
      );
    }
    
    if (roommateActiveSection === 'browse') {
      if (!dbRoommates.length) {
        return (
          <View style={styles.emptyContainer}>
            <Icon name="users" size={48} color="#6b7280" />
            <Text style={styles.emptyTitle}>No Roommates Found</Text>
            <Text style={styles.emptyText}>Check back later for matches</Text>
          </View>
        );
      }
      
      if (!currentRoommateProfile) {
        return (
          <View style={styles.emptyContainer}>
            <Icon name="check-circle" size={48} color="#06b6d4" />
            <Text style={styles.emptyTitle}>All reviewed!</Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => {
                setBrowseIndex(0);
                setLikedProfiles([]);
                setPassedProfiles([]);
              }}
            >
              <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        );
      }
      
      return (
        <View style={styles.roommateSwipeContainer}>
          <View style={styles.roommateCard}>
            <LinearGradient colors={['#181f36', '#0f172a']} style={styles.roommateCardInner}>
              <View style={styles.roommateCardImageContainer}>
                <Image source={{ uri: currentRoommateProfile.image }} style={styles.roommateCardImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.roommateCardGradient}
                />
              </View>
              
              <View style={styles.roommateCardContent}>
                <Text style={styles.roommateCardName}>
                  {currentRoommateProfile.name}, <Text style={styles.roommateCardAge}>{currentRoommateProfile.age}</Text>
                </Text>
                <Text style={styles.roommateCardInfo}>
                  {currentRoommateProfile.gender} | {currentRoommateProfile.university}
                </Text>
                <Text style={styles.roommateCardBio} numberOfLines={2}>
                  {currentRoommateProfile.bio}
                </Text>
                
                <View style={styles.roommateCardInterests}>
                  <Text style={styles.roommateCardInterestsLabel}>
                    {currentRoommateProfile.mutualCount} mutual interests
                  </Text>
                </View>
                
                <View style={styles.roommateCardInterestTags}>
                  {currentRoommateProfile.interests.slice(0, 4).map((interest, idx) => (
                    <View key={idx} style={styles.roommateInterestTag}>
                      <Text style={styles.roommateInterestTagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.roommateCardActions}>
                  <TouchableOpacity
                    style={[styles.roommateActionButton, styles.passButton]}
                    onPress={() => handleRoommatePass(currentRoommateProfile)}
                    disabled={browseAnimating}
                  >
                    <Icon name="times-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roommateActionButton, styles.likeButton]}
                    onPress={() => handleRoommateLike(currentRoommateProfile)}
                    disabled={browseAnimating}
                  >
                    <Icon name="heart" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      );
    }
    
    // Sent/Inbox/Groups views
    return (
      <ScrollView style={styles.roommateListContainer}>
        <View style={styles.roommateTabs}>
          <TouchableOpacity
            style={[styles.roommateTab, roommateActiveSection === 'sent' && styles.roommateTabActive]}
            onPress={() => setRoommateActiveSection('sent')}
          >
            <Text style={[styles.roommateTabText, roommateActiveSection === 'sent' && styles.roommateTabTextActive]}>
              Sent ({sentRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roommateTab, roommateActiveSection === 'inbox' && styles.roommateTabActive]}
            onPress={() => setRoommateActiveSection('inbox')}
          >
            <Text style={[styles.roommateTabText, roommateActiveSection === 'inbox' && styles.roommateTabTextActive]}>
              Inbox ({inboxRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roommateTab, roommateActiveSection === 'groups' && styles.roommateTabActive]}
            onPress={() => setRoommateActiveSection('groups')}
          >
            <Text style={[styles.roommateTabText, roommateActiveSection === 'groups' && styles.roommateTabTextActive]}>
              Groups ({groupItems.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.placeholderText}>
          {roommateActiveSection === 'sent' ? 'Sent requests will appear here' :
           roommateActiveSection === 'inbox' ? 'Incoming requests will appear here' :
           'Groups will appear here'}
        </Text>
      </ScrollView>
    );
  };
  
  return (
    <LinearGradient colors={['#0a1124', '#131d3a', '#0b132b']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.logo}>BoardingBook</Text>
            <Text style={styles.logoSubtitle}>Find & Search</Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setShowNotifications(!showNotifications)}
              style={styles.notificationButton}
            >
              <Icon name="bell" size={20} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
              <Image source={{ uri: currentUser.image }} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rooms' && styles.tabActive]}
            onPress={() => setActiveTab('rooms')}
          >
            <LinearGradient
              colors={activeTab === 'rooms' ? ['#06b6d4', '#a855f7'] : ['transparent', 'transparent']}
              style={styles.tabGradient}
            >
              <Text style={[styles.tabText, activeTab === 'rooms' && styles.tabTextActive]}>Rooms</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'map' && styles.tabActive]}
            onPress={() => setActiveTab('map')}
          >
            <LinearGradient
              colors={activeTab === 'map' ? ['#06b6d4', '#a855f7'] : ['transparent', 'transparent']}
              style={styles.tabGradient}
            >
              <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>Map View</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'roommate' && styles.tabActive]}
            onPress={() => setActiveTab('roommate')}
          >
            <LinearGradient
              colors={activeTab === 'roommate' ? ['#06b6d4', '#a855f7'] : ['transparent', 'transparent']}
              style={styles.tabGradient}
            >
              <Text style={[styles.tabText, activeTab === 'roommate' && styles.tabTextActive]}>Matches</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* View Mode Toggle for Rooms */}
        {activeTab === 'rooms' && (
          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'card' && styles.viewModeActive]}
              onPress={() => setViewMode('card')}
            >
              <Icon name="th-large" size={16} color={viewMode === 'card' ? '#fff' : '#9ca3af'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeActive]}
              onPress={() => setViewMode('grid')}
            >
              <Icon name="list" size={16} color={viewMode === 'grid' ? '#fff' : '#9ca3af'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search and Filters - Only for Rooms tab */}
        {activeTab === 'rooms' && (
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Icon name="search" size={16} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by location or keyword..."
                placeholderTextColor="#6b7280"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.filterChip, showFilters && styles.filterChipActive]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Icon name="filter" size={12} color={showFilters ? '#fff' : '#9ca3af'} />
                <Text style={[styles.filterChipText, showFilters && styles.filterChipTextActive]}>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Text>
              </TouchableOpacity>
              
              {filterChips.map((chip) => (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.filterChip, selectedFilters.includes(chip.id) && styles.filterChipSelected]}
                  onPress={() => toggleFilter(chip.id)}
                >
                  <Icon name={chip.icon} size={12} color={selectedFilters.includes(chip.id) ? '#fff' : '#9ca3af'} />
                  <Text style={[styles.filterChipText, selectedFilters.includes(chip.id) && styles.filterChipTextSelected]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {showFilters && (
              <View style={styles.filtersPanel}>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Max Price: Rs. {priceMax.toLocaleString()}</Text>
                  {/* Price slider would go here - using simplified input */}
                  <TextInput
                    style={styles.filterInput}
                    value={String(priceMax)}
                    onChangeText={(v) => setPriceMax(Number(v) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Distance</Text>
                  <Picker
                    selectedValue={dist}
                    onValueChange={setDist}
                    style={styles.filterPicker}
                  >
                    <Picker.Item label="Any" value="any" />
                    <Picker.Item label="500m" value="500m" />
                    <Picker.Item label="1km" value="walking" />
                    <Picker.Item label="2km" value="cycling" />
                    <Picker.Item label="5km" value="bus" />
                  </Picker>
                </View>
                
                <TouchableOpacity
                  style={styles.resetFiltersButton}
                  onPress={() => {
                    setPriceMax(50000);
                    setDist('any');
                    setRoom('any');
                    setAvail('all');
                    setFacs([]);
                    setSelectedFilters([]);
                  }}
                >
                  <Text style={styles.resetFiltersText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* Main Content */}
        {activeTab === 'rooms' && renderRoomsTab()}
        {activeTab === 'map' && (
          <View style={styles.mapPlaceholder}>
            <Icon name="map" size={48} color="#6b7280" />
            <Text style={styles.mapPlaceholderText}>Map View Coming Soon</Text>
          </View>
        )}
        {activeTab === 'roommate' && renderRoommateTab()}
      </ScrollView>
      
      {/* Details Modal */}
      <Modal visible={showDetails} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#181f36', '#0f172a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Room Details</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)} style={styles.modalClose}>
                <Icon name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedListing && (
                <>
                  <Image source={{ uri: selectedListing.images[0] }} style={styles.modalImage} />
                  
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalListingTitle}>{selectedListing.title}</Text>
                    
                    <View style={styles.modalDetailRow}>
                      <Icon name="money-bill" size={16} color="#22c55e" />
                      <Text style={styles.modalDetailLabel}>Price:</Text>
                      <Text style={styles.modalDetailValue}>Rs. {selectedListing.price.toLocaleString()}/month</Text>
                    </View>
                    
                    <View style={styles.modalDetailRow}>
                      <Icon name="location-dot" size={16} color="#a855f7" />
                      <Text style={styles.modalDetailLabel}>Location:</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedListing.location} ({selectedListing.distance}km from SLIIT)
                      </Text>
                    </View>
                    
                    <View style={styles.modalDetailRow}>
                      <Icon name="bed" size={16} color="#06b6d4" />
                      <Text style={styles.modalDetailLabel}>Room Type:</Text>
                      <Text style={styles.modalDetailValue}>{selectedListing.roomType}</Text>
                    </View>
                    
                    <View style={styles.modalDescription}>
                      <Text style={styles.modalDescriptionTitle}>Description</Text>
                      <Text style={styles.modalDescriptionText}>{selectedListing.description}</Text>
                    </View>
                    
                    <View style={styles.modalFeatures}>
                      <Text style={styles.modalFeaturesTitle}>Features</Text>
                      <View style={styles.modalFeaturesList}>
                        {(selectedListing.features || []).map((feature, idx) => (
                          <View key={idx} style={styles.modalFeatureTag}>
                            <Text style={styles.modalFeatureTagText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => {
                        setShowDetails(false);
                        handleBooking(selectedListing);
                      }}
                    >
                      <LinearGradient colors={['#06b6d4', '#22c55e']} style={styles.bookButtonGradient}>
                        <Icon name="check-circle" size={16} color="#fff" />
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
      
      {/* Booking Modal */}
      <Modal visible={showBooking} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#181f36', '#0f172a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Form</Text>
              <TouchableOpacity onPress={() => setShowBooking(false)} style={styles.modalClose}>
                <Icon name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingInfoTitle}>Selected Room</Text>
                <Text style={styles.bookingInfoText}>{selectedRoomForBooking?.title}</Text>
              </View>
              
              <View style={styles.bookingForm}>
                <Text style={styles.bookingLabel}>Full Name *</Text>
                <TextInput style={styles.bookingInput} placeholder="Enter full name" placeholderTextColor="#6b7280" />
                
                <Text style={styles.bookingLabel}>Contact Number *</Text>
                <TextInput style={styles.bookingInput} placeholder="e.g., 0771234567" placeholderTextColor="#6b7280" keyboardType="phone-pad" />
                
                <Text style={styles.bookingLabel}>Move-in Date *</Text>
                <TextInput style={styles.bookingInput} placeholder="YYYY-MM-DD" placeholderTextColor="#6b7280" />
                
                <Text style={styles.bookingLabel}>Duration (months) *</Text>
                <TextInput style={styles.bookingInput} placeholder="e.g., 6" placeholderTextColor="#6b7280" keyboardType="numeric" />
                
                <View style={styles.bookingActions}>
                  <TouchableOpacity style={styles.bookingCancel} onPress={() => setShowBooking(false)}>
                    <Text style={styles.bookingCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookingSubmit}
                    onPress={() => submitBooking({})}
                  >
                    <LinearGradient colors={['#06b6d4', '#a855f7']} style={styles.bookingSubmitGradient}>
                      <Text style={styles.bookingSubmitText}>Submit Request</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
      
      {/* Request Modal for Roommate */}
      <Modal visible={showRequestModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#181f36', '#0f172a']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.requestModalHeader}>
                <Image source={{ uri: selectedRoommate?.image }} style={styles.requestModalImage} />
                <View>
                  <Text style={styles.modalTitle}>Send Request</Text>
                  <Text style={styles.requestModalSubtitle}>to {selectedRoommate?.name}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowRequestModal(false)} style={styles.modalClose}>
                <Icon name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.requestModalBody}>
              <Text style={styles.requestModalLabel}>Message (Optional)</Text>
              <TextInput
                style={styles.requestModalInput}
                multiline
                numberOfLines={4}
                placeholder="Hi! I'm also looking for a roommate near SLIIT..."
                placeholderTextColor="#6b7280"
                value={requestMessage}
                onChangeText={setRequestMessage}
              />
              
              <View style={styles.requestModalActions}>
                <TouchableOpacity style={styles.requestModalCancel} onPress={() => setShowRequestModal(false)}>
                  <Text style={styles.requestModalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.requestModalSend} onPress={sendRoommateRequest}>
                  <LinearGradient colors={['#06b6d4', '#a855f7']} style={styles.requestModalSendGradient}>
                    <Text style={styles.requestModalSendText}>Send Request</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
      
      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <Icon name="check-circle" size={16} color="#22c55e" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 31, 54, 0.5)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
  },
  tabGradient: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabActive: {
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#fff',
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  viewModeActive: {
    backgroundColor: '#06b6d4',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  filterChips: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#06b6d4',
  },
  filterChipSelected: {
    backgroundColor: '#a855f7',
  },
  filterChipText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  filtersPanel: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    color: '#06b6d4',
    marginBottom: 4,
  },
  filterInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
  },
  filterPicker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#fff',
  },
  resetFiltersButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  swipeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sidePanel: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 8,
    maxHeight: 500,
  },
  sidePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sidePanelTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },
  sidePanelCount: {
    fontSize: 12,
    color: '#ef4444',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  likedCount: {
    color: '#22c55e',
    backgroundColor: 'rgba(34,197,94,0.2)',
  },
  sidePanelEmptyText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  viewAllButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  swipeCardContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeCard: {
    width: SCREEN_WIDTH * 0.55,
    backgroundColor: '#181f36',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  swipeCardInner: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  swipeCardImageContainer: {
    height: 200,
    position: 'relative',
  },
  swipeCardImage: {
    width: '100%',
    height: '100%',
  },
  swipeCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  swipeCardBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  swipeCardBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeCardBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  swipeCardPrice: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  swipeCardPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  swipeCardPricePeriod: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 2,
  },
  swipeCardContent: {
    padding: 12,
  },
  swipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  swipeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  swipeCardTravelTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6,182,212,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeCardTravelTimeText: {
    fontSize: 10,
    color: '#06b6d4',
  },
  swipeCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  swipeCardLocationText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  swipeCardFeatures: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  swipeCardFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeCardFeatureText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  swipeCardDescription: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
  },
  swipeCardDetailsLink: {
    fontSize: 11,
    color: '#06b6d4',
  },
  emptySwipeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptySwipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  emptySwipeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  restartButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#06b6d4',
    borderRadius: 20,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (SCREEN_WIDTH - 32) / 2 - 6,
    backgroundColor: '#181f36',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gridCardImage: {
    width: '100%',
    height: 120,
  },
  gridCardBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  gridCardBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridCardBadgeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '600',
  },
  gridCardPrice: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gridCardPriceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  gridCardContent: {
    padding: 8,
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  gridCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  gridCardLocationText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  gridCardTags: {
    flexDirection: 'row',
    gap: 6,
  },
  gridCardTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridCardTagText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#06b6d4',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  mapPlaceholderText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  roommateSwipeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  roommateCard: {
    width: SCREEN_WIDTH - 32,
    backgroundColor: '#181f36',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  roommateCardInner: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  roommateCardImageContainer: {
    height: 300,
    position: 'relative',
  },
  roommateCardImage: {
    width: '100%',
    height: '100%',
  },
  roommateCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  roommateCardContent: {
    padding: 16,
  },
  roommateCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  roommateCardAge: {
    color: '#f472b6',
  },
  roommateCardInfo: {
    fontSize: 12,
    color: '#06b6d4',
    marginTop: 4,
  },
  roommateCardBio: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
  },
  roommateCardInterests: {
    marginTop: 12,
    alignItems: 'center',
  },
  roommateCardInterestsLabel: {
    fontSize: 11,
    color: '#a855f7',
    backgroundColor: 'rgba(168,85,247,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roommateCardInterestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'center',
  },
  roommateInterestTag: {
    backgroundColor: 'rgba(6,182,212,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roommateInterestTagText: {
    fontSize: 10,
    color: '#06b6d4',
  },
  roommateCardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  roommateActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#ef4444',
  },
  likeButton: {
    backgroundColor: '#22c55e',
  },
  roommateListContainer: {
    flex: 1,
  },
  roommateTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24,31,54,0.5)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
  },
  roommateTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26,
  },
  roommateTabActive: {
    backgroundColor: '#06b6d4',
  },
  roommateTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roommateTabTextActive: {
    color: '#fff',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalClose: {
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalInfo: {
    padding: 16,
  },
  modalListingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalDetailLabel: {
    fontSize: 13,
    color: '#9ca3af',
    width: 70,
  },
  modalDetailValue: {
    fontSize: 13,
    color: '#fff',
    flex: 1,
  },
  modalDescription: {
    marginTop: 16,
  },
  modalDescriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: 8,
  },
  modalDescriptionText: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  modalFeatures: {
    marginTop: 16,
  },
  modalFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: 8,
  },
  modalFeaturesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalFeatureTag: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalFeatureTagText: {
    fontSize: 11,
    color: '#a855f7',
  },
  bookButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bookingInfo: {
    backgroundColor: 'rgba(6,182,212,0.1)',
    padding: 12,
    borderRadius: 12,
    margin: 16,
  },
  bookingInfoTitle: {
    fontSize: 12,
    color: '#06b6d4',
    marginBottom: 4,
  },
  bookingInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bookingForm: {
    padding: 16,
  },
  bookingLabel: {
    fontSize: 13,
    color: '#06b6d4',
    marginBottom: 6,
    marginTop: 12,
  },
  bookingInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  bookingCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  bookingCancelText: {
    color: '#fff',
    fontSize: 14,
  },
  bookingSubmit: {
    flex: 1,
  },
  bookingSubmitGradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookingSubmitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  requestModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestModalImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requestModalSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
  requestModalBody: {
    padding: 16,
  },
  requestModalLabel: {
    fontSize: 13,
    color: '#06b6d4',
    marginBottom: 8,
  },
  requestModalInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  requestModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  requestModalCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  requestModalCancelText: {
    color: '#fff',
    fontSize: 14,
  },
  requestModalSend: {
    flex: 1,
  },
  requestModalSendGradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestModalSendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
  },
  miniCard: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  miniCardInner: {
    flexDirection: 'row',
    padding: 8,
  },
  miniCardImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  miniCardImage: {
    width: '100%',
    height: '100%',
  },
  miniCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passedOverlay: {
    backgroundColor: 'rgba(239,68,68,0.3)',
  },
  likedOverlay: {
    backgroundColor: 'rgba(34,197,94,0.3)',
  },
  miniCardInfo: {
    flex: 1,
    marginLeft: 8,
  },
  miniCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  miniCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  miniCardLocationText: {
    fontSize: 9,
    color: '#9ca3af',
  },
  miniCardPrice: {
    fontSize: 9,
    color: '#06b6d4',
    fontWeight: 'bold',
    marginTop: 2,
  },
  rankedCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rankedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rankedCardTitleContainer: {
    flex: 1,
  },
  rankedCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankedCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  rankedCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  rankedCardLocationText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  rankedCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankedCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankedCardDetailText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  rankedCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rankedCardRatingStars: {
    fontSize: 12,
    color: '#eab308',
  },
  rankedCardRatingText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  rankedCardBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: 'rgba(34,197,94,0.2)',
  },
  occupiedBadge: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  badgeText: {
    fontSize: 9,
    color: '#22c55e',
  },
  facilityBadge: {
    backgroundColor: 'rgba(6,182,212,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  facilityBadgeText: {
    fontSize: 9,
    color: '#06b6d4',
  },
  moreBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreBadgeText: {
    fontSize: 9,
    color: '#9ca3af',
  },
});

export default SearchPage;