import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateAttendance } from '@services/jobs';

export const useAttendance = (refetchCallback) => {
    // Mutation for updating attendance
    const updateAttendanceMutation = useMutation({
        mutationFn: (attendanceData) => updateAttendance(attendanceData),
        onSuccess: () => {
            if (refetchCallback) {
                refetchCallback(); // Refresh the jobs data after successful update
            }
        }
    });

    // Handle attendance change
    const handleAttendanceChange = useCallback((jobId, studentId, date, type, value) => {
        updateAttendanceMutation.mutate({
            jobId,
            studentId,
            date,
            type, // This should be 'AM' or 'PM', not 'morningAttended' or 'eveningAttended'
            value
        });
    }, [updateAttendanceMutation]);

    return {
        updateAttendanceMutation,
        handleAttendanceChange,
        isUpdatingAttendance: updateAttendanceMutation.isPending,
        updateAttendanceError: updateAttendanceMutation.error
    };
};