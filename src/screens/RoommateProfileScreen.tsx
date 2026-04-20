import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Constants
const API_BASE_URL = 'http://localhost:5000';
const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const genders = ['Male', 'Female', 'Other'];
const roommatePrefs = [
  'Same Gender',
  'Any Gender',
  'Find a Boarding (Bodim)',
  'Find a Compatible Roommate',
];

const roomTypes = [
  { label: 'Single Room', icon: 'bed' },
  { label: 'Shared Room', icon: 'users' },
];
// ...rest of the file
