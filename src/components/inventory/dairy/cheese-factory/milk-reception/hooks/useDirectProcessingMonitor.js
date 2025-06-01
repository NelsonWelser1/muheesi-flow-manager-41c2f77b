
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

export const useDirectProcessingMonitor = () => {
  const { toast } = useToast();
  const { data: milkReceptionData } = useMilkReception();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const alertIntervalsRef = useRef(new Map());

  // Audio alert function
  const playAudioAlert = () => {
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
  };

  // Calculate available capacity in tanks
  const calculateTankCapacity = (tankName) => {
    if (!milkReceptionData) return 0;
    
    const TANK_CAPACITIES = {
      'Tank A': 5000,
      'Tank B': 3000
    };

    const tankRecords = milkReceptionData
      .filter(record => record.tank_number === tankName)
      .reduce((total, record) => total + (record.milk_volume || 0), 0);

    const capacity = TANK_CAPACITIES[tankName] || 0;
    return Math.max(0, capacity - tankRecords);
  };

  // Get direct processing records that need monitoring
  const getDirectProcessingRecords = () => {
    if (!milkReceptionData) return [];

    return milkReceptionData
      .filter(record => 
        record.tank_number === 'Direct-Processing' && 
        record.milk_volume > 0
      )
      .map(record => ({
        ...record,
        submissionTime: new Date(record.created_at),
        expiryTime: new Date(new Date(record.created_at).getTime() + 3 * 60 * 60 * 1000), // 3 hours
        timeRemaining: new Date(new Date(record.created_at).getTime() + 3 * 60 * 60 * 1000) - new Date()
      }))
      .filter(record => record.timeRemaining > 0);
  };

  // Show alert with audio
  const showAlertWithAudio = (record, suggestedTank) => {
    const timeRemainingHours = Math.floor(record.timeRemaining / (1000 * 60 * 60));
    const timeRemainingMinutes = Math.floor((record.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    playAudioAlert();
    
    toast({
      title: "🚨 Direct Processing Milk Alert",
      description: `${record.milk_volume}L of milk expires in ${timeRemainingHours}h ${timeRemainingMinutes}m. ${suggestedTank ? `Transfer to ${suggestedTank}` : 'Process immediately!'}`,
      variant: "destructive",
      duration: 10000,
    });
  };

  // Monitor direct processing milk
  useEffect(() => {
    const directProcessingRecords = getDirectProcessingRecords();
    
    // Clear existing intervals
    alertIntervalsRef.current.forEach((interval) => clearInterval(interval));
    alertIntervalsRef.current.clear();

    directProcessingRecords.forEach((record) => {
      const recordId = record.id;
      
      // Calculate when to start alerts (immediately if less than 3 hours, or when 30 minutes remain)
      const alertStartTime = Math.max(0, record.timeRemaining - (30 * 60 * 1000));
      
      // Set timeout to start 30-minute interval alerts
      const startTimeout = setTimeout(() => {
        // Determine best tank for transfer
        const tankACapacity = calculateTankCapacity('Tank A');
        const tankBCapacity = calculateTankCapacity('Tank B');
        
        let suggestedTank = null;
        if (record.milk_volume <= tankACapacity && record.milk_volume <= tankBCapacity) {
          suggestedTank = tankACapacity >= tankBCapacity ? 'Tank A' : 'Tank B';
        } else if (record.milk_volume <= tankACapacity) {
          suggestedTank = 'Tank A';
        } else if (record.milk_volume <= tankBCapacity) {
          suggestedTank = 'Tank B';
        }

        // Show initial alert
        showAlertWithAudio(record, suggestedTank);

        // Set up 30-minute interval alerts
        const intervalId = setInterval(() => {
          const updatedRecords = getDirectProcessingRecords();
          const currentRecord = updatedRecords.find(r => r.id === recordId);
          
          if (!currentRecord || currentRecord.timeRemaining <= 0) {
            clearInterval(intervalId);
            alertIntervalsRef.current.delete(recordId);
            return;
          }

          // Recalculate tank capacities
          const newTankACapacity = calculateTankCapacity('Tank A');
          const newTankBCapacity = calculateTankCapacity('Tank B');
          
          let newSuggestedTank = null;
          if (currentRecord.milk_volume <= newTankACapacity && currentRecord.milk_volume <= newTankBCapacity) {
            newSuggestedTank = newTankACapacity >= newTankBCapacity ? 'Tank A' : 'Tank B';
          } else if (currentRecord.milk_volume <= newTankACapacity) {
            newSuggestedTank = 'Tank A';
          } else if (currentRecord.milk_volume <= newTankBCapacity) {
            newSuggestedTank = 'Tank B';
          }

          showAlertWithAudio(currentRecord, newSuggestedTank);
        }, 30 * 60 * 1000); // 30 minutes

        alertIntervalsRef.current.set(recordId, intervalId);
      }, alertStartTime);

      // Store timeout reference
      alertIntervalsRef.current.set(`timeout_${recordId}`, startTimeout);
    });

    // Update active alerts state
    setActiveAlerts(directProcessingRecords);

    // Cleanup function
    return () => {
      alertIntervalsRef.current.forEach((interval) => {
        if (typeof interval === 'number') {
          clearInterval(interval);
          clearTimeout(interval);
        }
      });
      alertIntervalsRef.current.clear();
    };
  }, [milkReceptionData, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      alertIntervalsRef.current.forEach((interval) => {
        if (typeof interval === 'number') {
          clearInterval(interval);
          clearTimeout(interval);
        }
      });
      alertIntervalsRef.current.clear();
    };
  }, []);

  return {
    activeAlerts,
    calculateTankCapacity
  };
};
