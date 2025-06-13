
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const useCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Helper function to determine certification status based on dates
  const determineStatus = (cert) => {
    if (!cert.issue_date || !cert.expiry_date) {
      return cert.status === 'in-process' ? 'in-process' : 'pending';
    }
    
    const now = new Date();
    const expiryDate = new Date(cert.expiry_date);
    
    // If expiry date is in the past, it's expired
    if (expiryDate < now) {
      return 'expired';
    }
    
    // If expiry date is within 30 days, it's expiring soon
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    if (expiryDate <= thirtyDaysFromNow) {
      return 'expiring-soon';
    }
    
    return 'valid';
  };

  // Fetch all certifications
  const fetchCertifications = async () => {
    try {
      setLoading(true);
      console.log('Fetching certifications from Supabase...');
      
      const { data, error } = await supabase
        .from('association_certifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching certifications:', error);
        setError(error.message);
        showErrorToast(toast, error.message);
        return;
      }
      
      console.log('Certifications fetched successfully:', data);
      
      // Format the date fields for display and parse JSON requirements
      const formattedData = data.map(cert => {
        // Determine the current status based on dates
        const calculatedStatus = determineStatus(cert);
        
        // If the status has changed, update it in the database
        if (calculatedStatus !== cert.status) {
          updateCertificationStatus(cert.id, calculatedStatus);
        }
        
        return {
          ...cert,
          issueDate: cert.issue_date ? new Date(cert.issue_date) : null,
          expiryDate: cert.expiry_date ? new Date(cert.expiry_date) : null,
          requirements: Array.isArray(JSON.parse(cert.requirements)) ? JSON.parse(cert.requirements) : [],
          status: calculatedStatus // Use the calculated status
        };
      });
      
      setCertifications(formattedData || []);
    } catch (err) {
      console.error('Unexpected error fetching certifications:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update the status of a certification (internal function)
  const updateCertificationStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('association_certifications')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating certification status:', error);
      }
    } catch (err) {
      console.error('Unexpected error updating certification status:', err);
    }
  };

  // Create a new certification
  const createCertification = async (certificationData) => {
    try {
      setLoading(true);
      
      // Transform the data to match the database schema
      const dbCertification = {
        name: certificationData.name,
        issuer: certificationData.issuer,
        status: certificationData.status,
        issue_date: certificationData.issueDate,
        expiry_date: certificationData.expiryDate,
        notes: certificationData.notes,
        progress: certificationData.status === 'in-process' ? 10 : 100,
        requirements: JSON.stringify(certificationData.requirements || [])
      };
      
      console.log('Creating new certification with data:', dbCertification);
      
      const { data, error } = await supabase
        .from('association_certifications')
        .insert([dbCertification])
        .select();
      
      if (error) {
        console.error('Error creating certification:', error);
        setError(error.message);
        showErrorToast(toast, `Error creating certification: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Certification created successfully:', data);
      
      // Format the returned data
      const formattedData = data.map(cert => ({
        ...cert,
        id: cert.id,
        issueDate: cert.issue_date ? new Date(cert.issue_date) : null,
        expiryDate: cert.expiry_date ? new Date(cert.expiry_date) : null,
        requirements: Array.isArray(JSON.parse(cert.requirements)) ? JSON.parse(cert.requirements) : [],
        status: determineStatus(cert) // Use the calculated status
      }))[0];
      
      // Update the local state
      setCertifications(prev => [formattedData, ...prev]);
      
      showSuccessToast(toast, `${certificationData.name} has been successfully added`);
      
      return { success: true, data: formattedData };
    } catch (err) {
      console.error('Unexpected error creating certification:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update a certification
  const updateCertification = async (id, updates) => {
    try {
      setLoading(true);
      
      // Transform the data to match the database schema
      const dbUpdates = {
        ...(updates.name && { name: updates.name }),
        ...(updates.issuer && { issuer: updates.issuer }),
        ...(updates.status && { status: updates.status }),
        ...(updates.issueDate && { issue_date: updates.issueDate }),
        ...(updates.expiryDate && { expiry_date: updates.expiryDate }),
        ...(updates.notes !== undefined && { notes: updates.notes }),
        ...(updates.progress !== undefined && { progress: updates.progress }),
        ...(updates.requirements && { requirements: JSON.stringify(updates.requirements) })
      };
      
      console.log(`Updating certification ${id} with:`, dbUpdates);
      
      const { data, error } = await supabase
        .from('association_certifications')
        .update(dbUpdates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating certification:', error);
        setError(error.message);
        showErrorToast(toast, `Error updating certification: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Certification updated successfully:', data);
      
      // Format the returned data
      const formattedData = data.map(cert => ({
        ...cert,
        issueDate: cert.issue_date ? new Date(cert.issue_date) : null,
        expiryDate: cert.expiry_date ? new Date(cert.expiry_date) : null,
        requirements: Array.isArray(JSON.parse(cert.requirements)) ? JSON.parse(cert.requirements) : [],
        status: determineStatus(cert) // Use the calculated status
      }))[0];
      
      // Update the local state
      setCertifications(prev => 
        prev.map(cert => cert.id === id ? formattedData : cert)
      );
      
      showSuccessToast(toast, "Certification updated successfully");
      
      return { success: true, data: formattedData };
    } catch (err) {
      console.error('Unexpected error updating certification:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete a certification
  const deleteCertification = async (id) => {
    try {
      setLoading(true);
      
      console.log(`Deleting certification ${id}`);
      
      const { error } = await supabase
        .from('association_certifications')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting certification:', error);
        setError(error.message);
        showErrorToast(toast, `Error deleting certification: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Certification deleted successfully');
      
      // Update the local state
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      
      showSuccessToast(toast, "Certification deleted successfully");
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting certification:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get certification details by ID
  const getCertificationById = (id) => {
    return certifications.find(cert => cert.id === id) || null;
  };

  // Update certification progress
  const updateCertificationProgress = async (id, progress) => {
    return updateCertification(id, { progress });
  };

  // Update certification requirement status
  const updateRequirementStatus = async (certId, reqId, status) => {
    const certification = getCertificationById(certId);
    if (!certification) return { success: false, error: 'Certification not found' };
    
    const updatedRequirements = certification.requirements.map(req => 
      req.id === reqId ? { ...req, status } : req
    );
    
    // Calculate new progress based on requirements
    const completedCount = updatedRequirements.filter(req => req.status === 'complete').length;
    const totalCount = updatedRequirements.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : certification.progress;
    
    return updateCertification(certId, { 
      requirements: updatedRequirements,
      progress: newProgress
    });
  };

  return {
    certifications,
    loading,
    error,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    getCertificationById,
    updateCertificationProgress,
    updateRequirementStatus
  };
};
