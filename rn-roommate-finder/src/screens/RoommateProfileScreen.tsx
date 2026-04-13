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
  { label: 'Studio/Annex', icon: 'home' },
  { label: 'Any', icon: 'any' },
];

const lifestyleOptions = [
  { key: 'smoking', label: 'Non-Smoker', icon: '🚭' },
  { key: 'drinking', label: 'Non-Drinker', icon: '🚱' },
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
  { key: 'earlyBird', label: 'Early Bird', icon: '🌅' },
  { key: 'nightOwl', label: 'Night Owl', icon: '🌙' },
  { key: 'studyFocus', label: 'Study Focused', icon: '📚' },
  { key: 'petFriendly', label: 'Pet Friendly', icon: '🐾' },
  { key: 'musicLover', label: 'Music Lover', icon: '🎵' },
  { key: 'quiet', label: 'Quiet', icon: '🤫' },
  { key: 'social', label: 'Social', icon: '🗣️' },
];

const popularLocations = [
  { name: 'Malabe', distance: 0.5 },
  { name: 'Kaduwela', distance: 3.2 },
  { name: 'Battaramulla', distance: 4.5 },
  { name: 'Kotte', distance: 5.8 },
  { name: 'Rajagiriya', distance: 7.2 },
  { name: 'Nugegoda', distance: 8.5 },
];

interface StepConfig {
  id: number;
  title: string;
  icon: string;
  color: string[];
}

const steps: StepConfig[] = [
  { id: 1, title: 'Photo', icon: 'camera', color: ['#06b6d4', '#0891b2'] },
  { id: 2, title: 'Bio', icon: 'comment', color: ['#a855f7', '#7e22ce'] },
  { id: 3, title: 'Budget', icon: 'money-bill', color: ['#6366f1', '#4f46e5'] },
  { id: 4, title: 'Details', icon: 'user', color: ['#ec4899', '#be185d'] },
  { id: 5, title: 'Roommate', icon: 'home', color: ['#f97316', '#ea580c'] },
];

const ProfileSetupScreen: React.FC = ({ navigation }: any) => {
  // State variables
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [fullName, setFullName] = useState('');
  const [minBudget, setMinBudget] = useState(15000);
  const [maxBudget, setMaxBudget] = useState(50000);
  const [distance, setDistance] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [year, setYear] = useState('');
  const [roommate, setRoommate] = useState('');
  const [roomType, setRoomType] = useState<string>('');
  const [lifestylePrefs, setLifestylePrefs] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const totalSteps = 5;

  const isOnboardingComplete = Boolean(
    photo &&
      bio &&
      minBudget &&
      maxBudget &&
      distance &&
      gender &&
      Number(age) > 0 &&
      year &&
      roommate
  );

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('bb_current_user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.fullName) setFullName(user.fullName);
        if (user.age) setAge(String(user.age));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        includeBase64: true,
        mediaType: 'photo',
      });

      setPhoto(`data:${image.mime};base64,${image.data}`);
      setPhotoFile(image);
    } catch (error) {
      console.log('Image picker cancelled or error:', error);
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return bio.trim().length > 0;
      case 3:
        return Boolean(minBudget && maxBudget && distance);
      case 4:
        return Boolean(gender && year && Number(age) >= 16 && Number(age) <= 60);
      case 5:
        return Boolean(roommate);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, totalSteps));
    } else {
      Alert.alert('Incomplete', 'Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setError('');
    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('bb_access_token');

      if (!token) {
        setError('Your session has expired. Please sign in again.');
        setSubmitting(false);
        navigation.navigate('SignIn');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          profilePicture: photo || '',
          bio: bio.trim(),
          minBudget,
          maxBudget,
          distance,
          selectedLocation: selectedLocation || '',
          gender,
          age: Number(age) || 0,
          academicYear: year,
          roommatePreference: roommate,
          roomType,
          lifestylePrefs,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not save profile');
      }

      setSubmitting(false);
      setSuccess('Profile completed!');
      setTimeout(() => {
        navigation.navigate('Find');
      }, 2000);
    } catch (submitError) {
      setSubmitting(false);
      setError(submitError instanceof Error ? submitError.message : 'Failed to save profile');
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(1)}L`;
    }
    return `Rs. ${(price / 1000).toFixed(0)}k`;
  };

  const getTransportIcon = (dist: number) => {
    if (dist <= 1) return '🚶';
    if (dist <= 2) return '🚲';
    if (dist <= 3) return '🏍️';
    if (dist <= 5) return '🚌';
    return '🚗';
  };

  const getTransportText = (dist: number) => {
    if (dist <= 1) return 'Walking distance';
    if (dist <= 2) return 'Bike friendly';
    if (dist <= 3) return 'Short commute (tuk-tuk)';
    if (dist <= 5) return 'Bus ride';
    return 'Need vehicle';
  };

  const StepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {steps.map((s) => {
        const isActive = s.id === step;
        const isCompleted = s.id < step;
        return (
          <View key={s.id} style={styles.stepItem}>
            <TouchableOpacity
              onPress={() => s.id < step && setStep(s.id)}
              disabled={s.id > step}
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}>
              {isCompleted ? (
                <Icon name="check" size={16} color="#fff" />
              ) : (
                <Icon name={s.icon} size={16} color={isActive ? '#fff' : '#6b7280'} />
              )}
            </TouchableOpacity>
            <Text
              style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
                isCompleted && styles.stepLabelCompleted,
              ]}>
              {s.title}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={handlePhotoUpload} style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <LinearGradient colors={['#06b6d4', '#0891b2']} style={styles.photoPlaceholder}>
            <Icon name="camera" size={40} color="#fff" />
            <Text style={styles.photoPlaceholderText}>Upload Photo</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
      <Text style={styles.photoHint}>
        JPG/PNG, max 5MB. Clear face recommended.
      </Text>
      <Text style={styles.photoHint}>
        🔒 Only visible to potential roommates
      </Text>
      <Text style={styles.photoMatchText}>
        ✨ Profiles with photos get 3× more matches!
      </Text>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
        multiline
        maxLength={180}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself... (e.g., major, hobbies, lifestyle)"
        placeholderTextColor="#6b7280"
      />
      <Text style={styles.charCount}>
        {bio.length}/180
      </Text>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="money-bill" size={20} color="#4ade80" />
          <Text style={styles.sectionTitle}>Monthly Budget (LKR)</Text>
        </View>
        
        <View style={styles.budgetRangeContainer}>
          <View style={styles.budgetBox}>
            <Text style={styles.budgetLabel}>MIN</Text>
            <Text style={styles.budgetValue}>{formatPrice(minBudget)}</Text>
          </View>
          <Text style={styles.budgetDash}>—</Text>
          <View style={styles.budgetBox}>
            <Text style={styles.budgetLabel}>MAX</Text>
            <Text style={styles.budgetValue}>{formatPrice(maxBudget)}</Text>
          </View>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={5000}
          maximumValue={200000}
          value={minBudget}
          onValueChange={setMinBudget}
          minimumTrackTintColor="#06b6d4"
          maximumTrackTintColor="#374151"
          thumbTintColor="#06b6d4"
        />
        <Slider
          style={styles.slider}
          minimumValue={5000}
          maximumValue={200000}
          value={maxBudget}
          onValueChange={setMaxBudget}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#374151"
          thumbTintColor="#a855f7"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="location-dot" size={20} color="#a855f7" />
          <Text style={styles.sectionTitle}>Distance from SLIIT</Text>
        </View>

        <View style={styles.distanceCard}>
          <Text style={styles.distanceValue}>{distance} km</Text>
          <Text style={styles.distanceIcon}>{getTransportIcon(distance)}</Text>
          <Text style={styles.distanceText}>{getTransportText(distance)}</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={10}
          step={0.5}
          value={distance}
          onValueChange={setDistance}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#374151"
          thumbTintColor="#a855f7"
        />

        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => setShowLocationModal(true)}>
          <Icon name="map-pin" size={16} color="#a855f7" />
          <Text style={styles.locationButtonText}>
            {selectedLocation || 'Select preferred area'}
          </Text>
        </TouchableOpacity>

        <View style={styles.popularAreas}>
          <Text style={styles.popularAreasTitle}>Popular Areas</Text>
          <View style={styles.popularAreasGrid}>
            {popularLocations.map((loc) => (
              <TouchableOpacity
                key={loc.name}
                style={[
                  styles.areaButton,
                  selectedLocation === loc.name && styles.areaButtonSelected,
                ]}
                onPress={() => {
                  setSelectedLocation(loc.name);
                  setDistance(loc.distance);
                }}>
                <Text style={styles.areaButtonText}>{loc.name}</Text>
                <Text style={styles.areaDistance}>{loc.distance}km</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#6b7280"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}>
            <Picker.Item label="Select gender" value="" />
            {genders.map(g => <Picker.Item key={g} label={g} value={g} />)}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Enter your age"
          placeholderTextColor="#6b7280"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Academic Year</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={year}
            onValueChange={setYear}
            style={styles.picker}>
            <Picker.Item label="Select year" value="" />
            {academicYears.map(y => <Picker.Item key={y} label={y} value={y} />)}
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Roommate Preferences</Text>
        <View style={styles.optionsGrid}>
          {roommatePrefs.map((pref) => (
            <TouchableOpacity
              key={pref}
              style={[
                styles.optionButton,
                roommate === pref && styles.optionButtonSelected,
              ]}
              onPress={() => setRoommate(pref)}>
              <Text style={[
                styles.optionButtonText,
                roommate === pref && styles.optionButtonTextSelected,
              ]}>{pref}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Room Type</Text>
        <View style={styles.optionsGrid}>
          {roomTypes.map((type) => (
            <TouchableOpacity
              key={type.label}
              style={[
                styles.optionButton,
                roomType === type.label && styles.optionButtonSelected,
              ]}
              onPress={() => setRoomType(type.label)}>
              <Icon name={type.icon} size={16} color={roomType === type.label ? '#fff' : '#9ca3af'} />
              <Text style={[
                styles.optionButtonText,
                roomType === type.label && styles.optionButtonTextSelected,
              ]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lifestyle & Habits</Text>
        <View style={styles.lifestyleGrid}>
          {lifestyleOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.lifestyleButton,
                lifestylePrefs.includes(opt.key) && styles.lifestyleButtonSelected,
              ]}
              onPress={() => {
                setLifestylePrefs(prev =>
                  prev.includes(opt.key)
                    ? prev.filter(k => k !== opt.key)
                    : [...prev, opt.key]
                );
              }}>
              <Text style={styles.lifestyleIcon}>{opt.icon}</Text>
              <Text style={[
                styles.lifestyleText,
                lifestylePrefs.includes(opt.key) && styles.lifestyleTextSelected,
              ]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const LocationModal = () => (
    <Modal
      visible={showLocationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowLocationModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Area</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {popularLocations.map((loc) => (
              <TouchableOpacity
                key={loc.name}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedLocation(loc.name);
                  setDistance(loc.distance);
                  setShowLocationModal(false);
                }}>
                <Icon name="map-pin" size={20} color="#a855f7" />
                <Text style={styles.modalItemText}>{loc.name}</Text>
                <Text style={styles.modalItemDistance}>{loc.distance} km</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#0a1124', '#1a1f35', '#0f172a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Complete Your Profile
          </Text>
          <Text style={styles.subtitle}>
            Join thousands of students finding their perfect roommates
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Step {step} of {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
          </View>
        </View>

        <StepIndicator />

        <LinearGradient
          colors={['rgba(10,17,36,0.8)', 'rgba(19,29,58,0.8)']}
          style={styles.formContainer}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </LinearGradient>

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="chevron-left" size={16} color="#fff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {step < totalSteps ? (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, !validateStep() && styles.buttonDisabled]}>
              <LinearGradient
                colors={['#06b6d4', '#a855f7']}
                style={styles.gradientButton}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="chevron-right" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.submitButton, (!validateStep() || submitting) && styles.buttonDisabled]}>
              <LinearGradient
                colors={['#22c55e', '#06b6d4']}
                style={styles.gradientButton}>
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Complete Profile</Text>
                    <Icon name="check" size={16} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.footerText}>
          Your information is secure and will only be used for matching
        </Text>
      </ScrollView>

      <LocationModal />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#06b6d4',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1f2937',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 2,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#06b6d4',
  },
  stepCircleCompleted: {
    backgroundColor: '#22c55e',
  },
  stepLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  stepLabelActive: {
    color: '#06b6d4',
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: '#22c55e',
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stepContainer: {
    minHeight: 300,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  photoPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  photoHint: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  photoMatchText: {
    fontSize: 12,
    color: '#a855f7',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a1124',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  bioInput: {
    backgroundColor: '#0a1124',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
    padding: 12,
    color: '#fff',
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  budgetRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6,182,212,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  budgetBox: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  budgetDash: {
    fontSize: 24,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  distanceIcon: {
    fontSize: 24,
  },
  distanceText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  popularAreas: {
    marginTop: 16,
  },
  popularAreasTitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  popularAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  areaButtonSelected: {
    backgroundColor: '#a855f7',
  },
  areaButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  areaDistance: {
    color: '#9ca3af',
    fontSize: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#0a1124',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#a855f7',
  },
  optionButtonText: {
    color: '#9ca3af',
    fontSize: 13,
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lifestyleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lifestyleButtonSelected: {
    backgroundColor: '#06b6d4',
  },
  lifestyleIcon: {
    fontSize: 14,
  },
  lifestyleText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  lifestyleTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  nextButton: {
    flex: 1,
    marginLeft: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    marginLeft: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  successContainer: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#22c55e',
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#4b5563',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  modalItemDistance: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default ProfileSetupScreen;