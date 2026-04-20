import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { BookingRecord, BookingStatus, BookingType } from '../types';
import {
  fetchAgreementPdf,
  fetchBookings,
  generateAgreement,
  ownerConfirmAgreement,
  ownerDecision,
  signAgreementAsStudent,
  submitBookingRequest,
} from '../api/bookingAgreementApi';

type UserRole = 'student' | 'owner';

interface FormState {
  requesterName: string;
  bookingType: BookingType;
  studentNamesCsv: string;
  roomDetails: string;
  monthlyRent: string;
  periodStart: string;
  periodEnd: string;
}

const statusLabels: Record<BookingStatus, string> = {
  requested: 'Requested',
  rejected: 'Rejected',
  approved: 'Approved',
  agreement_pending_signatures: 'Agreement Pending Signatures',
  signed_ready_for_owner: 'Ready For Owner Confirmation',
  completed: 'Completed',
};

const BookingAgreementScreen: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [actingStudentName, setActingStudentName] = useState('');
  const [ownerDecisionNote, setOwnerDecisionNote] = useState('');
  const [reviewChecks, setReviewChecks] = useState<Record<string, boolean>>({});
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    requesterName: '',
    bookingType: 'individual',
    studentNamesCsv: '',
    roomDetails: '',
    monthlyRent: '',
    periodStart: '2026-05-01',
    periodEnd: '2026-12-31',
  });

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [bookings],
  );

  const updateForm = (key: keyof FormState, value: string) => {
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load bookings';
      Alert.alert('Backend connection issue', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const upsertBooking = (updatedBooking: BookingRecord) => {
    setBookings((previous) => {
      const exists = previous.some((item) => item.id === updatedBooking.id);
      if (!exists) {
        return [updatedBooking, ...previous];
      }
      return previous.map((item) => (item.id === updatedBooking.id ? updatedBooking : item));
    });
  };

  const submitBooking = async () => {
    const names = formState.studentNamesCsv
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    const rent = Number(formState.monthlyRent);

    if (!formState.requesterName.trim()) {
      Alert.alert('Missing requester', 'Please enter requester name.');
      return;
    }

    if (names.length === 0) {
      Alert.alert('Missing students', 'Provide at least one student name.');
      return;
    }

    if (formState.bookingType === 'group' && names.length < 2) {
      Alert.alert('Group booking needs multiple students', 'Add at least 2 students for a group booking.');
      return;
    }

    if (!formState.roomDetails.trim()) {
      Alert.alert('Missing room details', 'Please provide room details.');
      return;
    }

    if (!Number.isFinite(rent) || rent <= 0) {
      Alert.alert('Invalid rent', 'Please provide a valid monthly rent value.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdBooking = await submitBookingRequest({
        bookingType: formState.bookingType,
        requesterName: formState.requesterName.trim(),
        studentNames: names,
        roomDetails: formState.roomDetails.trim(),
        monthlyRent: rent,
        periodStart: formState.periodStart.trim(),
        periodEnd: formState.periodEnd.trim(),
      });

      upsertBooking(createdBooking);
      setFormState((previous) => ({
        ...previous,
        requesterName: '',
        studentNamesCsv: '',
        roomDetails: '',
        monthlyRent: '',
      }));
      setActingStudentName(names[0]);
      Alert.alert('Booking submitted', 'Booking request has been saved in backend and sent for owner review.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit booking';
      Alert.alert('Submission failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ownerApprove = async (bookingId: string) => {
    setActiveBookingId(bookingId);
    try {
      const updatedBooking = await ownerDecision(bookingId, 'approve', ownerDecisionNote.trim());
      upsertBooking(updatedBooking);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve booking';
      Alert.alert('Approval failed', message);
    } finally {
      setActiveBookingId(null);
    }
  };

  const ownerReject = async (bookingId: string) => {
    setActiveBookingId(bookingId);
    try {
      const updatedBooking = await ownerDecision(bookingId, 'reject', ownerDecisionNote.trim());
      upsertBooking(updatedBooking);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reject booking';
      Alert.alert('Rejection failed', message);
    } finally {
      setActiveBookingId(null);
    }
  };

  const createAgreement = async (bookingId: string) => {
    setActiveBookingId(bookingId);
    try {
      const updatedBooking = await generateAgreement(bookingId);
      upsertBooking(updatedBooking);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate agreement';
      Alert.alert('Agreement error', message);
    } finally {
      setActiveBookingId(null);
    }
  };

  const confirmStudentAcceptance = async (bookingId: string) => {
    const trimmedName = actingStudentName.trim();
    if (!trimmedName) {
      Alert.alert('Missing student name', 'Enter the student name that is signing.');
      return;
    }

    if (!reviewChecks[bookingId]) {
      Alert.alert('Agreement review required', 'Tick the review checkbox before confirming acceptance.');
      return;
    }

    setActiveBookingId(bookingId);
    try {
      const updatedBooking = await signAgreementAsStudent(bookingId, trimmedName);
      upsertBooking(updatedBooking);
      setReviewChecks((previous) => ({ ...previous, [bookingId]: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign agreement';
      Alert.alert('Signature failed', message);
    } finally {
      setActiveBookingId(null);
    }
  };

  const ownerConfirmAndFinalize = async (bookingId: string) => {
    setActiveBookingId(bookingId);
    try {
      const updatedBooking = await ownerConfirmAgreement(bookingId);
      upsertBooking(updatedBooking);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to finalize agreement';
      Alert.alert('Confirmation failed', message);
    } finally {
      setActiveBookingId(null);
    }
  };

  const openPdf = async (booking: BookingRecord) => {
    try {
      const pdfDataUri = booking.agreement?.pdfDataUri || (await fetchAgreementPdf(booking.id));
      await Linking.openURL(pdfDataUri);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to open PDF on this device.';
      Alert.alert('Open failed', message);
    }
  };

  const renderStatus = (status: BookingStatus) => (
    <View style={styles.statusPill}>
      <Text style={styles.statusPillText}>{statusLabels[status]}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Booking & Agreement Management</Text>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.loadingText}>Syncing bookings from backend...</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.refreshButton} onPress={() => void loadBookings()}>
        <Text style={styles.refreshButtonText}>Refresh From Database</Text>
      </TouchableOpacity>

      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'student' && styles.roleButtonActive]}
          onPress={() => setRole('student')}
        >
          <Text style={[styles.roleButtonText, role === 'student' && styles.roleButtonTextActive]}>Student View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'owner' && styles.roleButtonActive]}
          onPress={() => setRole('owner')}
        >
          <Text style={[styles.roleButtonText, role === 'owner' && styles.roleButtonTextActive]}>Owner View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Submit Booking Request</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.typeButton, formState.bookingType === 'individual' && styles.typeButtonActive]}
            onPress={() => updateForm('bookingType', 'individual')}
          >
            <Text style={[styles.typeButtonText, formState.bookingType === 'individual' && styles.typeButtonTextActive]}>
              Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, formState.bookingType === 'group' && styles.typeButtonActive]}
            onPress={() => updateForm('bookingType', 'group')}
          >
            <Text style={[styles.typeButtonText, formState.bookingType === 'group' && styles.typeButtonTextActive]}>
              Group
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Requester name"
          value={formState.requesterName}
          onChangeText={(value) => updateForm('requesterName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Student names (comma-separated)"
          value={formState.studentNamesCsv}
          onChangeText={(value) => updateForm('studentNamesCsv', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Room details"
          value={formState.roomDetails}
          onChangeText={(value) => updateForm('roomDetails', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Monthly rent"
          value={formState.monthlyRent}
          keyboardType="numeric"
          onChangeText={(value) => updateForm('monthlyRent', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Period start (YYYY-MM-DD)"
          value={formState.periodStart}
          onChangeText={(value) => updateForm('periodStart', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Period end (YYYY-MM-DD)"
          value={formState.periodEnd}
          onChangeText={(value) => updateForm('periodEnd', value)}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={() => void submitBooking()} disabled={isSubmitting}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Booking Request'}</Text>
        </TouchableOpacity>
      </View>

      {role === 'student' ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Student Agreement Actions</Text>
          <TextInput
            style={styles.input}
            placeholder="Acting student name"
            value={actingStudentName}
            onChangeText={setActingStudentName}
          />
        </View>
      ) : (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Owner Decision Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional note for approve/reject"
            value={ownerDecisionNote}
            onChangeText={setOwnerDecisionNote}
          />
        </View>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Booking Status Tracking</Text>
        {sortedBookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet. Submit a booking to start the flow.</Text>
        ) : null}

        {sortedBookings.map((booking) => {
          const signatures = booking.agreement?.studentSignatures ?? {};
          const signedCount = booking.studentNames.filter((name) => Boolean(signatures[name])).length;

          return (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>{booking.id}</Text>
                {renderStatus(booking.status)}
              </View>
              <Text style={styles.bookingText}>Type: {booking.bookingType}</Text>
              <Text style={styles.bookingText}>Requester: {booking.requesterName}</Text>
              <Text style={styles.bookingText}>Students: {booking.studentNames.join(', ')}</Text>
              <Text style={styles.bookingText}>Room: {booking.roomDetails}</Text>
              <Text style={styles.bookingText}>Rent: Rs. {booking.monthlyRent.toLocaleString()} / month</Text>
              <Text style={styles.bookingText}>
                Period: {booking.periodStart} to {booking.periodEnd}
              </Text>
              {booking.ownerDecisionNote ? <Text style={styles.metaText}>Owner note: {booking.ownerDecisionNote}</Text> : null}
              {booking.agreement ? (
                <Text style={styles.metaText}>
                  Agreement {booking.agreement.agreementId} | Signatures {signedCount}/{booking.studentNames.length}
                </Text>
              ) : null}

              {role === 'owner' && booking.status === 'requested' ? (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, activeBookingId === booking.id && styles.disabledButton]}
                    onPress={() => void ownerApprove(booking.id)}
                    disabled={activeBookingId === booking.id}
                  >
                    <Text style={styles.secondaryButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dangerButton, activeBookingId === booking.id && styles.disabledButton]}
                    onPress={() => void ownerReject(booking.id)}
                    disabled={activeBookingId === booking.id}
                  >
                    <Text style={styles.dangerButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {role === 'owner' && booking.status === 'approved' ? (
                <TouchableOpacity
                  style={[styles.primaryButton, activeBookingId === booking.id && styles.disabledButton]}
                  onPress={() => void createAgreement(booking.id)}
                  disabled={activeBookingId === booking.id}
                >
                  <Text style={styles.primaryButtonText}>Generate Digital Agreement</Text>
                </TouchableOpacity>
              ) : null}

              {role === 'student' && booking.status === 'agreement_pending_signatures' ? (
                <View>
                  <View style={styles.checkboxRow}>
                    <Switch
                      value={Boolean(reviewChecks[booking.id])}
                      onValueChange={(value) => setReviewChecks((previous) => ({ ...previous, [booking.id]: value }))}
                    />
                    <Text style={styles.checkboxLabel}>I have reviewed the agreement and accept digitally</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.primaryButton, activeBookingId === booking.id && styles.disabledButton]}
                    onPress={() => void confirmStudentAcceptance(booking.id)}
                    disabled={activeBookingId === booking.id}
                  >
                    <Text style={styles.primaryButtonText}>Confirm Acceptance</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {role === 'owner' && booking.status === 'signed_ready_for_owner' ? (
                <TouchableOpacity
                  style={[styles.primaryButton, activeBookingId === booking.id && styles.disabledButton]}
                  onPress={() => void ownerConfirmAndFinalize(booking.id)}
                  disabled={activeBookingId === booking.id}
                >
                  <Text style={styles.primaryButtonText}>Owner Confirm & Save Signed Agreement</Text>
                </TouchableOpacity>
              ) : null}

              {booking.status === 'completed' ? (
                <TouchableOpacity style={styles.secondaryButton} onPress={() => void openPdf(booking)}>
                  <Text style={styles.secondaryButtonText}>Download Signed Agreement PDF</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  loadingText: {
    color: '#1f2937',
  },
  refreshButton: {
    backgroundColor: '#d1fae5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButtonText: {
    color: '#065f46',
    fontWeight: '700',
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  roleButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  roleButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  typeButtonActive: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  typeButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: '#111827',
    backgroundColor: '#fff',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  dangerButton: {
    marginTop: 8,
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    flex: 1,
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyText: {
    color: '#6b7280',
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#f9fafb',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingId: {
    fontWeight: '700',
    color: '#111827',
  },
  bookingText: {
    color: '#1f2937',
    marginBottom: 3,
  },
  metaText: {
    color: '#4b5563',
    marginTop: 6,
  },
  statusPill: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  checkboxLabel: {
    flex: 1,
    color: '#111827',
  },
});

export default BookingAgreementScreen;