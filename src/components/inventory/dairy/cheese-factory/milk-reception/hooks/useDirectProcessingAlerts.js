
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

export const useDirectProcessingAlerts = () => {
  const { toast } = useToast();
  const { data: milkReceptionData } = useMilkReception();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const alertIntervalsRef = useRef(new Map());

  // Audio alert function
  const playAudioAlert = () => {
    try {
      // Create audio context for beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio alert not supported in this browser');
    }
  };

  // Get direct processing records that need monitoring
  const getDirectProcessingRecords = () => {
    if (!milkReceptionData) return [];

    const currentTime = new Date();
    
    // Get all Direct Processing records
    const directProcessingRecords = milkReceptionData
      .filter(record => record.tank_number === 'Direct-Processing')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (directProcessingRecords.length === 0) return [];

    // Calculate net volume (positive additions minus negative utilizations)
    const totalNetVolume = directProcessingRecords.reduce((total, record) => {
      return total + (record.milk_volume || 0);
    }, 0);

    // If no milk remaining, return empty array
    if (totalNetVolume <= 0) return [];

    // Get positive records (milk additions) that are still valid
    const positiveRecords = directProcessingRecords.filter(r => r.milk_volume > 0);
    
    if (positiveRecords.length === 0) return [];

    // Find records that still have milk remaining and need alerts
    let remainingVolume = totalNetVolume;
    const alertRecords = [];

    // Process records in reverse chronological order to determine which milk is still present
    const sortedPositiveRecords = [...positiveRecords].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const record of sortedPositiveRecords) {
      if (remainingVolume > 0) {
        const submissionTime = new Date(record.created_at);
        const alertTime = new Date(submissionTime.getTime() + 30 * 60 * 1000); // 30 minutes after submission
        const timeUntilAlert = alertTime - currentTime;
        
        // Only include if milk is still present and hasn't been fully utilized
        const volumeFromThisEntry = Math.min(remainingVolume, record.milk_volume);
        
        if (volumeFromThisEntry > 0) {
          alertRecords.unshift({
            id: record.id,
            supplier_name: record.supplier_name || 'Unknown',
            milk_volume: volumeFromThisEntry,
            submissionTime,
            alertTime,
            timeUntilAlert,
            shouldAlert: timeUntilAlert <= 0 // Should alert if 30+ minutes have passed
          });
          
          remainingVolume -= volumeFromThisEntry;
        }
      }
    }

    return alertRecords;
  };

  // Show alert with audio
  const showAlertWithAudio = (record) => {
    const minutesPassed = Math.floor((new Date() - record.submissionTime) / (1000 * 60));

    playAudioAlert();
    
    toast({
      title: "🚨 Direct Processing Milk Alert",
      description: `${record.milk_volume.toFixed(1)}L from ${record.supplier_name} has been in Direct Processing for ${minutesPassed} minutes. Please process or transfer to storage tanks immediately!`,
      variant: "destructive",
      duration: 10000,
    });
  };

  // Monitor direct processing milk and set up alerts
  useEffect(() => {
    const alertRecords = getDirectProcessingRecords();
    
    // Clear existing intervals
    alertIntervalsRef.current.forEach((interval) => {
      clearInterval(interval);
      clearTimeout(interval);
    });
    alertIntervalsRef.current.clear();

    alertRecords.forEach((record) => {
      const recordId = record.id;
      
      // If should already be alerting, start immediately
      if (record.shouldAlert) {
        // Show immediate alert
        showAlertWithAudio(record);

        // Set up 30-minute interval alerts
        const intervalId = setInterval(() => {
          const updatedRecords = getDirectProcessingRecords();
          const currentRecord = updatedRecords.find(r => r.id === recordId);
          
          // Stop alerting if milk is no longer in the system
          if (!currentRecord || !currentRecord.shouldAlert) {
            clearInterval(intervalId);
            alertIntervalsRef.current.delete(recordId);
            return;
          }

          showAlertWithAudio(currentRecord);
        }, 30 * 60 * 1000); // 30 minutes

        alertIntervalsRef.current.set(recordId, intervalId);
      } else {
        // Set timeout to start alerting when 30 minutes is reached
        const timeoutId = setTimeout(() => {
          const updatedRecords = getDirectProcessingRecords();
          const currentRecord = updatedRecords.find(r => r.id === recordId);
          
          if (currentRecord && currentRecord.shouldAlert) {
            // Show first alert
            showAlertWithAudio(currentRecord);

            // Set up 30-minute interval alerts
            const intervalId = setInterval(() => {
              const latestRecords = getDirectProcessingRecords();
              const latestRecord = latestRecords.find(r => r.id === recordId);
              
              if (!latestRecord || !latestRecord.shouldAlert) {
                clearInterval(intervalId);
                alertIntervalsRef.current.delete(recordId);
                return;
              }

              showAlertWithAudio(latestRecord);
            }, 30 * 60 * 1000);

            alertIntervalsRef.current.set(recordId, intervalId);
          }
        }, record.timeUntilAlert);

        alertIntervalsRef.current.set(`timeout_${recordId}`, timeoutId);
      }
    });

    // Update active alerts state
    setActiveAlerts(alertRecords);

    // Cleanup function
    return () => {
      alertIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
        clearTimeout(interval);
      });
      alertIntervalsRef.current.clear();
    };
  }, [milkReceptionData, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      alertIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
        clearTimeout(interval);
      });
      alertIntervalsRef.current.clear();
    };
  }, []);

  return {
    activeAlerts: activeAlerts.filter(record => record.shouldAlert)
  };
};
