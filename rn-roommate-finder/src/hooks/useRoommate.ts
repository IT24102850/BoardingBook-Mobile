import { useEffect, useState } from 'react';
import { fetchRoommates, sendRequest } from '../services/roommateService';
import { Roommate } from '../types';

const useRoommate = () => {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoommates = async () => {
      try {
        const data = await fetchRoommates();
        setRoommates(data);
      } catch (err) {
        setError('Failed to load roommates');
      } finally {
        setLoading(false);
      }
    };

    loadRoommates();
  }, []);

  const requestRoommate = async (roommateId: string) => {
    try {
      await sendRequest(roommateId);
      // Optionally, update state or notify user
    } catch (err) {
      setError('Failed to send request');
    }
  };

  return { roommates, loading, error, requestRoommate };
};

export default useRoommate;